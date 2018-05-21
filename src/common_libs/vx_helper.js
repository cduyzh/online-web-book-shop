import {clone, get} from 'lodash'
import Vue from 'vue'
import {isSameArray} from './util'

/**
 * 提供vuex相关的工具方法
 */
export default {
    createStateModifier,
    mapModifiable,
    makeModifiableArrayMixin,
};

/**
 * 将字符串首字母改为大写
 */
function upperCaseFirstLetter(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1)
}

/**
 * 创建一个mutation数据，用于修改vuex中指定对象的任意属性。可与mapModifiable和makeModifiableMixin方法配合使用。
 * 该mutation有两个参数key和value，key为对象上要修改的属性名，若不填则替换整个对象
 * @param {string} objName
 * @param {object} defaultValuesMap={} 各属性的默认值，可解决属性为undefined时无法建立计算变量映射和双向绑定的问题
 *              key为要设置默认值的属性名，value为默认值。
 *              value是对象的，会被深拷贝后使用；value是方法的，则会执行后使用其返回结果
 * @return {object}
 *
 *
 * @example
 * [mutations.js]
 * export default {
 *      // 创建一个名为modifyEditingAccount的mutation。用于修改state上的editingAccount数据。修改时会设置默认的name,tasks,createdAt属性
        ...createStateModifier('editingAccount', {name: '', tasks:[], createdAt:() => Date.now()}),
 * }
 *
 * [my_account.vue]
 * // 设置state上editingAccount的phone属性
 * this.$store.commit('modifyEditingAccount', {key: 'phone', value: ''})
 * // 设置state上的editingAccount对象
 * this.$store.commit('modifyEditingAccount', {value: {name: 'lnk', age: 18}})
 * // 清空state上的editingAccount对象，但name,tasks,createdAt属性会用mutation中定义的默认值填充
 * this.$store.commit('modifyEditingAccount', {value: {}})
 */
export function createStateModifier(objName, defaultValuesMap = {}) {
    const mutationName = `modify${objName.charAt(0).toUpperCase() + objName.slice(1)}`
    return {
        [mutationName]: (state, {key, value}) => {
            if (key !== undefined) {
                // 设置一个属性
                const newValue = value === undefined ? getDefaultValue(defaultValuesMap[key]) : value
                if (state[objName][key] === undefined) {
                    // 全新的属性，使用Vue.set设置
                    Vue.set(state[objName], key, newValue)
                } else {
                    state[objName][key] = newValue
                }
            } else if (typeof value !== 'object') {
                state[objName] = value
            } else {
                // 设置整个对象
                const result = clone(value, true)
                Object.entries(defaultValuesMap).forEach(([field, defaultValue]) => {
                    if (!result.hasOwnProperty(field)) {
                        result[field] = getDefaultValue(defaultValue)
                    }
                })
                state[objName] = result
            }
        }
    }
}

// 解析默认值配置信息，获取真正的默认值
function getDefaultValue(defaultValueInfo) {
    if (defaultValueInfo === undefined) {
        return undefined
    } else if (typeof defaultValueInfo === 'object') {
        return clone(defaultValueInfo, true)
    } else if (typeof defaultValueInfo === 'function') {
        return defaultValueInfo()
    } else {
        return defaultValueInfo
    }
}

/**
 * makeModifiableMixin的快捷方法。
 * 将一个vuex中的state或getter映射为组件上的计算属性，这个属性会自动通过mutation修改，避免了直接修改vuex变量而报错，方便直接双向绑定到组件上。
 * 注意，映射后的属性只能用赋值的方式修改，数组的push等方法依然会报错，因此数组属性请使用mapArrayModifiable
 * @param {object} ruleMap key为映射后的属性名。value为要映射的属性路径，属性变化时会自动commit对应模块下的modify方法。具体见示例
 * @returns {object} 返回的是对象，需要通过扩展运算符展开到组件的computed中
 *
 *
 * @example
 * export default {
 *      computed: {
 *          ...mapModifiable({
 *              // 生成一个叫vxName的计算变量。修改vxName时会commit('account/modifyMyAccount', {key: 'name', value: newNameValue})
 *              vxName: 'state:account/myAccount.name',
 *              // 生成一个叫vxPhone的计算变量。修改vxPhone时会commit('account/modifyMyPhone', {key: '', value: newPhoneValue})
 *              vxPhone: 'getters:account/myPhone',
 *              // 生成一个叫vxIsLoadingPage的计算变量。修改vxIsLoadingPage时会commit('modifyIsLoadingPage', {key: '', value: newIsLoadingPageValue})
 *              vxIsLoadingPage: 'state:isLoadingPage',
 *          )
 *      }
 * }
 */
export function mapModifiable(ruleMap) {
    const result = {}
    Object.keys(ruleMap).forEach((computedName) => {
        const {getter, setter} = makeVuexGetterSetter(ruleMap[computedName], false)
        result[computedName] = {
            set (newValue) {
                setter.call(this, newValue)
            },
            get: getter
        }
    })
    return result
}

/**
 * 两个数组中的元素是否相同的比较器
 *
 * @callback vueArrayComparator
 * @param {*} item1
 * @param {*} item2
 * @returns {boolean} 是否相等
 */

