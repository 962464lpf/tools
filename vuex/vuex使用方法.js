// 不适用模块化，整个项目只有一个state
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        sceneId: '',

    },
    // 获取state中的值，对state中的值进行处理，相当于vue中的computed
    getters: {
        doneTodos(state) {
            return state.sceneId.filter(sceneId => sceneId.done)
        }
    },
    // 同步
    mutations: {
        // 修改项目名称
        changeStepStatus(state, data) {
            state.sceneId = data.title
        }
    },
    // 异步
    actions: {
        changeStepStatus({ commit, state }, data) {
            commit('increment', data)
        }
    }
})

// 使用
// 1. 应用mapState
import { mapState } from 'vuex'
// 2. 初始化
computed: {
        ...mapState(['sceneId'])
    }
    // 3. 使用state中的值
this.sceneId

// 4. 使用mutation中的方法，更新state的值
this.$store.commit('changeStepStatus', { title: '' })

// 使用action中的方法，异步更新state中的值
this.$store.dispatch('changeStepStatus', { title: '' })





// 使用模块化的做法，项目中每一个模块都是一个store
/**
 * 目录结构
 * store
 *    index.js  (初始化vuex)
 *    modules   (项目中所涉及的模块)
 *      USER.js
 *      TABLE.js
 *    
 */

//  index.js 将模块注册到vuex中
import Vue from 'vue'
import Vuex from 'vuex'
import USER from './modules/USER'
import TABLE from './modules/TABLE'

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        USER,
        TABLE
    }
})

// 模块的写法，每一个模块就是单模块使用的store.js. 其中模块包含state, getters, mutations, actions
const state = {
    user: ''
}
const getters = {

}

const mutations = {
    LOGIN(state, data) {
        state.user = data
    }
}

const actions = {
    LOGIN({ commit, state }, data) {
        commit('LOGIN', data)
    }
}
export default {
    namespaced: true, // 如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块
    state,
    actions,
    mutations,
    getters
}

// 模块中使用模块中state
// 1. 引入mapState
import { mapState } from 'vuex'
// 2. 初始化模块中的state中的值
computed: {
        // 第一个参数模块名，store中index定义的模块名
        ...mapState('USER', ['sessionid', 'userInfo', 'loginStauts'])
    }
    // 3. 使用
this.userInfo


// 4. 使用mutation中的方法， 更新state的值
//  模块名/方法名，值
this.$store.commit('USER/LOGIN', JSON.stringify(userInfo))

// 5. 使用action中的方法，异步更新state中的值
this.$store.dispatch('USER/LOGIN', JSON.stringify(userInfo))