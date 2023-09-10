/* eslint-disable */
import moment from 'moment';
import { productsManagement, userManagement, orderManagement } from '@/libs/axios';

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		fetchCategories(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get('/categories?deleted=false&skip=0&take=-1&orderByDesc=true')
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchCategory(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/categories/${id.id}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchSubCategory(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/subcategories?deleted=false&skip=0&take=-1&orderByDesc=true&categoryId=${id.id}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchSubCategoryChildren(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/subcategories?deleted=false&skip=0&take=-1&orderByDesc=true&subCategoryId=${id.id}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchSingleSubCategory(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/subcategories/${id.id}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchProducts(ctx, queryParams) {
			console.log(queryParams);
			if (queryParams.noDates !== true) {
				queryParams.createDateFrom = queryParams.createDateFrom === '' ? '' : moment(queryParams.createDateFrom).utc().format();
				queryParams.createDateTo = queryParams.createDateTo === '' ? '' : moment(queryParams.createDateTo).add(1, 'days').utc().format();
			}
			let stickers = '?stickerIds=';
			if (queryParams.stickerIds) {
				queryParams.stickerIds.forEach((e, index) => {
					index === 0 ? (stickers += e) : (stickers += `&stickerIds=${e}`);
				});
				queryParams.stickerIds = '';
			}

			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/products${stickers}`, { params: queryParams })
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchProductByCode(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/products/get_by_code/${id}`)
					.then((response) => {
						resolve(response);
					})
					.catch((error) => reject(error));
			});
		},
		fetchProduct(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`/products/get_by_id/${id}`)
					.then((response) => {
						resolve(response);
					})
					.catch((error) => reject(error));
			});
		},
		fetchUnits(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get('units?skip=0&take=-1&orderByDesc=true')
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchFarmers(ctx, consulId) {
			console.log('consulId', consulId);
			return new Promise((resolve, reject) => {
				userManagement
					.get(`accounts?skip=0&take=-1&orderByDesc=true&role=Farmer&consulId=${consulId}&deleted=false`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchConsuls(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				userManagement
					.get('accounts?skip=0&take=-1&orderByDesc=true&role=Consul')
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchAddressAndCouncil(ctx, queryParams) {
			return new Promise((resolve, reject) => {
				userManagement
					.get(`accounts/${queryParams}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchStickers(ctx) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get('stickers?skip=0&take=-1&orderByDesc=true')
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		fetchSticker(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`stickers/${id}`)
					.then((response) => {
						resolve(response.data);
					})
					.catch((error) => reject(error));
			});
		},
		addProduct(ctx, payload) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('products', payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		editProduct(ctx, payload) {
			return new Promise((resolve, reject) => {
				productsManagement
					.put(`products/${payload.id}`, payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		getUnit(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`units/${id}`)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		getSpecifications(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get(`specification_categories/tree/${id}`)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		exportToExcel(ctx, visible) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post(`products/export?visible=${visible}`, {}, { responseType: 'blob', timeout: 30000 })
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},
		synchronize(ctx, code) {
			console.log(code);
			return new Promise((resolve, reject) => {
				orderManagement
					.post(`order_products/apply_corrections/${code}`, )
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},
		updatePriceAndCount(ctx, params) {
			console.log(params);
			return new Promise((resolve, reject) => {
				productsManagement
					.put(`products/stocks_and_prices/${params.id}?user_id=${params.userId}`, { stockCount: params.stock, unitCost: params.price })
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			});
		},

		deleteProduct(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.delete(`products/${id}`)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		//stickers
		addSticker(ctx, payload) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('stickers', payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		updateSticker(ctx, payload) {
			console.log(payload.id);
			return new Promise((resolve, reject) => {
				productsManagement
					.put(`stickers/${payload.id}`, payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		deleteSticker(ctx, id) {
			return new Promise((resolve, reject) => {
				productsManagement
					.delete(`stickers/${id}`)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		crop_image(ctx, formData) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('/uploads/crop_image', formData, { header: { 'Content-Type': 'image/png' } })
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		insert_data(ctx, formData) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('/products/insert_data', formData, { header: { 'Content-Type': 'multipart/form-data' } })
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},

		// reviews
		fetchReviews(ctx, payload={}) {
			let params = payload.take ? 'take=' + payload.take : '&take=-1'
			params += payload.skip ? '&skip=' + payload.skip : '&skip=0'
			params += payload.searchWord ? '&searchWord=' + payload.searchWord : ''
			return new Promise((resolve, reject) => {
				productsManagement
					.get('reviews?' + params)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		fetchReview(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.get('reviews/' + id)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		deleteReview(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.delete('reviews/' + id)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		approveReview(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('reviews/approve/' + id)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		hideReview(ctx, { id }) {return new Promise((resolve, reject) => {
			productsManagement
				.post('reviews/hide/' + id)
				.then((response) => resolve(response))
				.catch((error) => reject(error));
		});},
		exportReviews(ctx) {return new Promise((resolve, reject) => {
			productsManagement
				.post('reviews/export/', {},{responseType: 'blob', timeout: 30000})
				.then((response) => resolve(response))
				.catch((error) => reject(error));
		});},

		// comments
		addComment(ctx, payload) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('comments', payload)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		deleteComment(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.delete('comments/' + id)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		approveComment(ctx, { id }) {
			return new Promise((resolve, reject) => {
				productsManagement
					.post('comments/approve/' + id)
					.then((response) => resolve(response))
					.catch((error) => reject(error));
			});
		},
		hideComment(ctx, { id }) {return new Promise((resolve, reject) => {
			productsManagement
				.post('comments/hide/' + id)
				.then((response) => resolve(response))
				.catch((error) => reject(error));
		});},
	},
};
