const config = {
    // 预定义一些全局变量
    env: {
        browser: true,
        es6: true
    },
    // required to lint *.vue files
    plugins: ['html'],
    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: 'build/webpack.prod.conf.js'
            }
        }
    },
    // 全局变量
    globals: {
        Vue: true,
        ga: true,
        httpRequestor: true,
        gDevEnv: true,
        gBaseUrl: false,
        gaDev: true
    },
    // add your custom rules here
    rules: {
        // 禁止alert语句
        'no-alert': 2,
        // 客户端允许在条件中写require，webpack支持这种语法。并且按需加载时必须这样写
        'global-require': 0,
        // 箭头函数允许单个参数不加空格
        'arrow-parens': 0
        // 'arrow-parens': ["error", "as-needed"]
    }
}

// 以下在开发环境关闭一些可以用fix修复的样式错误，开发时写测试代码可以不用那么规范
if (!process || !process.env || process.env.NODE_ENV !== 'production') {
    // 允许debugger语句
    config.rules['no-debugger'] = 0
    // 允许alert语句
    config.rules['no-alert'] = 0
    // 在花括号下面有空行，仅提示
    config.rules['padded-blocks'] = 1
    // 在括号里面紧贴着有空格，仅提示
    config.rules['space-in-parens'] = 1
    // 不限制缩进
    config.rules['indent'] = 0
    // 不限制连续空行
    config.rules['no-multiple-empty-lines'] = 0
    // 对象的key后面可以有空格
    config.rules['key-spacing'] = 0
    // 不限制连续空格
    config.rules['no-multi-spaces'] = 0
    // 逗号后允许不加空格
    config.rules['comma-spacing'] = 0
    // 允许在可以使用const的场景使用let
    config.rules['prefer-const'] = 0
    // 执行不到的代码，仅提示
    config.rules['no-unreachable'] = 1
    // if的括号和花括号之间可以没有空格
    config.rules['space-before-blocks'] = 1
    // else左右可以没有空格
    config.rules['keyword-spacing'] = 1
    // 行尾可以有空格
    config.rules['no-trailing-spaces'] = 1
    // .前面可以有空格
    config.rules['no-whitespace-before-property'] = 1
    // 运算符前面可以有空格
    config.rules['space-infix-ops'] = 1
    // 注释斜线后面可以有空格
    config.rules['spaced-comment'] = 1
    // 数组中括号前后可以有空格
    config.rules['array-bracket-spacing'] = 1
    // 箭头函数前后可以没有空格
    config.rules['arrow-spacing'] = 1
    // 换行的箭头函数中参数可以不加括号
    config.rules['arrow-parens'] = 0
    // 可以不用模板字符串直接拼接普通字符串
    config.rules['prefer-template'] = 1
    // 不强制用点操作符来取对象属性
    config.rules['dot-notation'] = 1
    // 不再检查是否把依赖库写到了devDependencies中
    config.rules['import/no-extraneous-dependencies'] = 0
}

module.exports = config
