import { get as _get } from 'lodash'

/**
 * 提供在所有页面都可以使用的通用的方法
 */
export default {
    /**
     * 访问sessionStorage接口，支持直接读写object。这里的取值表示是否在读取过一次后就删除。用法如下
     * util.sessionStorage.XX_DATA_FOMR_OO_PAGE = 'abc'
     * util.sessionStorage.XX_DATA_FOMR_OO_PAGE = {b:1, c:[234,{d:'ab"cd\'efg'}]}
     * console.log(util.sessionStorage.XX_DATA_FOMR_OO_PAGE)
     */
    sessionStorage: initStorage(sessionStorage, {
        // 当前选中的商品信息
        SELECTED_GOODS_INFO: false,
        // 统计跟踪代码
        TRACK_FROM: false,
        // 邀请码
        PROMO_CODE: false,
    }),
    /**
     * 访问localStorage接口，支持直接读写object。这里的取值表示是否在读取过一次后就删除。用法同sessionStorage
     */
    localStorage: initStorage(localStorage, {
        // XX页面用户输入的草稿内容
        XX_PAGE_DRAFT: false,
    }),
};

/**
 * 初始化storage代理
 * @param {Storage} stub
 * @param {object} propMap
 */
function initStorage(stub, propMap) {
    // PhantomJs预渲染时不支持Proxy
    if (typeof Proxy === 'undefined') {
        return {}
    }
    return new Proxy({}, {
        get(target, key) {
            return getItem(key, propMap[key])
        },
        set(target, key, value) {
            setItem(key, value)
            // 必须返回true或抛异常，否则会报错'set' on proxy: trap returned falsish for property 'xxx'
            return true
        }
    })

    function getItem(key, isOneshot) {
        const realKey = getRealKey(key)
        let value = stub.getItem(realKey)
        if (value !== undefined) {
            try {
                value = JSON.parse(value)
            } catch (e) {
                if (e.name === 'SyntaxError') {
                    console.error(`can't parse [${realKey}]: ${value}`)
                    removeItem(key)
                } else {
                    console.error(e)
                }
                value = undefined;
            }
            if (isOneshot) {
                removeItem(key)
            }
        }
        return value;
    }

    function setItem(key, value) {
        if (value === undefined) {
            removeItem(key)
            return
        }
        const realKey = getRealKey(key)
        try {
            stub.setItem(realKey, JSON.stringify(value));
        } catch (e) {
            if (e.name === 'QuotaExceededError' && stub.length) {
                // 空间不足
                stub.clear();
                stub.setItem(realKey, JSON.stringify(value))
            } else {
                console.error(e)
            }
        }
    }

    function removeItem(key) {
        const realKey = getRealKey(key)
        try {
            stub.removeItem(realKey)
        } catch (e) {
            console.error(e)
        }
    }

    function getRealKey(key) {
        return `BOOK_STORE_${key}${window.gDevEnv ? '_dev' : ''}`
    }
}