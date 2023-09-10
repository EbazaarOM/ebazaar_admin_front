/* eslint-disable */
import {userManagement} from "@/libs/axios";
import router from "@/router";

// Token Refresh
let requestsToRefresh = []
let isAlreadyFetchingAccessToken = false;

export default {
    init(instance) {

        instance.interceptors.request.use((config) => {
            config.headers['accept-language'] = router.currentRoute.params && router.currentRoute.params.lang ? router.currentRoute.params.lang : 'ka'
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        instance.interceptors.response.use(
            response => response,
            error => {
                // const { config, response: { status } } = error
                const {config, response} = error;
                const originalRequest = config;
                const status = error.response ? error.response.status : null

                if (status === 401) {
                    if (!isAlreadyFetchingAccessToken) {
                        isAlreadyFetchingAccessToken = true;
                        userManagement.post('auth/refresh_token?refreshToken=' + localStorage.getItem('refreshToken')).then(response => {
                            if (response.data.token) {
                                isAlreadyFetchingAccessToken = false;
                                instance.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.stringify(response.data.token.token).replace(/['"]+/g, '')
                                originalRequest.headers['Authorization'] = 'Bearer ' + JSON.stringify(response.data.token.token).replace(/['"]+/g, '')
                                localStorage.setItem('token', JSON.stringify(response.data.token.token).replace(/['"]+/g, ''));
                                localStorage.setItem('refreshToken', JSON.stringify(response.data.token.refreshToken).replace(/['"]+/g, ''));
                                requestsToRefresh.forEach((cb) => cb(response.data.token.token))
                            } else {
                                localStorage.clear();
                                window.location.replace('/login');
                                return Promise.reject(error)
                            }
                        }).catch(() => {
                            localStorage.clear();
                            window.location.replace('/login');
                            return Promise.reject(error)
                        }).finally(() => {
                            requestsToRefresh = []
                            isAlreadyFetchingAccessToken = false
                        });
                    }
                    return new Promise((resolve, reject) => {
                        // In our variable (requests that expect a new token
                        // from the first request), we add a callback,
                        // which the first request to execute
                        requestsToRefresh.push((token) => {
                            if (token) {
                                config.headers.Authorization = 'Bearer ' + token
                                resolve(instance(config))
                            }

                            // If the first request could not update the token, we
                            // must return the basic request processing logic
                            reject(error)
                        })
                    })
                }
                return Promise.reject(error)
            },
        );

    }
}
