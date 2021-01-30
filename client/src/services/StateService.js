import Api from '@/services/Api'

export default {
	findAll() {
		return Api().get(`states/`)
	},
	count() {
		return Api().get(`states/count`)
	},
}
