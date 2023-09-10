/* eslint-disable */
import {userManagement} from '@/libs/axios'

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {
        getErrorAlert(state, error) {
            console.log("error.response", error, error.response)
            let statusCode = error.response && error.response.data ? error.response.data.status : 'unknown'
            if (statusCode === 423) alert('User is blocked')
            else if (statusCode === 406) alert('Username or password is incorrect')
            else alert('Unknown error')
        }
    },
    actions: {
        login({commit}, payload) {
            return new Promise((resolve, reject) => {
                userManagement.post('auth/login', payload)
                    .then((response) => {
                        if (response) {
                            localStorage.setItem('token', JSON.stringify(response.data.token.token).replace(/['"]+/g, ''));
                            localStorage.setItem('refreshToken', JSON.stringify(response.data.token.refreshToken).replace(/['"]+/g, ''));
                        } else {
                            alert('Username or password is incorrect')
                            reject('Username or password is incorrect')
                        }
                        resolve(response)
                    }).catch((error) => {
                        commit('getErrorAlert', error)
                        reject(error)
                    }
                )
            })
        },
        refreshToken({commit}) {
            return new Promise((resolve, reject) => {
                userManagement.post('auth/refresh_token?refreshToken=' + localStorage.getItem('refreshToken'))
                    .then(response => {
                        if (response.data.token) {
                            localStorage.setItem('token', JSON.stringify(response.data.token.token).replace(/['"]+/g, ''));
                            localStorage.setItem('refreshToken', JSON.stringify(response.data.token.refreshToken).replace(/['"]+/g, ''));
                        } else {
                            reject('Session expired')
                        }
                        resolve(response)
                    }).catch((error) => {
                        // alert('Username or password is incorrect')
                        commit('getErrorAlert', error)
                        reject(error)
                    }
                )
            })
        },

        requestCode({commit}, payload) {
            return new Promise((resolve, reject) => {
                userManagement.post('auth/request_code?type=PasswordReset', payload)
                    .then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        alert('No such username or email found')
                        reject(error)
                    }
                )
            })
        },

        confirmCode({commit}, payload) {
            return new Promise((resolve, reject) => {
                userManagement.post('auth/confirm_code', payload)
                    .then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        alert('Confirmation code nod valid')
                        reject(error)
                    }
                )
            })
        },

        resetPassword({commit}, payload) {
            return new Promise((resolve, reject) => {
                userManagement.post('auth/reset_password', payload)
                    .then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        alert('Something unexpected happened')
                        reject(error)
                    }
                )
            })
        },

        changePassword({commit}, payload) {
            return new Promise((resolve, reject) => {
                userManagement.put('auth/change_password', payload)
                    .then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        reject(error)
                    }
                )
            })
        },
    },
}
