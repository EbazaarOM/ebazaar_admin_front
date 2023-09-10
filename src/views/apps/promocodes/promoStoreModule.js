// /* eslint-disable  */
import { userManagement } from '@/libs/axios';

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		fetchUsers() {
			return new Promise((resolve, reject) => {
				userManagement
					.get('/accounts?skip=0&take=-1&orderByDesc=true&role=Client')
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},
		fetchPromoCodes(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				userManagement
					.get('/promo_codes', { params: queryParams })
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},
		fetchPromoCodeById(ctx, id) {
			return new Promise((resolve, reject) => {
				userManagement
					.get(`/promo_codes/${id}`)
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},
		createPromoCode(ctx, payload) {
			return new Promise((resolve, reject) => {
				userManagement
					.post('promo_codes', payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error.response));
			});
		},
		editPromoCode(ctx, payload) {
			return new Promise((resolve, reject) => {
				userManagement
					.put(`promo_codes/${payload.id}`, payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		publishPromoCode(ctx, id) {
			return new Promise((resolve, reject) => {
				userManagement
					.put(`promo_codes/publish/${id}`)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		deletePromoCode(ctx, id) {
			return new Promise((resolve, reject) => {
				userManagement
					.delete(`promo_codes/${id}`)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
	},
};
