/* eslint-disable */
import Vue from 'vue';

// axios
import axios from 'axios';
import interceptors from '@/libs/interceptors';

// For common config
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const userManagement = axios.create({
	// You can add your headers here
	// ================================
	baseURL: process.env.VUE_APP_API_USERS,
});
export const productsManagement = axios.create({
	// You can add your headers here
	// ================================
	baseURL: process.env.VUE_APP_API_PRODUCTS,
});
export const staticManagement = axios.create({
	// You can add your headers here
	// ================================
	baseURL: process.env.VUE_APP_STATIC_RESOURCES_URL,
});
export const contentManagement = axios.create({
	// You can add your headers here
	// ================================
	baseURL: process.env.VUE_APP_API_CONTENT,
});

export const orderManagement = axios.create({
	// You can add your headers here
	// ================================
	baseURL: process.env.VUE_APP_API_ORDERS,
});

interceptors.init(userManagement);
interceptors.init(productsManagement);
interceptors.init(contentManagement);
interceptors.init(orderManagement);

// axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
// axios.defaults.headers.common['accept-language'] = 'en';

let local_storage_lang = localStorage.getItem('lang')
let accept_language = local_storage_lang ? local_storage_lang : 'ka'

productsManagement.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
productsManagement.defaults.headers.common['accept-language'] = accept_language ? accept_language : 'ka'

userManagement.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
userManagement.defaults.headers.common['accept-language'] = accept_language ? accept_language : 'ka'

contentManagement.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
contentManagement.defaults.headers.common['accept-language'] = accept_language ? accept_language : 'ka'

orderManagement.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('token')}`;
orderManagement.defaults.headers.common['accept-language'] = accept_language ? accept_language : 'ka'

export default axios;
