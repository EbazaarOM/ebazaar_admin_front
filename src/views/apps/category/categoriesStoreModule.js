/* eslint-disable */
import axios from '@axios'
import {productsManagement} from "@/libs/axios";

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        fetchCategories(ctx, payload={}) {
            let params = payload.take ? 'take=' + payload.take : 'take=-1'
            params += payload.skip ? '&skip=' + payload.skip : '&skip=0'
            params += payload.searchWord ? '&searchWord=' + payload.searchWord : '';
            params += payload.orderByDesc ? '&orderByDesc=' + payload.orderByDesc : '&orderByDesc=true'
            params += '&deleted=false';
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('/categories?'+ params)
                    .then(response => {
                        resolve(response.data.data)
                    })
                    .catch(error => reject(error))
            })
        },
        fetchSubCategories(ctx, payload={}) {
            let params = payload.skip ? 'skip=' + payload.skip : 'skip=0'
            params += payload.take ? '&take=' + payload.take : '&take=-1'
            params += payload.subCategoryId ? '&subCategoryId=' + payload.subCategoryId : '';
            params += payload.categoryId ? '&categoryId=' + payload.categoryId : '';
            params += '&deleted=false';
            // params += payload.orderByDesc ? '&orderByDesc=' + payload.orderByDesc : '&orderByDesc=true'
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('/subcategories?' + params)
                    .then(response => {
                        resolve(response.data.data)
                    })
                    .catch(error => reject(error))
            })
        },
        fetchSpecificationCategories(ctx, payload={}) {
            let params = payload.skip ? 'skip=' + payload.skip : 'skip=0'
            params += payload.take ? '&take=' + payload.take : '&take=-1'
            params += payload.subCategoryId ? '&subCategoryId=' + payload.subCategoryId : '';
            params += payload.categoryId ? '&categoryId=' + payload.categoryId : '';
            // params += payload.orderByDesc ? '&orderByDesc=' + payload.orderByDesc : '&orderByDesc=true'
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('/specification_categories?' + params, {params: payload})
                    .then(response => {
                        resolve(response.data.data)
                    })
                    .catch(error => reject(error))
            })
        },
        fetchCategoriesTree(ctx, payload) {
            // let params = payload.searchWord ? 'searchWord=' + payload.searchWord : '';
            // params += payload.take ? '&take=' + payload.take : '&take=15'
            // params += payload.skip ? '&skip=' + payload.skip : '&skip=0'
            // params += payload.orderByDesc ? '&orderByDesc=' + payload.orderByDesc : '&orderByDesc=true'
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('/categories/tree', {params: payload})
                    .then(response => {
                        console.log("categories tree", response.data)
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },
        addCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .post('categories', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        getCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('categories/' + payload.id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        getSubCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('subcategories/' + payload.id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        getSpecificationCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('specification_categories/' + payload.id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        getSpecification(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .get('specifications/' + payload.id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        updateCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .put('categories/' + payload.id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteCategory(ctx, { id }) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .delete('categories/' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addSubCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .post('subcategories', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateSubCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .put('subcategories/' + payload.id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteSubCategory(ctx, { id }) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .delete('subcategories/' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addSpecificationCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .post('specification_categories', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateSpecificationCategory(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .put('specification_categories/' + payload.id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        deleteSpecificationCategory(ctx, { id }) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .delete('specification_categories/' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        addSpecification(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .post('specifications', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        updateSpecification(ctx, payload) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .put('specifications/' + payload.id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        deleteSpecification(ctx, { id }) {
            return new Promise((resolve, reject) => {
                productsManagement
                    .delete('specifications/' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

    },
}
