/*!
 * vue-router v3.0.6
 * (c) 2019 Evan You
 * @license MIT
 */2
(
    // 匿名函数自运行， 外边使用(), 使其拥有自己的独立空间，与其他函数不冲突
    // 参数 global： this， window对象，VueRoute绑定到window中
    // 参数 factory：匿名函数   返回了VueRouter
    function(global, factory) {
        // module和exports是node.js中存在的对象, 存在则导出匿名函数，匿名函数返回了VueRouter  (commonjs中存在的导入方法)
        typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            // AMDJS CMDJS 中存在的导入导出模块规范
            typeof define === 'function' && define.amd ? define(factory) :
            // 将VueRoute绑定到window中
            (global.VueRouter = factory());
    }(this,
        (function() {
            'use strict';

            /**
             * 功能： 打印路由配置的错误
             * @param {boolean} condition 
             * @param {string} message 
             */
            function assert(condition, message) {
                if (!condition) {
                    throw new Error(("[vue-router] " + message))
                }
            }

            /**
             * 功能： 打印警告
             * @param {boolean} condition 
             * @param {string} message 
             */
            function warn(condition, message) {
                if ("development" !== 'production' && !condition) {
                    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
                }
            }

            /**
             * 功能：判断参数类型是不是Error
             * @param {*} err 
             * 返回值： true/false
             */
            function isError(err) {
                return Object.prototype.toString.call(err).indexOf('Error') > -1
            }

            /**
             * 功能：将b中的键和值添加到a中, a中存在则改为b的值
             * @param {object} a 
             * @param {object} b 
             * 返回值: 新的a对象
             */
            function extend(a, b) {
                for (var key in b) {
                    a[key] = b[key];
                }
                return a
            }

            // 用于创建Vue的RouterView组件 ???
            var View = {
                name: 'RouterView',
                functional: true,
                props: {
                    name: {
                        type: String,
                        default: 'default'
                    }
                },
                render: function render(_, ref) {
                    var props = ref.props;
                    var children = ref.children;
                    var parent = ref.parent;
                    var data = ref.data;

                    // used by devtools to display a router-view badge
                    data.routerView = true;

                    // directly use parent context's createElement() function
                    // so that components rendered by router-view can resolve named slots
                    var h = parent.$createElement;
                    var name = props.name;
                    var route = parent.$route;
                    var cache = parent._routerViewCache || (parent._routerViewCache = {});

                    // determine current view depth, also check to see if the tree
                    // has been toggled inactive but kept-alive.
                    var depth = 0;
                    var inactive = false;
                    while (parent && parent._routerRoot !== parent) {
                        var vnodeData = parent.$vnode && parent.$vnode.data;
                        if (vnodeData) {
                            if (vnodeData.routerView) {
                                depth++;
                            }
                            if (vnodeData.keepAlive && parent._inactive) {
                                inactive = true;
                            }
                        }
                        parent = parent.$parent;
                    }
                    data.routerViewDepth = depth;

                    // render previous view if the tree is inactive and kept-alive
                    if (inactive) {
                        return h(cache[name], data, children)
                    }

                    var matched = route.matched[depth];
                    // render empty node if no matched route
                    if (!matched) {
                        cache[name] = null;
                        return h()
                    }

                    var component = cache[name] = matched.components[name];

                    // attach instance registration hook
                    // this will be called in the instance's injected lifecycle hooks
                    data.registerRouteInstance = function(vm, val) {
                        // val could be undefined for unregistration
                        var current = matched.instances[name];
                        if (
                            (val && current !== vm) ||
                            (!val && current === vm)
                        ) {
                            matched.instances[name] = val;
                        }
                    }

                    // also register instance in prepatch hook
                    // in case the same component instance is reused across different routes
                    ;
                    (data.hook || (data.hook = {})).prepatch = function(_, vnode) {
                        matched.instances[name] = vnode.componentInstance;
                    };

                    // register instance in init hook
                    // in case kept-alive component be actived when routes changed
                    data.hook.init = function(vnode) {
                        if (vnode.data.keepAlive &&
                            vnode.componentInstance &&
                            vnode.componentInstance !== matched.instances[name]
                        ) {
                            matched.instances[name] = vnode.componentInstance;
                        }
                    };

                    // resolve props
                    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
                    if (propsToPass) {
                        // clone to prevent mutation
                        propsToPass = data.props = extend({}, propsToPass);
                        // pass non-declared props as attrs
                        var attrs = data.attrs = data.attrs || {};
                        for (var key in propsToPass) {
                            if (!component.props || !(key in component.props)) {
                                attrs[key] = propsToPass[key];
                                delete propsToPass[key];
                            }
                        }
                    }

                    return h(component, data, children)
                }
            }

            // 处理props
            function resolveProps(route, config) {
                switch (typeof config) {
                    case 'undefined':
                        return
                    case 'object':
                        return config
                    case 'function':
                        return config(route)
                    case 'boolean':
                        return config ? route.params : undefined
                    default:
                        {
                            warn(
                                false,
                                "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
                                "expecting an object, function or boolean."
                            );
                        }
                }
            }

            /*  */

            var encodeReserveRE = /[!'()*]/g; // ，包含!或者'或者()
            var encodeReserveReplacer = function(c) { return '%' + c.charCodeAt(0).toString(16); };
            var commaRE = /%2C/g;

            // fixed encodeURIComponent which is more conformant to RFC3986:
            // - escapes [!'()*]
            // - preserve commas
            /**
             * 功能: 将一个字符串进行URI编码，！' () 转化为%+字符的十六进制，转化后为%2C的转化为，
             * @param {string} str 
             */
            var encode = function(str) {
                // 将含有！' ()的字符替换为%+字符串的十六进制
                return encodeURIComponent(str)
                    .replace(encodeReserveRE, encodeReserveReplacer)
                    // 将%2C替换为，
                    .replace(commaRE, ',');
            };

            /**
             * encodeURIComponent 与 decodeURIComponent 
             * 
             * 用法：encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。
             *      decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
             * 返回值：某些字符将被十六进制的转义序列进行替换。
             *        其中的十六进制转义序列将被它们表示的字符替换。
             * 
             * 什么是URI:
             *  URI包括url与urn
             *  urn就像一个人的名字，url就是这个人的地址
             * 
             * encodeURIComponent编码范围：
             *  该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 
             * ,/?:@&=+$# 这些将被转换为%+十六进制编码
             */
            // 
            var decode = decodeURIComponent;

            /**
             * 功能： 解析url中的查询字段
             * @param {string} query : url中的查询字段   '? action = get_post_info & action2 = 2222222'
             * @param {*} extraQuery ：其他二外的查询字段，json形式  {action： 'get_post_info' }
             * @param {*} _parseQuery : 解析查询参数的方法
             * 
             * 返回值：包含额外的查询参数的一个json
             * {
             *      action： get_post_info, 
             *      action2: 2222222
             * }
             */
            function resolveQuery(
                query,
                extraQuery,
                _parseQuery
            ) {
                // void 0   javascript中的一个函数，表示什么都不返回，这里判断为是不是为undefined
                if (extraQuery === void 0) extraQuery = {};

                var parse = _parseQuery || parseQuery;
                var parsedQuery;
                try {
                    parsedQuery = parse(query || '');
                } catch (e) {
                    "development" !== 'production' && warn(false, e.message);
                    parsedQuery = {};
                }
                for (var key in extraQuery) {
                    parsedQuery[key] = extraQuery[key];
                }
                return parsedQuery
            }

            /**
             * 功能：讲一个请求的参数以json的形式进行转化
             * @param {string} query 
             * 
             * ? action = get_post_info & action2 = 2222222
             * 
             * {
             *      action： get_post_info, 
             *      action2: 2222222
             * }
             * 
             * 返回值json
             */
            function parseQuery(query) {
                var res = {};

                query = query.trim().replace(/^(\?|#|&)/, '');

                if (!query) {
                    return res
                }

                query.split('&').forEach(function(param) {
                    var parts = param.replace(/\+/g, ' ').split('=');
                    var key = decode(parts.shift());
                    var val = parts.length > 0 ?
                        decode(parts.join('=')) :
                        null;

                    if (res[key] === undefined) {
                        res[key] = val;
                    } else if (Array.isArray(res[key])) {
                        res[key].push(val);
                    } else {
                        res[key] = [res[key], val];
                    }
                });

                return res
            }

            /**
             * 功能：将一个查询参数的json转化为url形式需要的字符串， 转化后的是经过encode编码过的，通过decode解码就是字符串
             * {" action ": " get_post_info ", " action2 ": " 2222222"}转化为 '? action = get_post_info & action2 = 2222222'
             * 
             * @param {json} obj 
             * 
             * 将挂载到$router.options中
             */
            function stringifyQuery(obj) {
                var res = obj ? Object.keys(obj).map(function(key) {
                        var val = obj[key];

                        if (val === undefined) {
                            return ''
                        }

                        if (val === null) {
                            return encode(key)
                        }

                        if (Array.isArray(val)) {
                            var result = [];
                            val.forEach(function(val2) {
                                if (val2 === undefined) {
                                    return
                                }
                                if (val2 === null) {
                                    result.push(encode(key));
                                } else {
                                    result.push(encode(key) + '=' + encode(val2));
                                }
                            });
                            return result.join('&')
                        }

                        return encode(key) + '=' + encode(val)
                    })
                    // 将query json转化成的数组进行过滤，排出长度小于1的
                    .filter(function(x) { return x.length > 0; })
                    // 将数组以&进行分割， 形成字符串
                    .join('&') : null;
                return res ? ("?" + res) : ''
            }

            /*  */

            // 匹配以/结尾0次或1次, 用于去掉字符串最后的/
            var trailingSlashRE = /\/?$/;

            /**
             * 
             * @param {*} record 原来的路由记录
             * @param {*} location {path: '/', query: '', hash: '', params: {}, } 
             * @param {*} redirectedFrom 
             * @param {*} router   vur-route中的$router
             */
            function createRoute(
                record,
                location,
                redirectedFrom,
                router
            ) {
                var stringifyQuery$$1 = router && router.options.stringifyQuery;

                var query = location.query || {};
                try {
                    query = clone(query);
                } catch (e) {}

                // 创建一个route
                var route = {
                    name: location.name || (record && record.name),
                    meta: (record && record.meta) || {},
                    path: location.path || '/',
                    hash: location.hash || '',
                    query: query,
                    params: location.params || {},
                    fullPath: getFullPath(location, stringifyQuery$$1), // /sceneCreate + ? aaa = fsf
                    matched: record ? formatMatch(record) : [] // 一个数组，包含当前路由的所有嵌套路径片段的路由记录 。路由记录就是 routes 配置数组中的对象副本 (还有在 children 数组)
                };
                if (redirectedFrom) {
                    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
                }
                // 冻结route这个对象，不能再向里边添加任何属性
                return Object.freeze(route)
            }

            /**
             * 功能：深度赋值一个值
             * @param {*} value 
             */
            function clone(value) {
                if (Array.isArray(value)) {
                    return value.map(clone)
                } else if (value && typeof value === 'object') {
                    var res = {};
                    for (var key in value) {
                        res[key] = clone(value[key]);
                    }
                    return res
                } else {
                    return value
                }
            }

            // the starting route that represents the initial state
            var START = createRoute(null, {
                path: '/'
            });

            // 循环想一个数组中添加record，record第一次为原始参数，以后的record为record.parent
            function formatMatch(record) {
                var res = [];
                while (record) {
                    res.unshift(record);
                    record = record.parent;
                }
                return res
            }

            /**
             * 功能：获取route的fullpath
             * @param {json} ref  {path: '/', query: '', hash: '', params: {}, } 
             * @param {function} _stringifyQuery   将query的json转化为？aaa = fs & bbb = fs 形式
             */
            function getFullPath(
                ref,
                _stringifyQuery
            ) {
                var path = ref.path;
                var query = ref.query;
                if (query === void 0) query = {};
                var hash = ref.hash;
                if (hash === void 0) hash = '';

                var stringify = _stringifyQuery || stringifyQuery;
                return (path || '/') + stringify(query) + hash
            }

            /**
             * 判断两个route是不是同一个
             * @param {*} a 
             *  route = {
                    name: location.name || (record && record.name),
                    meta: (record && record.meta) || {},
                    path: location.path || '/',
                    hash: location.hash || '',
                    query: query,
                    params: location.params || {},
                    fullPath: getFullPath(location, stringifyQuery$$1), // /sceneCreate + ? aaa = fsf
                    matched: record ? formatMatch(record) : [] // 将记录保存到route中, 如果记录中有parent也将放到matched中，一直循环，直到没有parent
                }
             * @param {*} b 
                返回值： false/ true
             */
            function isSameRoute(a, b) {
                // 判断b是不是根路径 '/'
                if (b === START) {
                    // a为根路径。结果为真
                    return a === b
                } else if (!b) {
                    return false
                }
                // b不为根路径，并且不为空, a和b的path都存在
                else if (a.path && b.path) {
                    return (
                        // 1. 去掉path后的/， 2.a和b的hash相等  3.a和b的query相等
                        a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
                        a.hash === b.hash &&
                        isObjectEqual(a.query, b.query)
                    )
                }
                // b不为根路径，并且不为空, a和b的path有一个不存在，a和b的name存在
                else if (a.name && b.name) {
                    return (
                        a.name === b.name &&
                        a.hash === b.hash &&
                        isObjectEqual(a.query, b.query) &&
                        isObjectEqual(a.params, b.params)
                    )
                }
                // b不为根路径，并且不为空, a和b的path有一个不存在，a和b的name有一个不存在
                else {
                    return false
                }
            }

            /**
             * 功能： 判断两个参数是不是相等
             * @param {*} a 
             * @param {*} b 
             */
            function isObjectEqual(a, b) {
                // 确保两个参数不为undefiend
                if (a === void 0) a = {};
                if (b === void 0) b = {};

                // handle null value #1566
                // 判断两个值有一个不为object
                if (!a || !b) { return a === b }

                var aKeys = Object.keys(a);
                var bKeys = Object.keys(b);
                // 键值长度不相等，返回两个对象不相等
                if (aKeys.length !== bKeys.length) {
                    return false
                }
                // 判断每一个键和值
                return aKeys.every(function(key) {
                    // 键值
                    var aVal = a[key];
                    var bVal = b[key];
                    // check nested equality
                    // 判断键值是不是object类型，
                    if (typeof aVal === 'object' && typeof bVal === 'object') {
                        // 再次调用函数进行判断
                        return isObjectEqual(aVal, bVal)
                    }
                    // 判断两个值是否相等
                    return String(aVal) === String(bVal)
                })
            }

            function isIncludedRoute(current, target) {
                return (
                    // target Route.path 是不是在current Route.path的开头出现
                    current.path.replace(trailingSlashRE, '/').indexOf(
                        target.path.replace(trailingSlashRE, '/')
                    ) === 0 &&
                    // target.hash不存在 ||  两个hash相等
                    (!target.hash || current.hash === target.hash) &&
                    // 判断current的query中是否存在target.query
                    queryIncludes(current.query, target.query)
                )
            }

            function queryIncludes(current, target) {
                for (var key in target) {
                    // 判断target.query中的字段是否在current.query中存在
                    if (!(key in current)) {
                        return false
                    }
                }
                // 全部存在返回true
                return true
            }

            /*  */

            // work around weird flow bug
            var toTypes = [String, Object];
            var eventTypes = [String, Array];
            // vue RouterLink组件定义
            var Link = {
                name: 'RouterLink',
                props: {
                    to: {
                        type: toTypes,
                        required: true
                    },
                    tag: {
                        type: String,
                        default: 'a'
                    },
                    exact: Boolean,
                    append: Boolean,
                    replace: Boolean,
                    activeClass: String,
                    exactActiveClass: String,
                    event: {
                        type: eventTypes,
                        default: 'click'
                    }
                },
                render: function render(h) {
                    var this$1 = this;

                    var router = this.$router;
                    var current = this.$route;
                    var ref = router.resolve(this.to, current, this.append);
                    var location = ref.location;
                    var route = ref.route;
                    var href = ref.href;

                    var classes = {};
                    var globalActiveClass = router.options.linkActiveClass;
                    var globalExactActiveClass = router.options.linkExactActiveClass;
                    // Support global empty active class
                    var activeClassFallback = globalActiveClass == null ?
                        'router-link-active' :
                        globalActiveClass;
                    var exactActiveClassFallback = globalExactActiveClass == null ?
                        'router-link-exact-active' :
                        globalExactActiveClass;
                    var activeClass = this.activeClass == null ?
                        activeClassFallback :
                        this.activeClass;
                    var exactActiveClass = this.exactActiveClass == null ?
                        exactActiveClassFallback :
                        this.exactActiveClass;
                    var compareTarget = location.path ?
                        createRoute(null, location, null, router) :
                        route;

                    classes[exactActiveClass] = isSameRoute(current, compareTarget);
                    classes[activeClass] = this.exact ?
                        classes[exactActiveClass] :
                        isIncludedRoute(current, compareTarget);

                    var handler = function(e) {
                        if (guardEvent(e)) {
                            if (this$1.replace) {
                                router.replace(location);
                            } else {
                                router.push(location);
                            }
                        }
                    };

                    var on = { click: guardEvent };
                    if (Array.isArray(this.event)) {
                        this.event.forEach(function(e) { on[e] = handler; });
                    } else {
                        on[this.event] = handler;
                    }

                    var data = {
                        class: classes
                    };

                    if (this.tag === 'a') {
                        data.on = on;
                        data.attrs = { href: href };
                    } else {
                        // find the first <a> child and apply listener and href
                        var a = findAnchor(this.$slots.default);
                        if (a) {
                            // in case the <a> is a static node
                            a.isStatic = false;
                            var aData = a.data = extend({}, a.data);
                            aData.on = on;
                            var aAttrs = a.data.attrs = extend({}, a.data.attrs);
                            aAttrs.href = href;
                        } else {
                            // doesn't have <a> child, apply listener to self
                            data.on = on;
                        }
                    }

                    return h(this.tag, data, this.$slots.default)
                }
            }

            /**
             * 功能重定向判断
             * @param {event} e 
             */
            function guardEvent(e) {
                // 不重定向条件
                // don't redirect with control keys
                if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
                // don't redirect when preventDefault called
                if (e.defaultPrevented) { return }
                // don't redirect on right click
                if (e.button !== undefined && e.button !== 0) { return }
                // don't redirect if `target="_blank"`
                if (e.currentTarget && e.currentTarget.getAttribute) {
                    var target = e.currentTarget.getAttribute('target');
                    if (/\b_blank\b/i.test(target)) { return }
                }
                // this may be a Weex event which doesn't have this method
                if (e.preventDefault) {
                    e.preventDefault();
                }
                return true
            }

            function findAnchor(children) {
                if (children) {
                    var child;
                    for (var i = 0; i < children.length; i++) {
                        child = children[i];
                        if (child.tag === 'a') {
                            return child
                        }
                        if (child.children && (child = findAnchor(child.children))) {
                            return child
                        }
                    }
                }
            }

            // Vue
            var _Vue;

            // 将VueRouter注册到vue中
            function install(Vue) {
                // 必须先注册安装一个VueRouter,否则没有installed这个字段
                if (install.installed && _Vue === Vue) { return }
                install.installed = true;
                _Vue = Vue;

                var isDef = function(v) { return v !== undefined; };

                // 注册vue实例
                var registerInstance = function(vm, callVal) {
                    var i = vm.$options._parentVnode;
                    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
                        i(vm, callVal);
                    }
                };
                // 全局混入，注入之后创建的每一个vue实例都会有此属性
                Vue.mixin({
                    // this指vue实例,初始化Vue实例时，已经将router添加到Vue实例里边，与store，i18n，类似
                    beforeCreate: function beforeCreate() {
                        if (isDef(this.$options.router)) {
                            // 在创建实例之前将vue实例_routerRoot指向vue实例
                            this._routerRoot = this;
                            // vue实例_router指向vue实例的$options.router
                            this._router = this.$options.router;
                            // 初始化  init存在于VueRouter的原型链中
                            this._router.init(this);
                            Vue.util.defineReactive(this, '_route', this._router.history.current);
                        } else {
                            this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
                        }
                        // this === vue实例
                        registerInstance(this, this);
                    },
                    destroyed: function destroyed() {
                        registerInstance(this);
                    }
                });

                // Vue实例上原型链上定义$router属性
                Object.defineProperty(Vue.prototype, '$router', {
                    get: function get() { return this._routerRoot._router }
                });

                Object.defineProperty(Vue.prototype, '$route', {
                    get: function get() { return this._routerRoot._route }
                });
                Vue.component('RouterView', View);
                Vue.component('RouterLink', Link);


                /**
                 * 自定义选项将使用默认策略，即简单地覆盖已有值。
                 * 如果想让自定义选项以自定义逻辑合并，
                 * 可以向 Vue.config.optionMergeStrategies 添加一个函数：

                    Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
                        // 返回合并后的值
                    }
                 */
                var strats = Vue.config.optionMergeStrategies;
                // use the same hook merging strategy for route hooks
                // 定义组件内的导航钩子函数
                strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
            }

            /*  */

            // 判断是不是浏览器
            var inBrowser = typeof window !== 'undefined';

            /**
             * 功能：如果相对路径是根路径或者查询参数直接返回
             *      如果是a/c的形式
             *      如果append为false，则删除base路径的最后一个/后的东西
             * 
             * @param {*} relative 
             * @param {*} base 
             * @param {boolean} append  true: 将相对路径添加到根路径后  false: 则为新的路径 
             * 例如，我们从 /a 导航到一个相对路径 b，如果没有配置 append，则路径为 /b，
             * 如果配了，则为 /a/b
             * 
             * 返回值： /base路径/ + relative  ()
             */

            function resolvePath(
                relative,
                base,
                append
            ) {
                var firstChar = relative.charAt(0);
                // 路由的是根路径下的路径  /a
                if (firstChar === '/') {
                    return relative
                }

                // 带有查询参数的路径   base : /a  relative: ?a=0
                if (firstChar === '?' || firstChar === '#') {
                    return base + relative // /a?a=0
                }

                // 判断既不是根路径下路径，也不是查询参数 ddd
                var stack = base.split('/'); // /a/b/c    ["", "a", "b", "c"]

                // remove trailing segment if:
                // - not appending
                // - appending to trailing slash (last segment is empty)

                // append 为false, base路径结尾为/
                if (!append || !stack[stack.length - 1]) {
                    // 删除最后一项
                    stack.pop();
                }

                // resolve relative path  a/c/d => ["a", "c", "d"]
                var segments = relative.replace(/^\//, '').split('/');

                for (var i = 0; i < segments.length; i++) {
                    var segment = segments[i];
                    // 向上反一级，删除根路径堆栈中的最后一个
                    if (segment === '..') {
                        stack.pop();
                    } else if (segment !== '.') {
                        // 不是向上反一级，不是当前路径， 根路径堆栈中添加
                        stack.push(segment);
                    }
                }

                // ensure leading slash
                // 确保base是根路径，/a/b  分解下来是['', 'a', 'b']   a/b  分解下来是[ 'a', 'b']
                if (stack[0] !== '') {
                    // 向数组开头添加
                    stack.unshift('');
                }

                // 形成一个根路径下的地址
                return stack.join('/')
            }


            /**
             * 功能： 处理路径
             * @param {string} path 
             * 
             * 返回值：/task/create/#nfvi
             *  {
             *      path: /task/create/
             *      query: ''
             *      hash: nfvi
             * 
             *  }
             */
            // /task/create/#nfvi
            function parsePath(path) {
                var hash = '';
                var query = '';

                var hashIndex = path.indexOf('#');
                if (hashIndex >= 0) {
                    hash = path.slice(hashIndex);
                    path = path.slice(0, hashIndex);
                }

                var queryIndex = path.indexOf('?');
                if (queryIndex >= 0) {
                    query = path.slice(queryIndex + 1);
                    path = path.slice(0, queryIndex);
                }

                return {
                    path: path,
                    query: query,
                    hash: hash
                }
            }

            // 将//替换为/
            function cleanPath(path) {
                return path.replace(/\/\//g, '/')
            }

            // 判断是否为数组
            var isarray = Array.isArray || function(arr) {
                return Object.prototype.toString.call(arr) == '[object Array]';
            };

            /**
             * Expose `pathToRegexp`.
             */
            var pathToRegexp_1 = pathToRegexp;
            var parse_1 = parse;
            var compile_1 = compile;
            // 一个方法
            var tokensToFunction_1 = tokensToFunction;
            // 将tokens转换为正则的函数
            var tokensToRegExp_1 = tokensToRegExp;

            /**
             * The main path matching regexp utility.
             *
             * @type {RegExp}
             * 
             * 结果： '(\\.)|([\/.])?(?:(?:\:(\w+)(?:\(((?:\\.|[^\\()])+)\))?|\(((?:\\.|[^\\()])+)\))([+*?])?|(\*))'
             */
            var PATH_REGEXP = new RegExp([
                // Match escaped characters that would otherwise appear in future matches.
                // This allows the user to escape special characters that won't transform.
                '(\\\\.)',
                // Match Express-style parameters and un-named parameters with a prefix
                // and optional suffixes. Matches appear as:
                //
                // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
                // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
                // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
                '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
            ].join('|'), 'g');

            /**
             * Parse a string for the raw tokens.
             *
             * @param  {string}  str
             * @param  {Object=} options
             * @return {!Array}
             * 匹配到值是，匹配多个就有多个{}tookens  
             * 返回值：[]
             * 
             * [
             *  {
             * asterisk: true
                delimiter: "/"
                name: 0
                optional: false
                partial: false
                pattern: ".*"
                prefix: ""
                repeat: false
             * }
             * ]
             * 
             * 没有匹配到就是['path']
             */
            function parse(str, options) {
                var tokens = [];
                var key = 0;
                var index = 0;
                var path = '';
                var defaultDelimiter = options && options.delimiter || '/';
                var res;

                // exec 检索字符串中指定的值。返回找到的值，并确定其位置。正则表达式有几个，就有多少个匹配到的值
                // res = ["/*", undefined, "/", undefined, undefined, undefined, undefined, "*", index: 0, input: "/*", groups: undefined]
                while ((res = PATH_REGEXP.exec(str)) != null) {
                    var m = res[0]; // 与正则表达式匹配的文本
                    var escaped = res[1]; // 与正则第一个表达式匹配的值
                    var offset = res.index; // 第几位匹配到
                    // str "/*"
                    path += str.slice(index, offset);
                    index = offset + m.length;

                    // Ignore already escaped sequences.
                    if (escaped) {
                        path += escaped[1];
                        continue
                    }

                    var next = str[index]; // /
                    var prefix = res[2]; // 7
                    var name = res[3]; // 
                    var capture = res[4];
                    var group = res[5];
                    var modifier = res[6];
                    var asterisk = res[7];

                    // Push the current path onto the tokens.
                    if (path) {
                        tokens.push(path); // [./.56]
                        path = '';
                    }

                    var partial = prefix != null && next != null && next !== prefix; // true
                    var repeat = modifier === '+' || modifier === '*'; // false
                    var optional = modifier === '?' || modifier === '*'; // false
                    var delimiter = res[2] || defaultDelimiter; // 7
                    var pattern = capture || group; // undefinend

                    tokens.push({
                        name: name || key++,
                        prefix: prefix || '',
                        delimiter: delimiter,
                        optional: optional,
                        repeat: repeat,
                        partial: partial,
                        asterisk: !!asterisk,
                        pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?') // [^7]+?
                    });
                }

                // Match any characters still remaining.
                if (index < str.length) {
                    path += str.substr(index);
                }

                // If the path exists, push it onto the end.
                if (path) {
                    tokens.push(path);
                }

                return tokens
            }

            /**
             * Compile a string to a template function for the path.
             *
             * @param  {string}             str
             * @param  {Object=}            options
             * @return {!function(Object=, Object=)}
             * 返回值： path = ''
             *  
             */
            function compile(str, options) {
                // parse返回一个tookens数组
                /**
                 * parse处理  如果tooken的值是字符串 ： path = '' + token
                 * 如果是{}  segment经过编码
                 * 如果{}.name是array，符合条件则没有segment，{}.name不是array有segment
                 * path = path + token.prefix + segment
                 * 
                 */
                return tokensToFunction(parse(str, options))
            }

            /**
             * Prettier encoding of URI path segments.
             *
             * @param  {string}
             * @return {string}
             */
            function encodeURIComponentPretty(str) {
                return encodeURI(str).replace(/[\/?#]/g, function(c) {
                    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
                })
            }

            /**
             * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
             *
             * @param  {string}
             * @return {string}
             */
            function encodeAsterisk(str) {
                return encodeURI(str).replace(/[?#]/g, function(c) {
                    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
                })
            }

            /**
             * Expose a method for transforming tokens into the path function.
             * 
             * 参数： path经过parse处理生成的tookens
             * 返回值函数：（obj, opts）
             *  函数返回值
             *    如果tooken的值是字符串 ： path = '' + token
             *    如果是{}  segment经过编码
             *    如果{}.name是array，符合条件则没有segment，{}.name不是array有segment
             *    path = path + token.prefix + segment
             */
            function tokensToFunction(tokens) {
                // Compile all the tokens into regexps.
                var matches = new Array(tokens.length);

                // Compile all the patterns before compilation.
                for (var i = 0; i < tokens.length; i++) {
                    if (typeof tokens[i] === 'object') {
                        matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$'); // (:'.')
                    }
                }

                return function(obj, opts) {
                    var path = '';
                    var data = obj || {};
                    var options = opts || {};
                    // 将字符串作为 URI 组件进行编码
                    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

                    for (var i = 0; i < tokens.length; i++) {
                        var token = tokens[i];

                        if (typeof token === 'string') {
                            path += token;

                            continue
                        }

                        var value = data[token.name];
                        var segment;

                        if (value == null) {
                            if (token.optional) {
                                // Prepend partial segment prefixes.
                                if (token.partial) {
                                    path += token.prefix;
                                }

                                continue
                            } else {
                                throw new TypeError('Expected "' + token.name + '" to be defined')
                            }
                        }

                        if (isarray(value)) {
                            if (!token.repeat) {
                                throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
                            }

                            if (value.length === 0) {
                                if (token.optional) {
                                    continue
                                } else {
                                    throw new TypeError('Expected "' + token.name + '" to not be empty')
                                }
                            }

                            for (var j = 0; j < value.length; j++) {
                                segment = encode(value[j]);

                                if (!matches[i].test(segment)) {
                                    throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
                                }

                                path += (j === 0 ? token.prefix : token.delimiter) + segment;
                            }

                            continue
                        }

                        segment = token.asterisk ? encodeAsterisk(value) : encode(value);

                        if (!matches[i].test(segment)) {
                            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
                        }

                        path += token.prefix + segment;
                    }

                    return path
                }
            }

            /**
             * Escape a regular expression string.
             *
             * @param  {string} str
             * @return {string}
             */
            function escapeString(str) {
                return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
            }

            /**
             * Escape the capturing group by escaping special characters and meaning.
             *
             * @param  {string} group
             * @return {string}
             */
            function escapeGroup(group) {
                return group.replace(/([=!:$\/()])/g, '\\$1')
            }

            /**
             * Attach the keys as a property of the regexp.
             *
             * 将数组keys添加到正则的keys属性中
             * @param  {RegExp} re
             * @param  {Array}   keys
             * @return {RegExp}
             * 
             */
            function attachKeys(re, keys) {
                re.keys = keys;
                return re
            }

            /**
             * Get the flags for a regexp from the options.
             *
             * @param  {Object} options
             * @return {string}
             */
            function flags(options) {
                return options.sensitive ? '' : 'i'
            }

            /**
             * Pull out path from a regexp.
             *
             * @param  {RegExp} path
             * @param  {Array}  keys
             * @return {RegExp}
             * 返回值：正则中的keys属性是key的值，
             */
            function regexpToRegexp(path, keys) {
                // Use a negative lookahead to match only capturing groups.
                // path.source返回正则表达式的文本
                // match() 方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。返回的是指定的值
                // (?!pattern)：负向预查，在任何不匹配 pattern 的字符串开始处匹配查找字符串。
                // 这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。
                // 例如'Windows (?!95|98|NT|2000)' 能匹配 "Windows 3.1" 中的 "Windows"，
                // 但不能匹配 "Windows 2000" 中的 "Windows"。
                // 预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，
                // 而不是从包含预查的字符之后开始
                var groups = path.source.match(/\((?!\?)/g); // 可以匹配(fdsfsd) 但不能匹配(?fs)

                if (groups) {
                    for (var i = 0; i < groups.length; i++) {
                        keys.push({
                            name: i,
                            prefix: null,
                            delimiter: null,
                            optional: false,
                            repeat: false,
                            partial: false,
                            asterisk: false,
                            pattern: null
                        });
                    }
                }

                // path匹配到正则后最后一个数据是一个json
                return attachKeys(path, keys)
            }

            /**
             * Transform an array into a regexp.
             *
             * @param  {Array}  path
             * @param  {Array}   keys
             * @param  {Object} options
             * @return {RegExp}
             */
            function arrayToRegexp(path, keys, options) {
                var parts = [];

                for (var i = 0; i < path.length; i++) {
                    // 将path转换成正则后获取正则的文本添加到parts中
                    parts.push(pathToRegexp(path[i], keys, options).source);
                }

                var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

                return attachKeys(regexp, keys)
            }

            /**
             * Create a path regexp from string input.
             *
             * @param  {string}  path
             * @param  {Array}  keys
             * @param  {Object} options
             * @return {!RegExp}
             */
            function stringToRegexp(path, keys, options) {
                return tokensToRegExp(parse(path, options), keys, options)
            }

            /**
             * Expose a function for taking tokens and returning a RegExp.
             *
             * @param  {!Array}          tokens
             * @param  {(Array|Object)=} keys
             * @param  {Object=}         options
             * @return {!RegExp}
             */
            function tokensToRegExp(tokens, keys, options) {
                if (!isarray(keys)) {
                    options = /** @type {!Object} */ (keys || options);
                    keys = [];
                }

                options = options || {};

                var strict = options.strict;
                var end = options.end !== false;
                var route = '';

                // Iterate over the tokens and create our regexp string.
                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];

                    if (typeof token === 'string') {
                        route += escapeString(token);
                    } else {
                        var prefix = escapeString(token.prefix);
                        var capture = '(?:' + token.pattern + ')';

                        keys.push(token);

                        if (token.repeat) {
                            capture += '(?:' + prefix + capture + ')*';
                        }

                        if (token.optional) {
                            if (!token.partial) {
                                capture = '(?:' + prefix + '(' + capture + '))?';
                            } else {
                                capture = prefix + '(' + capture + ')?';
                            }
                        } else {
                            capture = prefix + '(' + capture + ')';
                        }

                        route += capture;
                    }
                }

                var delimiter = escapeString(options.delimiter || '/');
                var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

                // In non-strict mode we allow a slash at the end of match. If the path to
                // match already ends with a slash, we remove it for consistency. The slash
                // is valid at the end of a path match, not in the middle. This is important
                // in non-ending mode, where "/test/" shouldn't match "/test//route".
                if (!strict) {
                    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
                }

                if (end) {
                    route += '$';
                } else {
                    // In non-ending mode, we need the capturing groups to match as much as
                    // possible by using a positive lookahead to the end or next path segment.
                    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
                }

                return attachKeys(new RegExp('^' + route, flags(options)), keys)
            }

            /**
             * Normalize the given path string, returning a regular expression.
             *
             * An empty array can be passed in for the keys, which will hold the
             * placeholder key descriptions. For example, using `/user/:id`, `keys` will
             * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
             *
             * @param  {(string|RegExp|Array)} path
             * @param  {(Array|Object)=}       keys
             * @param  {Object=}               options
             * @return {!RegExp}
             */
            function pathToRegexp(path, keys, options) {
                if (!isarray(keys)) {
                    options = /** @type {!Object} */ (keys || options);
                    keys = [];
                }

                options = options || {};

                // path是一个正则， keys数组
                if (path instanceof RegExp) {
                    // 返回值：正则中的keys属性值是keys的值，
                    return regexpToRegexp(path, (keys))
                }

                // path是一个数组，keys数组
                if (isarray(path)) {
                    // 返回值：正则中的keys属性是path数组（path数组的正则的keys属性值是keys的值）
                    return arrayToRegexp((path), (keys), options)
                }

                // path不是一个数组正则(string)，keys数组， 返回值是正则中的keys属性是 path转换成tokens的值
                return stringToRegexp((path), (keys), options)
            }
            pathToRegexp_1.parse = parse_1;
            pathToRegexp_1.compile = compile_1;
            pathToRegexp_1.tokensToFunction = tokensToFunction_1;
            pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

            /*  */

            // $flow-disable-line
            var regexpCompileCache = Object.create(null);

            function fillParams(
                path,
                params,
                routeMsg
            ) {
                params = params || {};
                try {
                    var filler =
                        regexpCompileCache[path] ||
                        (regexpCompileCache[path] = pathToRegexp_1.compile(path)); // 重新编辑正则

                    // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
                    if (params.pathMatch) { params[0] = params.pathMatch; }
                    return filler(params, { pretty: true })
                } catch (e) {
                    {
                        warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
                    }
                    return ''
                } finally {
                    // delete the 0 if it was added
                    delete params[0];
                }
            }

            /**
             * 
             * @param {[]} routes  初始化时向router实例中传递的数组
             * @param {*} oldPathList 
             * @param {*} oldPathMap 
             * @param {*} oldNameMap 
             * 
             * 返回值：
             * {
             *  nameMap: {}  以路由名字(routers[i].name )为键的map，值包含了路径,组件，路由名称等
             *  pathList： [] 所有路径(routes[i].path)的集合
             *  pathMap: {} 以路由路径(routes[i].path)为键的map，值包含了路径,组件，路由名称等
             * }
             */

            function createRouteMap(
                routes,
                oldPathList,
                oldPathMap,
                oldNameMap
            ) {
                // the path list is used to control path matching priority
                var pathList = oldPathList || [];
                // $flow-disable-line
                var pathMap = oldPathMap || Object.create(null);
                // $flow-disable-line
                var nameMap = oldNameMap || Object.create(null);

                routes.forEach(function(route) {
                    addRouteRecord(pathList, pathMap, nameMap, route);
                });

                // ensure wildcard routes are always at the end
                for (var i = 0, l = pathList.length; i < l; i++) {
                    if (pathList[i] === '*') {
                        pathList.push(pathList.splice(i, 1)[0]);
                        l--;
                        i--;
                    }
                }
                return {
                    pathList: pathList,
                    pathMap: pathMap,
                    nameMap: nameMap
                }
            }

            /**
             * 
             * 功能： 直接向参数pathList,pathMap,nameMap,中添加需要的值
                pathList[]中push每一个route.path
                pathMap{} 键值是route.path 值：record中的值，如果有子路由则再次调用该方法
                nameMap{} 键是route.name: 值：record中的值，如果有子路由则再次调用该方法
             * @param {array} pathList 
             * @param {object} pathMap 
             * @param object nameMap 
             * @param object route 
             * @param object parent 
             * @param {*} matchAs 
             * 
             * 返回值无，直接修改参数的
             * 
             */
            function addRouteRecord(
                pathList,
                pathMap,
                nameMap,
                route,
                parent,
                matchAs
            ) {
                var path = route.path;
                var name = route.name; {
                    assert(path != null, "\"path\" is required in a route configuration.");
                    assert(
                        typeof route.component !== 'string',
                        "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
                        "string id. Use an actual component instead."
                    );
                }

                var pathToRegexpOptions = route.pathToRegexpOptions || {};
                var normalizedPath = normalizePath(
                    path,
                    parent,
                    pathToRegexpOptions.strict
                );
                if (typeof route.caseSensitive === 'boolean') {
                    pathToRegexpOptions.sensitive = route.caseSensitive;
                }

                var record = {
                    path: normalizedPath,
                    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
                    components: route.components || { default: route.component },
                    instances: {},
                    name: name,
                    parent: parent,
                    matchAs: matchAs,
                    redirect: route.redirect,
                    beforeEnter: route.beforeEnter,
                    meta: route.meta || {},
                    props: route.props == null ? {} : route.components ?
                        route.props : { default: route.props }
                };

                // 是否有子路由
                if (route.children) {
                    // Warn if route is named, does not redirect and has a default child route.
                    // If users navigate to this route by name, the default child will
                    // not be rendered (GH Issue #629)
                    {
                        if (route.name && !route.redirect && route.children.some(function(child) { return /^\/?$/.test(child.path); })) {
                            warn(
                                false,
                                "Named Route '" + (route.name) + "' has a default child route. " +
                                "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
                                "the default child route will not be rendered. Remove the name from " +
                                "this route and use the name of the default child route for named " +
                                "links instead."
                            );
                        }
                    }

                    route.children.forEach(function(child) {
                        var childMatchAs = matchAs ?
                            cleanPath((matchAs + "/" + (child.path))) :
                            undefined;
                        addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
                    });
                }
                if (route.alias !== undefined) {
                    var aliases = Array.isArray(route.alias) ?
                        route.alias : [route.alias];

                    aliases.forEach(function(alias) {
                        var aliasRoute = {
                            path: alias,
                            children: route.children
                        };
                        addRouteRecord(
                            pathList,
                            pathMap,
                            nameMap,
                            aliasRoute,
                            parent,
                            record.path || '/' // matchAs
                        );
                    });
                }

                if (!pathMap[record.path]) {
                    pathList.push(record.path);
                    pathMap[record.path] = record;
                }

                if (name) {
                    if (!nameMap[name]) {
                        nameMap[name] = record;
                    } else if ("development" !== 'production' && !matchAs) {
                        warn(
                            false,
                            "Duplicate named routes definition: " +
                            "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
                        );
                    }
                }
            }

            /**
             * 
             * @param {string} path 
             * @param {*} pathToRegexpOptions 
             */
            function compileRouteRegex(path, pathToRegexpOptions) {
                // 将路径转换为一个路径的正则
                var regex = pathToRegexp_1(path, [], pathToRegexpOptions); {
                    var keys = Object.create(null);
                    regex.keys.forEach(function(key) {
                        warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
                        keys[key.name] = true;
                    });
                }
                return regex
            }

            // 返回一个规范化的路径，由父路径与自己路径拼接而成
            function normalizePath(path, parent, strict) {
                if (!strict) { path = path.replace(/\/$/, ''); } // 非严格模式下将/$替换为空
                if (path[0] === '/') { return path } // 根路径下路径，直接返回
                if (parent == null) { return path } // 没有父路径，直接返回
                return cleanPath(((parent.path) + "/" + path)) // 对现有路径与父路径进行拼接
            }

            /**
             * 返回一个location
             * 第一种形式
             * {
             *      _normalized: true, // 判断是不是经过处理过的路径
                    path: path, // 一个路径，包含基路径
                    query: query, // 所携带的查询参数
                    hash: hash // hash
             * }
             第二种形式
             {
                 *  _normalized： true,
                 * name: name
                 *  params: params,
                 * path: path
                 * }
             * @param {*} raw 
             * @param {*} current 
             * @param {*} append 
             * @param {*} router 
             */

            function normalizeLocation(
                raw,
                current,
                append,
                router
            ) {
                var next = typeof raw === 'string' ? { path: raw } : raw;
                // named target
                if (next._normalized) {
                    return next
                } else if (next.name) {
                    return extend({}, raw)
                }

                // relative params
                /**
                 * row: {
                 *  path: 'fs',
                 *  params: 'fs'
                 * }
                 * 
                 * 返回{
                 *  _normalized： true,
                 * name: name
                 *  params: params,
                 * path: path
                 * }
                 */
                if (!next.path && next.params && current) {
                    next = extend({}, next);
                    next._normalized = true;
                    var params = extend(extend({}, current.params), next.params);
                    if (current.name) {
                        next.name = current.name;
                        next.params = params;
                    } else if (current.matched.length) {
                        var rawPath = current.matched[current.matched.length - 1].path;
                        next.path = fillParams(rawPath, params, ("path " + (current.path)));
                    } else {
                        warn(false, "relative params navigation requires a current route.");
                    }
                    return next
                }

                var parsedPath = parsePath(next.path || '');
                var basePath = (current && current.path) || '/';
                var path = parsedPath.path ?
                    resolvePath(parsedPath.path, basePath, append || next.append) :
                    basePath;

                var query = resolveQuery(
                    parsedPath.query,
                    next.query,
                    router && router.options.parseQuery
                );

                var hash = next.hash || parsedPath.hash;
                if (hash && hash.charAt(0) !== '#') {
                    hash = "#" + hash;
                }

                return {
                    _normalized: true,
                    path: path,
                    query: query,
                    hash: hash
                }
            }




            /**
             * 
             * @param {array} routes 
             * @param {VueRouter实例} router 
             */
            function createMatcher(
                routes,
                router
            ) {
                // {nameMap: {}, pathList： [], pathMap: {}}
                var ref = createRouteMap(routes);
                var pathList = ref.pathList;
                var pathMap = ref.pathMap;
                var nameMap = ref.nameMap;

                function addRoutes(routes) {
                    createRouteMap(routes, pathList, pathMap, nameMap);
                }

                // 根据routes创建相匹配的route
                function match(
                    raw,
                    currentRoute,
                    redirectedFrom
                ) {
                    var location = normalizeLocation(raw, currentRoute, false, router);
                    var name = location.name;

                    if (name) {
                        var record = nameMap[name]; {
                            warn(record, ("Route with name '" + name + "' does not exist"));
                        }
                        if (!record) { return _createRoute(null, location) }
                        var paramNames = record.regex.keys
                            .filter(function(key) { return !key.optional; })
                            .map(function(key) { return key.name; });

                        if (typeof location.params !== 'object') {
                            location.params = {};
                        }

                        if (currentRoute && typeof currentRoute.params === 'object') {
                            for (var key in currentRoute.params) {
                                if (!(key in location.params) && paramNames.indexOf(key) > -1) {
                                    location.params[key] = currentRoute.params[key];
                                }
                            }
                        }

                        if (record) {
                            location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
                            // record中包括route.name, 路径的正则，params，hash，components等
                            return _createRoute(record, location, redirectedFrom)
                        }
                    } else if (location.path) {
                        location.params = {};
                        for (var i = 0; i < pathList.length; i++) {
                            var path = pathList[i];
                            var record$1 = pathMap[path];
                            if (matchRoute(record$1.regex, location.path, location.params)) {
                                return _createRoute(record$1, location, redirectedFrom)
                            }
                        }
                    }
                    // no match
                    return _createRoute(null, location)
                }

                // 创建一个重定向的路由
                function redirect(
                    record,
                    location
                ) {
                    var originalRedirect = record.redirect;
                    var redirect = typeof originalRedirect === 'function' ?
                        originalRedirect(createRoute(record, location, null, router)) :
                        originalRedirect;

                    if (typeof redirect === 'string') {
                        redirect = { path: redirect };
                    }

                    if (!redirect || typeof redirect !== 'object') {
                        {
                            warn(
                                false, ("invalid redirect option: " + (JSON.stringify(redirect)))
                            );
                        }
                        return _createRoute(null, location)
                    }

                    var re = redirect;
                    var name = re.name;
                    var path = re.path;
                    var query = location.query;
                    var hash = location.hash;
                    var params = location.params;
                    query = re.hasOwnProperty('query') ? re.query : query;
                    hash = re.hasOwnProperty('hash') ? re.hash : hash;
                    params = re.hasOwnProperty('params') ? re.params : params;

                    if (name) {
                        // resolved named direct
                        var targetRecord = nameMap[name]; {
                            assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
                        }
                        return match({
                            _normalized: true,
                            name: name,
                            query: query,
                            hash: hash,
                            params: params
                        }, undefined, location)
                    } else if (path) {
                        // 1. resolve relative redirect
                        var rawPath = resolveRecordPath(path, record);
                        // 2. resolve params
                        var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
                        // 3. rematch with existing query and hash
                        return match({
                            _normalized: true,
                            path: resolvedPath,
                            query: query,
                            hash: hash
                        }, undefined, location)
                    } else {
                        {
                            warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
                        }
                        return _createRoute(null, location)
                    }
                }

                // 别名，路由创建时routers传进的参数  routes: [ { path: '/a', component: A, alias: '/b' } ]
                // 当有alias这个属性时，/a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样
                function alias(
                    record,
                    location,
                    matchAs
                ) {
                    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
                    var aliasedMatch = match({
                        _normalized: true,
                        path: aliasedPath
                    });
                    if (aliasedMatch) {
                        var matched = aliasedMatch.matched;
                        var aliasedRecord = matched[matched.length - 1];
                        location.params = aliasedMatch.params;
                        return _createRoute(aliasedRecord, location)
                    }
                    return _createRoute(null, location)
                }

                // 创建route时判断是不是重定向，或者有别名
                function _createRoute(
                    record,
                    location,
                    redirectedFrom
                ) {
                    if (record && record.redirect) {
                        return redirect(record, redirectedFrom || location)
                    }
                    if (record && record.matchAs) {
                        return alias(record, location, record.matchAs)
                    }
                    return createRoute(record, location, redirectedFrom, router)
                }

                return {
                    match: match, // 重建一个与routes相匹配的route
                    addRoutes: addRoutes // {pathList: [], nameMap: {}, pathMap: {}
                }
            }



            function matchRoute(
                regex,
                path,
                params
            ) {
                // 返回满足正则的结果的数组
                var m = path.match(regex);

                if (!m) {
                    return false
                } else if (!params) {
                    return true
                }

                // 如果有params
                for (var i = 1, len = m.length; i < len; ++i) {
                    // path经过处理后会成为一个正则，其中正则有key属性
                    var key = regex.keys[i - 1];
                    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
                    // 经过处理的path
                    if (key) {
                        // Fix #1994: using * with props: true generates a param named 0
                        // 改变传进来的params的值
                        params[key.name || 'pathMatch'] = val;
                    }
                }

                return true
            }

            // 返回值： /base路径/ + relative  ()
            function resolveRecordPath(path, record) {
                return resolvePath(path, record.parent ? record.parent.path : '/', true)
            }

            /*  */

            var positionStore = Object.create(null);

            /**
             * 使用前端路由，当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，
             * 就像重新加载页面那样。 vue-router 能做到，而且更好，它让你可以自定义路由切换时页面如何滚动。
             */
            function setupScroll() {
                // Fix for #1585 for Firefox
                // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
                /**
                 * window.history: 是用来保存用户在一个会话期间的网站访问记录。
                 * 方法有：
                 * back()：回退到上一级 window.history.back()
                 * forward(): 前进到下一个访问记录
                 * go(num)：跳转到响应的访问记录，num 大于0 前进，小于0后退
                 * length: 查看记录栈中的记录
                 * pushState(stateData, title, url): 在history中创建一个新的访问记录，不能跨域也不能刷新页面
                 * replaceState(stateData, title, url): 修改当前的访问记录，不能跨域也不能刷新页面。
                 * 另，HTML5新增了可以监听history和hash访问变化的全局方法：

                    window.onpopstate：当调用history.go()、history.back()、history.forward()时触发;pushState()\replaceState()方法不触发。

                    window.onhashchange：当前 URL 的锚部分(以 '#' 号为开始) 发生改变时触发。触发的情况如下：

                    a、通过设置Location 对象 的 location.hash 或 location.href 属性修改锚部分;

                    b、使用不同history操作方法到带hash的页面;

                    c、点击链接跳转到锚点。
                 * 
                 * 
                 * 
                 * key: 一个时间值
                 * 
                 * 
                 *  window.location.href.replace()替换当前的路径，当前路径不会再路径栈中保存
                 * 
                 * window.location.origin：'?'前边的URL
                 * 
                 */

                window.history.replaceState({ key: getStateKey() }, '', window.location.href.replace(window.location.origin, ''));
                //  添加事件（历史记录条目发生变化）  history.go()、history.back()、history.forward()时触发
                window.addEventListener('popstate', function(e) {
                    saveScrollPosition();
                    if (e.state && e.state.key) {
                        setStateKey(e.state.key);
                    }
                });
            }

            /**
             * 将页面滚动到记录的位置
             * @param {*} router Route的实例，项目中创建好的
             * @param {*} to 
             * @param {*} from 
             * @param {*} isPop 
             */
            function handleScroll(
                router,
                to,
                from,
                isPop
            ) {
                if (!router.app) {
                    return
                }
                // scrollBehavior 为一个方法，配置路由时传递
                var behavior = router.options.scrollBehavior;
                if (!behavior) {
                    return
                }

                {
                    assert(typeof behavior === 'function', "scrollBehavior must be a function");
                }

                // wait until re-render finishes before scrolling
                // router.app === Vue实例
                router.app.$nextTick(function() {
                    var position = getScrollPosition();
                    // 传递进来的scrollBehavior方法执行后返回一个队象，包含需要滚动到的位置 { x: 0, y: 0 }， 
                    var shouldScroll = behavior.call(router, to, from, isPop ? position : null);

                    if (!shouldScroll) {
                        return
                    }

                    // 异步滚动，https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E5%BC%82%E6%AD%A5%E6%BB%9A%E5%8A%A8
                    if (typeof shouldScroll.then === 'function') {
                        shouldScroll.then(function(shouldScroll) {
                            scrollToPosition((shouldScroll), position);
                        }).catch(function(err) {
                            {
                                assert(false, err.toString());
                            }
                        });
                    } else {
                        scrollToPosition(shouldScroll, position);
                    }
                });
            }

            // 路由设置了滚动，记录当前页面的滚动位置，当回到记录的路由时，页面滚动到记录的位置 
            // positionStore将记录所有的浏览记录， 如果有相同的key就重置
            function saveScrollPosition() {
                var key = getStateKey();
                if (key) {
                    positionStore[key] = {
                        x: window.pageXOffset,
                        y: window.pageYOffset
                    };
                }
            }

            // 获取positionStore[key]
            function getScrollPosition() {
                var key = getStateKey();
                if (key) {
                    return positionStore[key]
                }
            }

            function getElementPosition(el, offset) {
                var docEl = document.documentElement;
                // 返回元素的位置，长宽高
                // { bottom: 39 
                // height: 39 元素高
                // left: 0 左边位置
                // right: 1366 右边为止
                // top: 0 距离顶部的位置
                // width: 1366
                // x: 0
                // y: 0
                // }
                var docRect = docEl.getBoundingClientRect();
                var elRect = el.getBoundingClientRect();
                return {
                    x: elRect.left - docRect.left - offset.x,
                    y: elRect.top - docRect.top - offset.y
                }
            }

            // 判断是不是数字类型的位置
            function isValidPosition(obj) {
                return isNumber(obj.x) || isNumber(obj.y)
            }

            // 将保存的scrollPostitionState转换成{x: 123, y: 13}
            function normalizePosition(obj) {
                return {
                    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
                    y: isNumber(obj.y) ? obj.y : window.pageYOffset
                }
            }

            // 返回一个可用的位置
            function normalizeOffset(obj) {
                return {
                    x: isNumber(obj.x) ? obj.x : 0,
                    y: isNumber(obj.y) ? obj.y : 0
                }
            }

            function isNumber(v) {
                return typeof v === 'number'
            }

            // 滚动到指定的位置
            function scrollToPosition(shouldScroll, position) {
                var isObject = typeof shouldScroll === 'object';
                // 滚动到锚点的行为 https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E5%BC%82%E6%AD%A5%E6%BB%9A%E5%8A%A8
                if (isObject && typeof shouldScroll.selector === 'string') {
                    var el = document.querySelector(shouldScroll.selector);
                    if (el) {
                        var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
                        offset = normalizeOffset(offset);
                        position = getElementPosition(el, offset);
                    } else if (isValidPosition(shouldScroll)) {
                        position = normalizePosition(shouldScroll);
                    }
                } else if (isObject && isValidPosition(shouldScroll)) {
                    position = normalizePosition(shouldScroll);
                }

                if (position) {
                    // 页面滚动到指定位置
                    window.scrollTo(position.x, position.y);
                }
            }

            /* 
                自运行函数，判断是不是支持保存浏览器浏览的位置
            */

            var supportsPushState = inBrowser && (function() {
                // userAgent 属性是一个只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值
                // Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
                var ua = window.navigator.userAgent;

                if (
                    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
                    ua.indexOf('Mobile Safari') !== -1 &&
                    ua.indexOf('Chrome') === -1 &&
                    ua.indexOf('Windows Phone') === -1
                ) {
                    // 不支持
                    return false
                }

                return window.history && 'pushState' in window.history
            })();

            // use User Timing api (if present) for more accurate key precision
            // window.performance 用来分析当前页面中与性能相关的信息
            // window.performance.now() 返回值为从时间原点，他被人为是从当前文档生命周期的开始。
            var Time = inBrowser && window.performance && window.performance.now ?
                window.performance :
                Date;

            var _key = genKey();

            function genKey() {
                // 获取时间
                /**
                 * Date.now()   方法返回自1970年1月1日 00:00:00 UTC到当前时间的毫秒数。
                 * window.performance 用来分析当前页面中与性能相关的信息
                 * window.performance.now() 返回值为从时间原点，他被人为是从当前文档生命周期的开始。
                 */
                return Time.now().toFixed(3)
            }

            function getStateKey() {
                return _key
            }

            function setStateKey(key) {
                _key = key;
            }

            // window.history.pushState中添加   保存pushState
            function pushState(url, replace) {
                saveScrollPosition();
                // try...catch the pushState call to get around Safari
                // DOM Exception 18 where it limits to 100 pushState calls
                var history = window.history;
                try {
                    if (replace) {
                        // replaceState(stateData, title, url): 修改当前的访问记录，不能跨域也不能刷新页面
                        history.replaceState({ key: _key }, '', url);
                    } else {
                        _key = genKey();
                        history.pushState({ key: _key }, '', url);
                    }
                } catch (e) {
                    window.location[replace ? 'replace' : 'assign'](url);
                }
            }

            // 修改当前的访问记录，不能跨域也不能刷新页面
            function replaceState(url) {
                pushState(url, true);
            }

            /**
             * 从队列的第一位一直运行到最后
             * @param {array} queue 队列数组
             * @param {*} fn  处理队列的函数
             * @param {*} cb  想要执行的位置大于队列的个数，所执行的回调函数
             */
            function runQueue(queue, fn, cb) {
                var step = function(index) {
                    if (index >= queue.length) {
                        cb();
                    } else {
                        // 队列值不为空
                        if (queue[index]) {
                            // fn第一个参数是队列的值（钩子函数），第二个参数是一个回调函数，函数值里边是从当前队列
                            // 一直执行队列后的队列，最后执行cb(),通知调用者队列已经执行完毕
                            // 只有执行fn第二个参数，才会让队列一直执行
                            fn(queue[index], function() {
                                step(index + 1); // 相当于next(), 继续往下执行
                            });
                        } else {
                            step(index + 1);
                        }
                    }
                };
                step(0);
            }

            /**
             * 处理异步组件函数
             * @param {array*} matched 
             * 返回一个函数，执行之后，会执行flatMapComponents方法，返回值是一个数组
             */

            function resolveAsyncComponents(matched) {
                return function(to, from, next) {
                    var hasAsync = false;
                    var pending = 0;
                    var error = null;

                    /**
                     * 参数一个匹配到的路由，包括组件等，
                     * 参数二： 回调函数   def: components, _ 实例， match: 匹配到的路由， key: 匹配到的路由的所有键值
                     */
                    flatMapComponents(matched, function(def, _, match, key) {
                        // if it's a function and doesn't have cid attached,
                        // assume it's an async component resolve function.
                        // we are not using Vue's default async resolving mechanism because
                        // we want to halt the navigation until the incoming component has been
                        // resolved.
                        if (typeof def === 'function' && def.cid === undefined) {
                            hasAsync = true;
                            pending++;

                            var resolve = once(function(resolvedDef) {
                                if (isESModule(resolvedDef)) {
                                    resolvedDef = resolvedDef.default;
                                }
                                // save resolved on async factory in case it's used elsewhere
                                def.resolved = typeof resolvedDef === 'function' ?
                                    resolvedDef :
                                    _Vue.extend(resolvedDef);
                                match.components[key] = resolvedDef;
                                pending--;
                                if (pending <= 0) {
                                    next();
                                }
                            });

                            var reject = once(function(reason) {
                                var msg = "Failed to resolve async component " + key + ": " + reason;
                                "development" !== 'production' && warn(false, msg);
                                if (!error) {
                                    error = isError(reason) ?
                                        reason :
                                        new Error(msg);
                                    next(error);
                                }
                            });

                            var res;
                            try {
                                res = def(resolve, reject);
                            } catch (e) {
                                reject(e);
                            }
                            if (res) {
                                if (typeof res.then === 'function') {
                                    res.then(resolve, reject);
                                } else {
                                    // new syntax in Vue 2.3
                                    var comp = res.component;
                                    if (comp && typeof comp.then === 'function') {
                                        comp.then(resolve, reject);
                                    }
                                }
                            }
                        }
                    });

                    if (!hasAsync) { next(); }
                }
            }

            // 将fn的执行返回的数组与[]进行拼接
            function flatMapComponents(
                matched,
                fn
            ) {
                // 循环mactch
                return flatten(matched.map(function(m) {
                    // 循环m.components, 并执行fn()
                    return Object.keys(m.components).map(function(key) {
                        return fn(
                            m.components[key],
                            m.instances[key],
                            m, key // beforeRouterEnter 等
                        );
                    })
                }))
            }

            // 数组拼接
            function flatten(arr) {
                return Array.prototype.concat.apply([], arr)
            }

            var hasSymbol =
                typeof Symbol === 'function' &&
                typeof Symbol.toStringTag === 'symbol';

            function isESModule(obj) {
                return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
            }

            // in Webpack 2, require.ensure now also returns a Promise
            // so the resolve/reject functions may get called an extra time
            // if the user uses an arrow function shorthand that happens to
            // return that Promise.
            function once(fn) {
                var called = false;
                return function() {
                    var args = [],
                        len = arguments.length;
                    while (len--) args[len] = arguments[len];

                    if (called) { return }
                    called = true;
                    return fn.apply(this, args)
                }
            }

            /*  */

            var History = function History(router, base) {
                this.router = router;
                this.base = normalizeBase(base);
                // start with a route object that stands for "nowhere"
                this.current = START;
                this.pending = null;
                this.ready = false;
                this.readyCbs = [];
                this.readyErrorCbs = [];
                this.errorCbs = [];
            };

            // 路由监听
            History.prototype.listen = function listen(cb) {
                this.cb = cb;
            };

            History.prototype.onReady = function onReady(cb, errorCb) {
                if (this.ready) {
                    cb();
                } else {
                    this.readyCbs.push(cb);
                    if (errorCb) {
                        this.readyErrorCbs.push(errorCb);
                    }
                }
            };

            History.prototype.onError = function onError(errorCb) {
                this.errorCbs.push(errorCb);
            };

            /**
             * 路由过渡   
             */
            History.prototype.transitionTo = function transitionTo(location, onComplete, onAbort) {
                // this === History
                var this$1 = this;

                // 匹配到的路由
                var route = this.router.match(location, this.current);
                // 确定过渡到匹配的路由中
                this.confirmTransition(route, function() {
                    this$1.updateRoute(route);
                    onComplete && onComplete(route);
                    // HTML5History类中
                    this$1.ensureURL();

                    // fire ready cbs once
                    if (!this$1.ready) {
                        this$1.ready = true;
                        this$1.readyCbs.forEach(function(cb) { cb(route); });
                    }
                }, function(err) {
                    if (onAbort) {
                        onAbort(err);
                    }
                    if (err && !this$1.ready) {
                        this$1.ready = true;
                        this$1.readyErrorCbs.forEach(function(cb) { cb(err); });
                    }
                });
            };

            History.prototype.confirmTransition = function confirmTransition(route, onComplete, onAbort) {
                var this$1 = this;

                var current = this.current;
                var abort = function(err) {
                    if (isError(err)) {
                        if (this$1.errorCbs.length) {
                            this$1.errorCbs.forEach(function(cb) { cb(err); });
                        } else {
                            warn(false, 'uncaught error during route navigation:');
                            console.error(err);
                        }
                    }
                    onAbort && onAbort(err);
                };
                if (
                    isSameRoute(route, current) &&
                    // in the case the route map has been dynamically appended to
                    route.matched.length === current.matched.length
                ) {
                    this.ensureURL();
                    return abort()
                }

                // matched是路由记录，记录当前route时配置数组中的对象
                var ref = resolveQueue(this.current.matched, route.matched);
                var updated = ref.updated; // 当前路由与目标路由共有
                var deactivated = ref.deactivated; // 当前路由特有
                var activated = ref.activated; // 目标路由特有

                // 一些判断的钩子函数
                var queue = [].concat(
                    // in-component leave guards  路由离开之前的判断 []
                    extractLeaveGuards(deactivated),
                    // global before hooks
                    this.router.beforeHooks,
                    // in-component update hooks
                    extractUpdateHooks(updated),
                    // in-config enter guards
                    activated.map(function(m) { return m.beforeEnter; }),
                    // async components
                    resolveAsyncComponents(activated)
                );

                this.pending = route;
                // 迭代器函数，参数一 一个钩子函数，参数二 执行下一步的函数 
                // 参数二：next()也就是runQueue中的（step(index + 1)）也就是执行下一个守卫函数,
                // 
                var iterator = function(hook, next) {
                    if (this$1.pending !== route) {
                        return abort()
                    }
                    try {
                        // 执行钩子函数 ， 参数一目标路由， 参数二当前路由
                        hook(route, current, function(to) {
                            if (to === false || isError(to)) {
                                // next(false) -> abort navigation, ensure current URL
                                this$1.ensureURL(true);
                                abort(to);
                            } else if (
                                typeof to === 'string' ||
                                (typeof to === 'object' && (
                                    typeof to.path === 'string' ||
                                    typeof to.name === 'string'
                                ))
                            ) {
                                // next('/') or next({ path: '/' }) -> redirect
                                abort();
                                if (typeof to === 'object' && to.replace) {
                                    this$1.replace(to);
                                } else {
                                    this$1.push(to);
                                }
                            } else {
                                // confirm transition and pass on the value
                                next(to);
                            }
                        });
                    } catch (e) {
                        abort(e);
                    }
                };

                // 
                runQueue(queue, iterator, function() {
                    var postEnterCbs = [];
                    var isValid = function() { return this$1.current === route; };
                    // wait until async components are resolved before
                    // extracting in-component enter guards
                    // 参数1： 目标路由的路由定义， 参数二： [], 参数三： 当前路由是否与目标路由相同，
                    // 组件内需要执行的守卫函数 beforeRouterEnter  beforeRouterUpdate beforeRouterLeave
                    // z这里是确认进行过度函数，只执行beforeRouterEnter守卫函数
                    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
                    var queue = enterGuards.concat(this$1.router.resolveHooks);
                    // 执行队列中的守卫函数
                    runQueue(queue, iterator, function() {
                        if (this$1.pending !== route) {
                            return abort()
                        }
                        this$1.pending = null;
                        onComplete(route);
                        if (this$1.router.app) {
                            this$1.router.app.$nextTick(function() {
                                postEnterCbs.forEach(function(cb) { cb(); });
                            });
                        }
                    });
                });
            };

            // 更新路由
            History.prototype.updateRoute = function updateRoute(route) {
                // 旧的路由
                var prev = this.current;
                // 新的路由
                this.current = route;
                // 路由监听之后的回调函数
                this.cb && this.cb(route);
                // VueRouter 中有
                this.router.afterHooks.forEach(function(hook) {
                    // 执行路由钩子函数
                    hook && hook(route, prev);
                });
            };

            // 返回base路径   
            // 1. /base
            // 2.https/http:// 后边的值
            function normalizeBase(base) {
                if (!base) {
                    if (inBrowser) {
                        // respect <base> tag
                        var baseEl = document.querySelector('base');
                        base = (baseEl && baseEl.getAttribute('href')) || '/';
                        // strip full URL origin
                        // 将https/http:// 换为''
                        base = base.replace(/^https?:\/\/[^\/]+/, '');
                    } else {
                        base = '/';
                    }
                }
                // make sure there's the starting slash
                if (base.charAt(0) !== '/') {
                    base = '/' + base;
                }
                // remove trailing slash
                return base.replace(/\/$/, '')
            }

            // 
            function resolveQueue(
                current,
                next
            ) {
                var i;
                var max = Math.max(current.length, next.length);
                for (i = 0; i < max; i++) {
                    // 判断出当前路由与目标路由，具有相同父级路由
                    if (current[i] !== next[i]) {
                        break
                    }
                }
                return {
                    // 当前路由与目标路由共有
                    updated: next.slice(0, i),
                    // 目标路由特有
                    activated: next.slice(i),
                    // 当前路由特有
                    deactivated: current.slice(i)
                }
            }

            /**
             * 
             * 功能： 对路由警卫函数进行分类
             * @param {array} records 
             * @param {string} name 'beforeRouteEnter'
             * @param {function} bind  回调函数  给路由绑定名字为name的警卫函数
             * @param {*} reverse 
             * 
             * 返回值：回调函数执行的数据
             */
            function extractGuards(
                records,
                name,
                bind,
                reverse
            ) {
                // 循环records[{}, {}] 再循环{}.components 得到{}.components的各个属性，作为function的参数执行后得到一个数组，在与[] 进行拼接
                // 回调函数参数说明： def: 组件 instance: route实例， match: 与目标所匹配的路由等信息。 key
                var guards = flatMapComponents(records, function(def, instance, match, key) {
                    var guard = extractGuard(def, name); // 与beforeRouteEnter向匹配的路由警卫函数
                    if (guard) {
                        return Array.isArray(guard) ?
                            guard.map(function(guard) { return bind(guard, instance, match, key); }) :
                            bind(guard, instance, match, key)
                    }
                });
                return flatten(reverse ? guards.reverse() : guards)
            }

            // 提取名字为key的路由守卫函数
            function extractGuard(
                def,
                key
            ) {
                if (typeof def !== 'function') {
                    // extend now so that global mixins are applied.
                    def = _Vue.extend(def);
                }
                return def.options[key]
            }

            // 组件内的路由离开之前的守卫函数
            function extractLeaveGuards(deactivated) {
                return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
            }

            function extractUpdateHooks(updated) {
                return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
            }

            // 给组件绑定beforeRouteLeave， beforeRouteUpdate守卫函数
            function bindGuard(guard, instance) {
                if (instance) {
                    return function boundRouteGuard() {
                        // 执行匹配到的守卫函数
                        return guard.apply(instance, arguments)
                    }
                }
            }

            // 路由进入守卫函数
            function extractEnterGuards(
                activated,
                cbs,
                isValid
            ) {
                // 
                return extractGuards(activated, 'beforeRouteEnter',
                    // 给路由绑定beforeRouteEnter的路由警卫函数
                    /**
                     * 
                     * @param {function} guard 警卫函数
                     * @param {*} _ route实例
                     * @param {*} match 与之匹配的路由信息
                     * @param {*} key 路由名称
                     */
                    function(guard, _, match, key) {
                        // 给路由绑定绑定警卫函数
                        return bindEnterGuard(guard, match, key, cbs, isValid)
                    })
            }

            // 返回一个进入路由钩子函数的执行函数，将在队列中进行运行runQueue()
            function bindEnterGuard(
                guard,
                match,
                key,
                cbs,
                isValid
            ) {
                // 进入路由，警卫函数进行判断
                return function routeEnterGuard(to, from, next) {
                    // 执行时将根据runQueue函数
                    return guard(to, from, function(cb) {
                        next(cb);
                        if (typeof cb === 'function') {
                            cbs.push(function() {
                                // #750
                                // if a router-view is wrapped with an out-in transition,
                                // the instance may not have been registered at this time.
                                // we will need to poll for registration until current route
                                // is no longer valid.
                                poll(cb, match.instances, key, isValid);
                            });
                        }
                    })
                }
            }

            function poll(
                cb, // somehow flow cannot infer this is a function
                instances,
                key,
                isValid
            ) {
                if (
                    instances[key] &&
                    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
                ) {
                    cb(instances[key]);
                } else if (isValid()) {
                    setTimeout(function() {
                        poll(cb, instances, key, isValid);
                    }, 16);
                }
            }

            /* 

                自运行函数，参数History类 2327行
             */
            var HTML5History = /*@__PURE__*/ (function(History$$1) {
                function HTML5History(router, base) {
                    var this$1 = this;

                    // 执行History 函数，先初始化History中的值
                    History$$1.call(this, router, base);

                    // 路由中是否设置了滚动页面
                    var expectScroll = router.options.scrollBehavior;
                    // 是否支持滚动
                    var supportsScroll = supportsPushState && expectScroll;

                    // 滚动
                    if (supportsScroll) {
                        setupScroll();
                    }

                    var initLocation = getLocation(this.base);
                    // window.onpopstate：当调用history.go()、history.back()、history.forward()时触发;
                    // pushState()\replaceState()方法不触发。
                    window.addEventListener('popstate', function(e) {
                        var current = this$1.current;

                        // Avoiding first `popstate` event dispatched in some browsers but first
                        // history route not updated since async guard at the same time.
                        var location = getLocation(this$1.base);
                        // 路由是初始路由， 跳转的路由与当前路由一样
                        if (this$1.current === START && location === initLocation) {
                            return
                        }

                        // 路由进行跳转  执行History.prototype.transitionTo函数
                        // 
                        this$1.transitionTo(location, function(route) {
                            if (supportsScroll) {
                                handleScroll(router, route, current, true);
                            }
                        });
                    });
                }
                // 改变HTML5History的构造该对象的构造函数的原型， 原来是一个函数，也就是一个创建函数的功能的函数
                // 现在改变为History类
                // __proto__与prototype的却别
                /**
                 * prototype是函数特有的原型属性（这是一个指针，指向一个对象），对象里边包含了实例可以共享的属性和方法，
                 * 还有一个constructor（这也是一个指针），指回了原构造函数
                 * 类
                 * let Abcdef = function() {
                    }
                    console.log(Abcdef.prototype.constructor === Abcdef) :结果为 true


                    __proro__是对象所具有的一个属性，函数也具有属性，因此也具有__proto__,
                    但是一般的对象{}， 不具有prototype

                    {}.__proto__指向创建{}的原型函数
                    function.__proto__.__proto__ === {}.__proto__
                 */
                // HTML5History是一个object类型不具有prorotype  将HTML5History的原型函数指向了History函数
                console.log(HTML5History.prorotype) // undefinend
                if (History$$1) HTML5History.__proto__ = History$$1;
                // HTML5History是一个object类型，原型函数是object，以下做法是让HTML5History具有函数的一些属性，添加prototype,constructor
                // 将History的prototype作为一个对象绑定到HTML5History的prototype上
                HTML5History.prototype = Object.create(History$$1 && History$$1.prototype);
                // 模拟函数的constructor属性指向原型函数
                HTML5History.prototype.constructor = HTML5History;

                // 创造HTML5History的go路由函数，调用windowwindow.history的go路由
                HTML5History.prototype.go = function go(n) {
                    window.history.go(n);
                };

                // 创造HTML5History的push路由函数  onComplete， onAbort 可选，实际应用中没传
                HTML5History.prototype.push = function push(location, onComplete, onAbort) {
                    var this$1 = this;

                    var ref = this;
                    var fromRoute = ref.current;
                    // 路由进行跳转，第二个参数是保存当前页面滚动位置，以及滚动到目标路由保存的位置，
                    // 在执行路由跳转后触发popstate方法，滚动与否预设置有关
                    this.transitionTo(location, function(route) {
                        pushState(cleanPath(this$1.base + route.fullPath));
                        handleScroll(this$1.router, route, fromRoute, false);
                        onComplete && onComplete(route);
                    }, onAbort);
                };

                HTML5History.prototype.replace = function replace(location, onComplete, onAbort) {
                    var this$1 = this;

                    var ref = this;
                    var fromRoute = ref.current;
                    this.transitionTo(location, function(route) {
                        replaceState(cleanPath(this$1.base + route.fullPath));
                        handleScroll(this$1.router, route, fromRoute, false);
                        onComplete && onComplete(route);
                    }, onAbort);
                };

                HTML5History.prototype.ensureURL = function ensureURL(push) {
                    if (getLocation(this.base) !== this.current.fullPath) {
                        var current = cleanPath(this.base + this.current.fullPath);
                        push ? pushState(current) : replaceState(current);
                    }
                };

                HTML5History.prototype.getCurrentLocation = function getCurrentLocation() {
                    return getLocation(this.base)
                };

                return HTML5History;
            }(History));

            // 获取当前的路径
            function getLocation(base) {
                // 对浏览器的路径进行编码
                var path = decodeURI(window.location.pathname);
                if (base && path.indexOf(base) === 0) {
                    path = path.slice(base.length);
                }
                return (path || '/') + window.location.search + window.location.hash
            }

            /*  */

            var HashHistory = /*@__PURE__*/ (function(History$$1) {
                function HashHistory(router, base, fallback) {
                    History$$1.call(this, router, base);
                    // check history fallback deeplinking
                    if (fallback && checkFallback(this.base)) {
                        return
                    }
                    ensureSlash();
                }

                if (History$$1) HashHistory.__proto__ = History$$1;
                HashHistory.prototype = Object.create(History$$1 && History$$1.prototype);
                HashHistory.prototype.constructor = HashHistory;

                // this is delayed until the app mounts
                // to avoid the hashchange listener being fired too early
                HashHistory.prototype.setupListeners = function setupListeners() {
                    var this$1 = this;

                    var router = this.router;
                    var expectScroll = router.options.scrollBehavior;
                    var supportsScroll = supportsPushState && expectScroll;

                    if (supportsScroll) {
                        setupScroll();
                    }

                    // 首先判断是不是支持保存浏览器浏览的位置， 支持则添加popstate， 不支持使用hashchange
                    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange',
                        // 事件处理函数
                        function() {
                            var current = this$1.current;
                            // false  hash值没有改变，不进行监听
                            if (!ensureSlash()) {
                                return
                            }
                            this$1.transitionTo(getHash(), function(route) {
                                if (supportsScroll) {
                                    handleScroll(this$1.router, route, current, true);
                                }
                                if (!supportsPushState) {
                                    replaceHash(route.fullPath);
                                }
                            });
                        }
                    );
                };

                HashHistory.prototype.push = function push(location, onComplete, onAbort) {
                    var this$1 = this;

                    var ref = this;
                    var fromRoute = ref.current;
                    this.transitionTo(location, function(route) {
                        // 将当前的路径放入到路由记录中
                        pushHash(route.fullPath);
                        handleScroll(this$1.router, route, fromRoute, false);
                        onComplete && onComplete(route);
                    }, onAbort);
                };

                HashHistory.prototype.replace = function replace(location, onComplete, onAbort) {
                    var this$1 = this;

                    var ref = this;
                    var fromRoute = ref.current;
                    this.transitionTo(location, function(route) {
                        replaceHash(route.fullPath);
                        handleScroll(this$1.router, route, fromRoute, false);
                        onComplete && onComplete(route);
                    }, onAbort);
                };

                HashHistory.prototype.go = function go(n) {
                    window.history.go(n);
                };

                HashHistory.prototype.ensureURL = function ensureURL(push) {
                    var current = this.current.fullPath;
                    if (getHash() !== current) {
                        push ? pushHash(current) : replaceHash(current);
                    }
                };

                HashHistory.prototype.getCurrentLocation = function getCurrentLocation() {
                    return getHash()
                };

                return HashHistory;
            }(History));

            function checkFallback(base) {
                var location = getLocation(base);
                // 模式为hash方式，路径讲义/# + 路径
                if (!/^\/#/.test(location)) {
                    window.location.replace(
                        cleanPath(base + '/#' + location)
                    );
                    return true
                }
            }

            // 查看hash有没有改变
            function ensureSlash() {
                var path = getHash();
                // hash值改变
                if (path.charAt(0) === '/') {
                    return true
                }
                // hash值没有改变
                replaceHash('/' + path);
                return false
            }

            // 获取完整的hashURL,第一个#后的值
            function getHash() {
                // We can't use window.location.hash here because it's not
                // consistent across browsers - Firefox will pre-decode it!
                var href = window.location.href;
                var index = href.indexOf('#');
                // empty path
                if (index < 0) { return '' }

                href = href.slice(index + 1);
                // decode the hash but not the search or hash
                // as search(query) is already decoded
                // https://github.com/vuejs/vue-router/issues/2708
                var searchIndex = href.indexOf('?');
                if (searchIndex < 0) {
                    var hashIndex = href.indexOf('#');
                    if (hashIndex > -1) { href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex); } else { href = decodeURI(href); }
                } else {
                    if (searchIndex > -1) { href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex); }
                }

                return href
            }

            // 获取完后曾路径
            function getUrl(path) {
                var href = window.location.href;
                var i = href.indexOf('#');
                var base = i >= 0 ? href.slice(0, i) : href;
                return (base + "#" + path)
            }

            // // 将当前的hash路径路径放入到路由记录中
            function pushHash(path) {
                if (supportsPushState) {
                    pushState(getUrl(path));
                } else {
                    window.location.hash = path;
                }
            }

            function replaceHash(path) {
                if (supportsPushState) {
                    replaceState(getUrl(path));
                } else {
                    window.location.replace(getUrl(path));
                }
            }

            /*  */

            var AbstractHistory = /*@__PURE__*/ (function(History$$1) {
                function AbstractHistory(router, base) {
                    History$$1.call(this, router, base);
                    this.stack = [];
                    this.index = -1;
                }

                if (History$$1) AbstractHistory.__proto__ = History$$1;
                AbstractHistory.prototype = Object.create(History$$1 && History$$1.prototype);
                AbstractHistory.prototype.constructor = AbstractHistory;

                AbstractHistory.prototype.push = function push(location, onComplete, onAbort) {
                    var this$1 = this;

                    this.transitionTo(location, function(route) {
                        this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
                        this$1.index++;
                        onComplete && onComplete(route);
                    }, onAbort);
                };

                AbstractHistory.prototype.replace = function replace(location, onComplete, onAbort) {
                    var this$1 = this;

                    this.transitionTo(location, function(route) {
                        this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
                        onComplete && onComplete(route);
                    }, onAbort);
                };

                AbstractHistory.prototype.go = function go(n) {
                    var this$1 = this;

                    var targetIndex = this.index + n;
                    if (targetIndex < 0 || targetIndex >= this.stack.length) {
                        return
                    }
                    var route = this.stack[targetIndex];
                    this.confirmTransition(route, function() {
                        this$1.index = targetIndex;
                        this$1.updateRoute(route);
                    });
                };

                AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation() {
                    var current = this.stack[this.stack.length - 1];
                    return current ? current.fullPath : '/'
                };

                AbstractHistory.prototype.ensureURL = function ensureURL() {
                    // noop
                };

                return AbstractHistory;
            }(History));

            /*  */



            var VueRouter = function VueRouter(options) {
                if (options === void 0) options = {};

                this.app = null;
                this.apps = [];
                this.options = options;
                this.beforeHooks = [];
                this.resolveHooks = [];
                this.afterHooks = [];
                this.matcher = createMatcher(options.routes || [], this);
                var mode = options.mode || 'hash';
                this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
                if (this.fallback) {
                    mode = 'hash';
                }
                if (!inBrowser) {
                    mode = 'abstract';
                }
                this.mode = mode;

                switch (mode) {
                    case 'history':
                        this.history = new HTML5History(this, options.base);
                        break
                    case 'hash':
                        this.history = new HashHistory(this, options.base, this.fallback);
                        break
                    case 'abstract':
                        this.history = new AbstractHistory(this, options.base);
                        break
                    default:
                        {
                            assert(false, ("invalid mode: " + mode));
                        }
                }
            };

            var prototypeAccessors = { currentRoute: { configurable: true } };

            // 重新封装match方法， 返回值匹配到的数组，
            // 原match函数只需要一个参数，
            VueRouter.prototype.match = function match(
                raw,
                current,
                redirectedFrom
            ) {
                // 
                return this.matcher.match(raw, current, redirectedFrom)
            };

            prototypeAccessors.currentRoute.get = function() {
                return this.history && this.history.current
            };

            VueRouter.prototype.init = function init(app /* Vue component instance */ ) {
                var this$1 = this;

                "development" !== 'production' && assert(
                    install.installed,
                    "not installed. Make sure to call `Vue.use(VueRouter)` " +
                    "before creating root instance."
                );

                this.apps.push(app);

                // set up app destroyed handler
                // https://github.com/vuejs/vue-router/issues/2639
                app.$once('hook:destroyed', function() {
                    // clean out app from this.apps array once destroyed
                    var index = this$1.apps.indexOf(app);
                    if (index > -1) { this$1.apps.splice(index, 1); }
                    // ensure we still have a main app or null if no apps
                    // we do not release the router so it can be reused
                    if (this$1.app === app) { this$1.app = this$1.apps[0] || null; }
                });

                // main app previously initialized
                // return as we don't need to set up new history listener
                if (this.app) {
                    return
                }

                this.app = app;

                // VueRouter类中定义
                var history = this.history;
                if (history instanceof HTML5History) {
                    history.transitionTo(history.getCurrentLocation());
                } else if (history instanceof HashHistory) {
                    var setupHashListener = function() {
                        history.setupListeners();
                    };
                    history.transitionTo(
                        history.getCurrentLocation(),
                        setupHashListener,
                        setupHashListener
                    );
                }

                // 创建History 时创建 HTML5History/HashHistory类继承
                // 得到所有要监听的路由
                history.listen(function(route) {
                    this$1.apps.forEach(function(app) {
                        app._route = route;
                    });
                });
            };

            // 路由导航钩子函数
            VueRouter.prototype.beforeEach = function beforeEach(fn) {
                return registerHook(this.beforeHooks, fn)
            };

            // 注册自定义导航钩子函数，与beforeEach, afterEach一样
            VueRouter.prototype.beforeResolve = function beforeResolve(fn) {
                return registerHook(this.resolveHooks, fn)
            };

            // 路由导航钩子函数
            VueRouter.prototype.afterEach = function afterEach(fn) {
                return registerHook(this.afterHooks, fn)
            };

            // History中的方法
            VueRouter.prototype.onReady = function onReady(cb, errorCb) {
                this.history.onReady(cb, errorCb);
            };

            // History中的方法
            VueRouter.prototype.onError = function onError(errorCb) {
                this.history.onError(errorCb);
            };

            //  HTML5History  HashHistory 类中方法
            VueRouter.prototype.push = function push(location, onComplete, onAbort) {
                this.history.push(location, onComplete, onAbort);
            };

            //  HTML5History  HashHistory 类中方法

            VueRouter.prototype.replace = function replace(location, onComplete, onAbort) {
                this.history.replace(location, onComplete, onAbort);
            };

            //  HTML5History  HashHistory 类中方法

            VueRouter.prototype.go = function go(n) {
                this.history.go(n);
            };

            VueRouter.prototype.back = function back() {
                this.go(-1);
            };

            VueRouter.prototype.forward = function forward() {
                this.go(1);
            };

            // 返回目标位置或是当前路由匹配的组件数组 (是数组的定义/构造类，不是实例)
            VueRouter.prototype.getMatchedComponents = function getMatchedComponents(to) {
                var route = to ?
                    to.matched ?
                    to :
                    this.resolve(to).route :
                    this.currentRoute;
                if (!route) {
                    return []
                }
                return [].concat.apply([], route.matched.map(function(m) {
                    return Object.keys(m.components).map(function(key) {
                        return m.components[key]
                    })
                }))
            };

            VueRouter.prototype.resolve = function resolve(
                to,
                current,
                append
            ) {
                current = current || this.history.current;
                var location = normalizeLocation(
                    to,
                    current,
                    append,
                    this
                );
                var route = this.match(location, current);
                var fullPath = route.redirectedFrom || route.fullPath;
                var base = this.history.base;
                var href = createHref(base, fullPath, this.mode);
                return {
                    location: location,
                    route: route,
                    href: href,
                    // for backwards compat
                    normalizedTo: location,
                    resolved: route
                }
            };

            VueRouter.prototype.addRoutes = function addRoutes(routes) {
                this.matcher.addRoutes(routes);
                if (this.history.current !== START) {
                    this.history.transitionTo(this.history.getCurrentLocation());
                }
            };

            Object.defineProperties(VueRouter.prototype, prototypeAccessors);

            // 注册钩子函数，向保存钩子函数的数组中添加用户创建的函数，再返回获取当前注册函数是钩子函数数组中的第几个
            function registerHook(list, fn) {
                list.push(fn);
                return function() {
                    var i = list.indexOf(fn);
                    if (i > -1) { list.splice(i, 1); }
                }
            }

            function createHref(base, fullPath, mode) {
                var path = mode === 'hash' ? '#' + fullPath : fullPath;
                return base ? cleanPath(base + '/' + path) : path
            }

            VueRouter.install = install;
            VueRouter.version = '3.0.6';

            if (inBrowser && window.Vue) {
                window.Vue.use(VueRouter);
            }

            return VueRouter;

        })
    )
)





// 一个简单的router路由
class VueRouter1 { 
    constructor(Vue, options) {  
            this.$options = options;  
            this.routeMap = {};  
            this.app = new Vue({    data: {     current: '#/'    }   });   
            this.init();  
            this.createRouteMap(this.$options);  
            this.initComponent(Vue); 
        }   // 绑定事件
         
    init() {  
            window.addEventListener('load', this.onHashChange.bind(this), false);  
            window.addEventListener('hashchange', this.onHashChange.bind(this), false); 
        }   // 路由映射表
         
    createRouteMap(options) {   options.routes.forEach(item => {    this.routeMap[item.path] = item.component;   });  }   // 注册组件
         
    initComponent(Vue) {  
            Vue.component('router-link', {    props: {     to: String    },    template: '<a :href="to" rel="external nofollow" rel="external nofollow" ><slot></slot></a>'   });   
            const _this = this;  
            Vue.component('router-view', {    render(h) {     var component = _this.routeMap[_this.app.current];     return h(component);    }   }); 
        }   // 获取当前 hash 串
         
    getHash() {   return window.location.hash.slice(1) || '/';  }   // 设置当前路径
         
    onHashChange() {   this.app.current = this.getHash();  }
}