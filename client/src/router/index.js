import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	// {
	//   path: '/',
	//   name: 'Home',
	//   component: Home
	// },
	{
		path: '/',
		name: 'Senators',

		component: () =>
			import(/* webpackChunkName: "senators" */ '../views/Senators.vue'),
	},
	{
		path: '/add-senators',
		name: 'Add Senators',

		component: () =>
			import(/* webpackChunkName: "add senators" */ '../views/AddSenators.vue'),
	},
	{
		path: '/senators/:id/update',
		name: 'Update Senator',
		component: () =>
			import(
				/* webpackChunkName: "update senator" */ '../views/UpdateSenator.vue'
			),
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
