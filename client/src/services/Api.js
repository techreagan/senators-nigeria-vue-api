import axios from 'axios'

export default () => {
	const axiosInstance = axios.create({
		baseURL: `${process.env.VUE_APP_URL}/api/v1`,
	})

	// axiosInstance.interceptors.response.use(
	// 	(response) => response,
	// 	(error) => {
	// 		if (error.response.status === 401) {
	// 			localStorage.removeItem('token')
	// 			localStorage.removeItem('user')
	// 			location.reload()
	// 		}
	// 		return Promise.reject(error)
	// 	}
	// )

	return axiosInstance
}
