import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { required, email, max, min, size, oneOf } from 'vee-validate/dist/rules'

import {
	extend,
	ValidationObserver,
	ValidationProvider,
	setInteractionMode,
} from 'vee-validate'

import store from './store'

setInteractionMode('eager')

extend('required', {
	...required,
	message: 'Enter {_field_}',
})

extend('oneOf', {
	...oneOf,
})

extend('max', {
	...max,
	message: '{_field_} may not be greater than {length} characters',
})

extend('min', {
	...min,
	message: '{_field_} may not be less than {length} characters',
})

extend('email', {
	...email,
	message: 'Email must be valid',
})

extend('password', {
	params: ['target'],
	validate(value, { target }) {
		return value === target
	},
	message: 'Password does not match',
})

extend('size', {
	...size,
	message: 'video size should be less than 5 MB!',
})
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    store,
    render: (h) => h(App)
}).$mount('#app')
