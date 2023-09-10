/* eslint-disable  */
import { orderManagement } from '@/libs/axios';
import moment from 'moment';

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		fetchOrders(ctx, queryParams) {
			queryParams.createDateFrom =
				queryParams.createDateFrom === ''
					? ''
					: moment(queryParams.createDateFrom).utc().format();
			queryParams.createDateTo =
				queryParams.createDateTo === ''
					? ''
					: moment(queryParams.createDateTo).add(1, 'days').utc().format();
			let orders = '?orderStatuses=';
			if (queryParams.statusList) {
				queryParams.statusList.forEach((e, index) => {
					index === 0 ? (orders += e) : (orders += `&orderStatuses=${e}`);
				});
				queryParams.statusList = '';
			}
			let payzeStatuses = '&payzeStatuses=';
			if (queryParams.payzeList) {
				queryParams.payzeList.forEach((e, index) => {
					index === 0
						? (payzeStatuses += e)
						: (payzeStatuses += `&payzeStatuses=${e}`);
				});
				queryParams.payzeList = '';
			}

			return new Promise((resolve, reject) => {
				orderManagement
					.get(`/orders${orders}${payzeStatuses}`, { params: queryParams })
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchProducts(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				orderManagement
					.get(`/orders/order_products`, { params: queryParams })
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchTransactionInfo(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.get(`/orders/transaction_info/${orderId}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		removeProduct(ctx, product) {
			return new Promise((resolve, reject) => {
				orderManagement
					.delete(`/orders/remove_product/${product.orderId}/${product.prodId}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		addProduct(ctx, product) {
			return new Promise((resolve, reject) => {
				orderManagement
					.post(
						`/orders/add_product/${product.orderId}?product_code=${product.code}&quantity=${product.quantity}`
					)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		updateProductQuantity(ctx, product) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(
						`/orders/update_quantity/${product.orderId}/${product.prodId}?quantity=${product.quantity}`
					)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		//
		setOrderNewDate(ctx, order) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(
						`/orders/update_dateofarrival/${order.orderId}/?date=${order.date}`
					)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		// commit order
		commitOrder(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.post(`/orders/commit/${orderId}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		// confirm order
		confirmOrder(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.post(`/orders/confirm/${orderId}/`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		finishOrder(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.post(`/orders/close/${orderId}/`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		closeOrder(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(`/orders/update_order_status/${orderId}/closed`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		cancelOrder(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.post(`/orders/cancel/${orderId}/`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		assignCallCenter(ctx, orderId) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(`orders/assign/${orderId}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		setOrderProductStatus(ctx, product) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(
						`orders/update_product_status/${product.orderId}/${product.prodId}?status=${product.status}&comment=${product.comment}`
					)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		assignCourierToOrder(ctx, data) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(`orders/assign_courier/${data.orderId}/${data.courierId}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		addCommentToOrder(ctx, data) {
			return new Promise((resolve, reject) => {
				orderManagement
					.put(`orders/comment/${data.orderId}?comment=${data.comment}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		exportToExcel(ctx, payload) {
			payload.dateFrom = payload.dateFrom === '' ? '' : moment(payload.dateFrom).utc().format();
      payload.dateTo = payload.dateTo === '' ?  '' : moment(payload.dateTo).add(1, 'days').utc().format();
			return new Promise((resolve, reject) => {
				orderManagement
					.post(
						`orders/export?take=-1&createDateFrom=${payload.dateFrom}&createDateTo=${payload.dateTo}`,
						{},
						{ responseType: 'blob', timeout: 30000 }
					)
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},
	},
};
