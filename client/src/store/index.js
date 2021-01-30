import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		message: '',
	},
	getters: {
		message: (state) => {
			return state.message
		},
	},
	mutations: {
		message(state, bool) {
			state.message = bool
		},
	},
	actions: {
		message({ commit }, payload) {
			commit('message', payload)
		},
	},
})
