/* eslint-disable */
import axios from '@axios'
import {productsManagement, userManagement} from "@/libs/axios";

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        // NotSet, Admin, CallCenterManager, Consul, Courier, Farmer, LogisticsManager, Client
        fetchUsers(ctx, queryParams) {
            let stickerIds = ''
            if (queryParams.stickerIds) {
                stickerIds = ''
                queryParams.stickerIds.forEach(item => {
                    stickerIds += '&stickerIds=' + item
                })
            }
            return new Promise((resolve, reject) => {
                userManagement
                    .get('/accounts?deleted=false' + stickerIds, {params: queryParams})
                    .then(response => {
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },
        // NotSet, Admin, CallCenterManager, Consul, Courier, Farmer, LogisticsManager, Client
        fetchProfile(ctx) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('/accounts/profile')
                    .then(response => {
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },
        fetchUser(ctx, {id}) {
            let request = id ? id : 'profile'
            return new Promise((resolve, reject) => {
                userManagement
                    .get(`/accounts/${request}`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        bypassLogin(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('/auth/bypass_login/' + id)
                    .then(response => {
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },

        fetchResponsiblePerson(ctx) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('/farmers/responsible_person')
                    .then(response => {
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },

        // personal info
        fetchPersonalInfo(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('/accounts/user_types/farmer/personal_info/' + payload.id)
                    .then(response => {
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },
        editPersonalInfo(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('/accounts/user_types/farmer/personal_info/' + payload.id, payload.personalInfo)
                    .then(response => {
                        resolve(response.data)
                    })
                    .catch(error => reject(error))
            })
        },

        // call center manager
        addCallCenterManager(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/call_center_manager/register', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        editCallCenterManager(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put(`accounts/user_types/call_center_manager/update?user_id=${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // consul
        addConsul(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/consul/register', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        editConsul(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put(`accounts/user_types/consul/update?user_id=${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // farmer
        addFarmer(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/farmer/register', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        editFarmer(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put(`accounts/user_types/farmer/update?user_id=${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // logistic manager
        addLogisticManager(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/logistics_manager/register', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        editLogisticManager(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put(`accounts/user_types/logistics_manager/update?user_id=${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // courier
        addCourier(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/courier/register', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        editCourier(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put(`accounts/user_types/courier/update?user_id=${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        //admin
        addAdmin(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/admin/register', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        editAdmin(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put(`accounts/user_types/admin/update?user_id=${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        deleteUser(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .delete(`accounts/${id}`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        deleteUserPermanently(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .delete(`accounts/permanently/${id}`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        //regions, municipalities, villages
        fetchRegions(ctx) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('regions')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchMunicipalities(ctx, payload = {}) {
            let params = payload.region_id ? 'regionId=' + payload.region_id : '';
            params += '&take=-1'
            return new Promise((resolve, reject) => {
                userManagement
                    .get('municipalities?' + params)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchVillages(ctx, payload = {}) {
            let params = payload.region_id ? 'regionId=' + payload.region_id : '';
            params += payload.municipality_id ? '&municipalityId=' + payload.municipality_id : '';
            params += payload.take ? '&take=' + payload.take : '&take=-1'
            params += payload.skip ? '&skip=' + payload.skip : '&skip=0'
            params += payload.searchWord ? '&searchWord=' + payload.searchWord : ''
            return new Promise((resolve, reject) => {
                userManagement
                    .get('villages?' + params)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addVillage(ctx, payload = {}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('villages', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        getVillage(ctx, payload = {}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('villages/' + payload.id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        updateVillage(ctx, payload = {}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put('villages/' + payload.id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteVillage(ctx, payload = {}) {
            console.log('deleteVillage', payload)
            return new Promise((resolve, reject) => {
                userManagement
                    .delete('villages/' + payload.id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },


        setStatus(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/set-status/' + payload.id + '?status=' + payload.status)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        publishFarmer(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/publish/' + payload.id + '?publish=' + payload.value)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        exportToExcel(ctx, payload) {
            let params = payload.userType ? 'userType=' + payload.userType : '';
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/export?' + params, payload, {responseType: 'blob', timeout: 30000})
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        resetUserPassword(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put('auth/reset_password/' + payload.id, {
                        "newPassword": payload.password,
                        "confirmNewPassword": payload.confirm_password
                    })
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        changeUsername(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('accounts/user_types/farmer/update_username', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        //addresses
        fetchUserAddresses(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('addresses?' + 'user_id=' + id + '&take=-1')
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        saveSelectedAddress(ctx, {address_id, user_id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('addresses/select/' + address_id + '?user_id=' + user_id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        addAddress(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('addresses?user_id=' + payload.user_id, payload)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },

        //phones
        fetchUserPhoneNumbers(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('phones?' + 'user_id=' + id + '&take=-1')
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        saveSelectedPhoneNumber(ctx, {phone_id, user_id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('phones/select/' + phone_id + '?user_id=' + user_id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        addPhoneNumber(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('phones?user_id=' + payload.user_id, payload)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        updatePhoneNumber(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .put('phones/' + payload.data.id + '?user_id=' + payload.userId, payload.data)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        deletePhoneNumber(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .delete('phones/' + payload.phoneId + '?user_id=' + payload.userId)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },

        // uploads
        uploadImage(ctx, payload) {
            let data = new FormData();
            data.append('name', Date.now() + "_" + payload.file.name);
            data.append('file', payload.file);
            return new Promise((resolve, reject) => {
                productsManagement
                    .post('/uploads/file', data, {header: {'Content-Type': 'image/png'}})
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        uploadFile(ctx, payload) {
            let data = new FormData();
            data.append('name', Date.now() + "_" + payload.file.name);
            data.append('file', payload.file);
            return new Promise((resolve, reject) => {
                productsManagement
                    .post('/uploads/file', data, {header: {'Content-Type': 'multipart/form-data'}})
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // notifications
        fetchNotifications(ctx, payload = {}) {
            let params = payload.take ? 'take=' + payload.take : '&take=15'
            params += payload.skip ? '&skip=' + payload.skip : '&skip=0'
            params += '&allTypes=true'
            return new Promise((resolve, reject) => {
                userManagement
                    .get('notifications?' + params)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        fetchNotificationsByUser(ctx, payload = {}) {
            let params = payload.take ? 'take=' + payload.take : '&take=10'
            params += payload.skip ? '&skip=' + payload.skip : '&skip=0'
            params += '&allTypes=true'
            return new Promise((resolve, reject) => {
                userManagement
                    .get('notifications/by_user?' + params)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        fetchNotification(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .get('notifications/' + id)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        addNotification(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('notifications', payload)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        sendNotification(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('notifications/send/' + payload.id, payload.body)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        sendNotificationByExcel(ctx, payload) {
            return new Promise((resolve, reject) => {
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
                const formData = new FormData();
                formData.append('file', payload.body);
                userManagement
                    .post('notifications/send_by_excel/' + payload.id, formData, config)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        seenNotification(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('notifications/seen/' + id)
                    .then(response => resolve(response.data))
                    .catch(error => reject(error))
            })
        },
        deleteNotification(ctx, {id}) {
            return new Promise((resolve, reject) => {
                userManagement
                    .delete('notifications/' + id)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        updateNotification(ctx, payload) {
            return new Promise((resolve, reject) => {
                userManagement
                    .post('notifications/' + payload.id, payload)
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
    },
}
