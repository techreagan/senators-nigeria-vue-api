import Api from '@/services/Api'

export default {
	findAll(query) {
		return Api().get(
			`senators/?page=${query.page}${
				query.search !== ''
					? '&name=' + query.search + '&state=' + query.search
					: ''
			}`
		)
	},
	findById(id) {
		return Api().get(`senators/${id}`)
	},
	count() {
		return Api().get(`senators/count`)
	},
	create(data) {
		return Api().post('senators', data)
	},
	sendMail({ id, subject, message }) {
		return Api().post(`senators/${id}/send-email`, { subject, message })
	},
	updateById({ id, name, phoneNumber, email, state }) {
		return Api().put(`senators/${id}`, { name, phoneNumber, email, state })
	},
	deleteById(id) {
		return Api().delete(`senators/${id}`)
	},
}
