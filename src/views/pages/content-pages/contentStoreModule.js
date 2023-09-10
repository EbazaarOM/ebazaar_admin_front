/* eslint-disable */
import {contentManagement} from "@/libs/axios";

export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        fetchFaqContent(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/faqcontent')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateFaqContent(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/faqcontent', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchFaq(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/faq' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateFaq(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/faq' + id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addFaq(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/faq', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteFaq(ctx, payload) {
            let id = payload ? '/' + payload : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete('/faq' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchAboutUsContent(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/about/content')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateAboutUsContent(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/about/content', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchContactUsContent(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/contact')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateContactUsContent(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/contact', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchSocialLinks(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/sociallinks')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateSocialLinks(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/sociallinks', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        //team members
        fetchTeamMembers(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get(`/about/teammembers${id}?take=-1`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addTeamMember(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/about/teammembers', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateTeamMember(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put(`/about/teammembers/${payload.id}`, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteTeamMember(ctx, id) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete(`/about/teammembers/${id}`)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // template pages
        fetchTemplatePages(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/pages' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        getTemplatePageSlug(ctx, payload) {
            let params = 'text=' + payload.text
            params += '&languageCode=' + payload.languageCode
            params += payload.id ? '&id=' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/pages/slug?' + params)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateTemplatePage(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/pages' + id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addTemplatePage(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/pages', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteTemplatePage(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete('/pages' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // blogs
        fetchBlogs(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/blogs' + id + '?take=-1')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateBlog(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/blogs' + id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addBlog(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/blogs', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteBlog(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete('/blogs' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        getBlogSlug(ctx, payload) {
            let params = 'text=' + payload.text
            params += '&languageCode=' + payload.languageCode
            params += payload.id ? '&id=' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/blogs/slug?' + params)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // slider
        fetchSlides(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/slider' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateSlide(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/slider' + id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addSlide(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/slider', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteSlide(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete('/slider' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // features
        fetchFeatures(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/features' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateFeature(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/features' + id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addFeature(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/features', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteFeature(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete('/features' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // banners
        fetchBanners(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/banners')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateBanners(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/banners', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // terms and conditions
        fetchTermsAndConditionsContent(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/terms-and-conditions')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateTermsAndConditionsContent(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/terms-and-conditions', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // analytics
        fetchAnalytics(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/analytics')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateAnalytics(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/analytics', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // header phone
        fetchHeaderPhone(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/headerphone')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateHeaderPhone(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/headerphone', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // website share info
        fetchOpenGraph(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/opengraph')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateOpenGraph(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/opengraph', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        // career
        fetchCareerContent(ctx) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/career/content')
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateCareerContent(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/career/content', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        fetchVacancies(ctx, payload=null) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .get('/career/vacancies' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        updateVacancy(ctx, payload) {
            let id = payload ? '/' + payload.id : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .put('/career/vacancies' + id, payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        addVacancy(ctx, payload) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/career/vacancies', payload)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },
        deleteVacancy(ctx, payload) {
            let id = payload ? '/' + payload : ''
            return new Promise((resolve, reject) => {
                contentManagement
                    .delete('/career/vacancies' + id)
                    .then(response => resolve(response))
                    .catch(error => reject(error))
            })
        },

        cropImage(ctx, formData) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/uploads/crop_image', formData, { header: { 'Content-Type': 'image/png' } })
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        uploadImage(ctx, formData) {
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/uploads/image', formData, { header: { 'Content-Type': 'image/png' } })
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
        uploadFile(ctx, payload) {
            console.log('form data', payload)
            let data = new FormData();
            data.append('name', Date.now() + "_" + payload.file.name);
            data.append('file', payload.file);
            return new Promise((resolve, reject) => {
                contentManagement
                    .post('/uploads/file', data, { header: { 'Content-Type': 'image/png' } })
                    .then((response) => resolve(response))
                    .catch((error) => reject(error));
            });
        },
    },
}
