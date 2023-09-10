/* eslint-disable  */
import { orderManagement, productsManagement, userManagement } from '@/libs/axios';

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		fetchStats(ctx, queryParams,) {
			console.log(queryParams);
			const management = queryParams.callName === 'products' ? productsManagement : orderManagement;
			let url = '';
			if(queryParams.role === 'callCenterManager') { 
				url = `/statistics/call_center?dateFrom=${queryParams.dateFrom}&dateTo=${queryParams.dateTo}`
			} else {
				url = `/statistics/${queryParams.role}/${queryParams.callName}?dateFrom=${queryParams.dateFrom}&dateTo=${queryParams.dateTo}`
			}
			return new Promise((resolve, reject) => {
				management
					.get(url)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchPercieseStats(ctx, queryParams,) {
			const role = queryParams.role === 'call_center' ? 'admin' : queryParams.role;
			console.log(role);
			let url = `/statistics/${role}/sold_precise?dateFrom=${queryParams.dateFrom}&dateTo=${queryParams.dateTo}`;
			return new Promise((resolve, reject) => {
				orderManagement
					.get(url)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchDeliveries(ctx, queryParams,) {
			return new Promise((resolve, reject) => {
				orderManagement
					.get(`/statistics/deliveries?dateFrom=${queryParams.dateFrom}&dateTo=${queryParams.dateTo}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchBonuses(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				orderManagement
					.get(`/statistics/${queryParams.role}/bonus_precise?dateFrom=${queryParams.dateFrom}&dateTo=${queryParams.dateTo}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		getUserStats(ctx, role) {
			let url = '';
			if(role === 'admin') {
				url = `admin`
			} else {
				url = `consul/farmer_count`
			}
			return new Promise((resolve, reject) => {
				userManagement
					.get(`/statistics/${url}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});	
		},
	},
};