/**
 * 将一个vuex中state或getter映射为组件上的属性，这个属性会自动通过mutation修改，避免了直接修改vuex变量而报错，方便直接双向绑定到组件上。
 * 注意这种双向绑定是靠watch实现的，会有延迟
 * @param {object} rule 映射规则
 * @param {string} rule.name 映射后的data属性名
 * @param {string} [rule.src] 映射的vuex数据来源路径
 * @param {string} [rule.arraySrc] 映射的vuex数组数据来源路径。与src互斥
 * @param {vueArrayComparator} [rule.comparator] 映射的vuex数据来源是数组时，在值变化时可能出现互相set死循环。
 *                              因此需要根据该方法判断组件内的数组和vuex上的是否相同。默认是对每个元素进行全等比较
 * @returns {object} Vue的mixin对象
 *
 *
 * @example
 * export default {
        mixins: [
 *          // 生成一个叫vxName的计算变量。修改vxName时会commit('account/modifyMyAccount', {key: 'name', value: newNameValue})
 *          vxHelper.makeModifiableMixin({name: 'vxName', src: 'state:account/myAccount.name'}),
 *          // 生成一个叫vxPhone的计算变量。修改vxPhone时会commit('account/modifyMyPhone', {key: '', value: newPhoneValue})
 *          vxHelper.makeModifiableMixin({name: 'vxPhone', src: 'getters:account/myPhone'}),
 *          // 生成一个叫vxIsLoadingPage的计算变量。修改vxIsLoadingPage时会commit('modifyIsLoadingPage', {key: '', value: newIsLoadingPageValue})
 *          vxHelper.makeModifiableMixin({name: 'vxIsLoadingPage', src: 'isLoadingPage'}),
 *          // 生成一个叫vxGroupIds的data和一个叫vxGroupIdsStub的只读计算变量。修改vxGroupIds时会commit('staff/modifyEditingStaff', {key: 'groupIds', value: newGroupIds})
 *          vxHelper.makeModifiableMixin({name: 'vxGroupIds', arraySrc: 'state:staff/editingStaff.groupIds'}),
 *      ]
 * }
 */
export function makeModifiableArrayMixin(rule) {
    const {getter, setter} = makeVuexGetterSetter(rule.arraySrc, true)
    const dataName = rule.name
    const computedName = `${dataName}Stub`
    return {
        data() {
            // 从vuex中获取初值
            return {[dataName]: getter.apply(this)}
        },
        computed: {
            // 只读计算变量，用来监听vuex中值的变化
            [computedName]: getter
        },
        watch: {
            [dataName](newValue) {
                if (!isSameArray(this[computedName], newValue, rule.comparator)) {
                    setter.call(this, newValue)
                }
            },
            [computedName](newValue) {
                if (!isSameArray(this[dataName], newValue, rule.comparator)) {
                    this[dataName] = clone(newValue)
                }
            }
        }
    }
}

/**
 * 根据指定的vuex数据路径，获取数据的读取和写入方法，写入是靠mutation实现的，因此需要与createStateModifier搭配使用
 * @param rule
 * @param isArray
 * @returns {*}
 */
function makeVuexGetterSetter(rule, isArray) {
    const ruleInfo = parseRule(rule)
    if (!ruleInfo) {
        console.error('vuex映射规则格式不正确', rule)
        return {}
    }
    // 这里的this指Vue组件上下文
    const getter = function getter() {
        const obj = get(this.$store, ruleInfo.storePath)
        if (obj !== undefined) {
            // 深拷贝以免组件中修改返回出去的对象属性时报了未通过mutation直接修改vuex中的值的错
            return clone(obj, true)
        } else {
            return isArray ? [] : undefined
        }
    }
    // 这里的this指Vue组件上下文
    const setter = function setter(newValue) {
        this.$store.commit(ruleInfo.commitType, {
            key: ruleInfo.storeFieldName || undefined,
            value: clone(newValue)
        })
    }
    return {getter, setter}
}

/** 解析映射规则 */
function parseRule(rule) {
    const [storeSrc, modulePath, objName, storeFieldName] = splitVxSrc(rule)
    // console.log('splitVxSrc', storeSrc, modulePath, objName, storeFieldName)
    if (!storeSrc || !objName) {
        return null
    }

    let objPath
    if (storeSrc === 'state') {
        objPath = `${modulePath.replace(/\//g, '.')}${objName}`
    } else {
        objPath = `${modulePath}${objName}`
    }
    if (storeFieldName) {
        objPath += `.${storeFieldName}`
    }

    return {
        storePath: `${storeSrc}.${objPath}`,
        storeFieldName,
        commitType: `${modulePath}modify${upperCaseFirstLetter(objName)}`,
    }
}

/** 按照[storeSrc:][modulePath]objName[.fieldName]的格式拆分出各部分 */
function splitVxSrc(rule) {
    let storeSrc = null
    let path = null
    // 拆分出state/getters
    let items = rule.split(':')
    if (items.length === 1) {
        // 若没有冒号，则默认为state
        storeSrc = 'state'
        path = items[0]
    } else if (items.length === 2) {
        storeSrc = items[0]
        path = items[1]
    }
    if (storeSrc !== 'state' && storeSrc !== 'getters' || !path) {
        console.error(`wrong src format in ${rule}`)
    }
    // 拆分末尾的属性名
    items = path.split('.')
    path = items[0]
    const fieldName = items[1] || ''
    if (items.length > 2) {
        console.error(`wrong field format in ${rule}`)
    }
    // 拆分模块名和目标对象名
    let modulePath = ''
    let objName = path
    const objIndex = path.lastIndexOf('/')
    if (objIndex >= 0) {
        modulePath = path.slice(0, objIndex + 1)
        objName = path.slice(objIndex + 1)
    }
    return [storeSrc, modulePath, objName, fieldName]
}
