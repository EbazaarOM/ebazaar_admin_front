/* eslint-disable */
import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useProductsList(props) {
    // Use toast
    const toast = useToast()

    const refUserListTable = ref(null)

    // Table Handlers
    const tableColumns = [
        { key: 'uniqueCode', label: 'ID', sortable: true },
        { key: 'user', label: 'სახელი, გვარი', sortable: true },
        // { key: 'role', sortable: true },
        { key: 'identity', label: 'პირადი ნომერი', sortable: true },
        { key: 'email', label: 'მეილი', sortable: true },
        { key: 'phone', label: 'მობილური', sortable: true },
        { key: 'workPhone', label: 'სამსახურის მობილური', sortable: true },
        { key: 'date', label: 'რეგისტრაციის თარიღი', sortable: true },
        { key: 'status', label: 'სტატუსი'},
        { key: 'region', label: 'რეგიონი'},
        { key: 'city', label: 'ქალაქი'},
        { key: 'village', label: 'სოფელი'},
        { key: 'userType', label: 'მომხმარებლის ტიპი'},
        { key: 'commercialName', label: 'კომერციული სახელი'},
        { key: 'corporateName', label: 'კორპორატიული სახელი'},
        { key: 'juridicalType', label: 'იურიდიული ტიპი'},
        { key: 'consul', label: 'კონსული'},
        { key: 'vehicleManufacturer', label: 'მანქანის მარკა'},
        { key: 'vehicleModel', label: 'მანქანის მოდელი'},
        { key: 'licensePlate', label: 'სერიული ნომერი'},
        { key: 'gender', label: 'სქესი'},
        { key: 'published', label: 'გამოქვეყნებული'},
        { key: 'reset_password', label: 'პაროლის შეცვლა'},
        { key: 'actions', label: 'ექშენები'},
    ]
    const perPage = ref(10)
    const totalUsers = ref(0)
    const currentPage = ref(1)
    const perPageOptions = [10, 25, 50, 100]
    const searchQuery = ref('')
    const regionFilter = ref('')
    const genderFilter = ref('')
    const villageFilter = ref('')
    const municipalityFilter = ref('')
    const dateFilter = ref('')
    const birthDateFilter = ref('')
    const sortBy = ref('id')
    const isSortDirDesc = ref(true)
    const roleFilter = ref(null)
    const planFilter = ref(null)
    const statusFilter = ref(null)
    const roleQuery =  ref(props.roleQuery)
    const userType =  ref('')

    const farmerEditFields = {
        "role": 'farmer',
        "addTitle": 'დაამატე ფერმერი',
        "editTitle": 'შეცვალე ფერმერის მონაცემები',
        "isFarmer": true,
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": {visible: true, required: true},
        "sticker": true,
        "email": {visible: true, required: false},
        "phoneNumber": {visible: true, required: true},
        "password": true,
        "confirmPassword": true,
        "bankAccountNumber": {visible: true, required: true},
        "userType": true,
        "consul": true,
        "enableCash": true,
        "address": ["regionId", "region", "address", "city"],
        "personalInfo": ["coverImage", "profileImage", "videoLink", "text"],
        "juridicalInfo": {
            "commercialName": '',
            "juridicalName": '',
            "identificationNumber": '',
            "juridicalType": '',
        },
        "published": [
            {value: 'NotSet', text: 'აირჩიეთ'},
            {value: 'true', text: 'Published'},
            {value: 'false', text: 'Unpublished'},
        ]
    }
    const adminEditFields = {
        "role": 'admin',
        "addTitle": 'დაამატე ადმინი',
        "editTitle": 'შეცვალე ადმინის მონაცემები',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "password": true,
        "confirmPassword": true,
        "workingEmail": true,
        "phoneNumber": {visible: true, required: true},
        "email": {visible: true, required: true},
    }
    const callCenterManagerEditFields = {
        "role": 'call_center_manager',
        "addTitle": 'დაამატე ქოლ ცენტრის მენეჯერი',
        "editTitle": 'შეცვალე ქოლ ცენტრის მენეჯერის მონაცემები',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": {visible: true, required: true},
        "phoneNumber": {visible: true, required: true},
        "workspacePhoneNumber": {visible: true, required: true},
        "password": true,
        "confirmPassword": true,
        "status": [
            {value: 'NotSet', text: 'აირჩიეთ'},
            {value: 'Active', text: 'აქტიური'},
            {value: 'Inactive', text: 'არააქტიური'},
            {value: 'Vacation', text: 'შვებულება'},
        ]
    }
    const clientsEditFields = {
        "role": 'client',
        "title": '',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": true,
        "phoneNumber": true,
        "password": true,
        "confirmPassword": true,
    }
    const consulsEditFields = {
        "role": 'consul',
        "addTitle": 'დაამატე კონსული',
        "editTitle": 'შეცვალე კონსულის მონაცემები',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "password": true,
        "confirmPassword": true,
        "bankAccountNumber": {visible: true, required: true},
        "email": true,
        "phoneNumber": true,
        "address": ["regionId", "region", "address", "city"]
    }
    const couriersEditFields = {
        "role": 'courier',
        "addTitle": 'დაამატე კურიერი',
        "editTitle": 'შეცვალე კურიერის მონაცემები',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": {visible: true, required: true},
        "phoneNumber": {visible: true, required: true},
        "password": true,
        "confirmPassword": true,
        "licenseNumber": {visible: true, required: true},
        "vehicle": {
            "manufacturer": '',
            "model": '',
            "licencePlate": ''
        },
        "status": [
            {value: 'NotSet', text: 'აირჩიეთ'},
            {value: 'Active', text: 'აქტიური'},
            {value: 'Inactive', text: 'არააქტიური'},
        ]
    }
    const logisticsManagerEditFields = {
        "role": 'logistics_manager',
        "addTitle": 'დაამატე ლოჯისტიკის მენეჯერი',
        "editTitle": 'შეცვალე ლოჯისტიკის მენეჯერის მონაცემები',
        "firstName": true,
        "lastName": true,
        "userName": true,
        "identity": true,
        "email": {visible: true, required: true},
        "phoneNumber": true,
        "password": true,
        "confirmPassword": true,
        "licenseNumber": {visible: true, required: true},
        "vehicle": {
            "manufacturer": '',
            "model": '',
            "licencePlate": ''
        }
    }

    const editFieldsDict = {
        admin: adminEditFields,
        farmer: farmerEditFields,
        callCenterManager: callCenterManagerEditFields,
        user: clientsEditFields,
        consul: consulsEditFields,
        courier: couriersEditFields,
        logisticsManager: logisticsManagerEditFields,
    }

    const requestUrls = {
        admin: {add: 'app-user/addAdmin', edit: 'app-user/editAdmin'},
        farmer: {add: 'app-user/addFarmer', edit: 'app-user/editFarmer'},
        callCenterManager: {add: 'app-user/addCallCenterManager', edit: 'app-user/editCallCenterManager'},
        user: {add: 'app-user/addClient', edit: 'app-user/editClient'},
        consul: {add: 'app-user/addConsul', edit: 'app-user/editConsul'},
        courier: {add: 'app-user/addCourier', edit: 'app-user/editCourier'},
        logisticsManager: {add: 'app-user/addLogisticManager', edit: 'app-user/editLogisticManager'},
    }

    const dataMeta = computed(() => {
        const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
        return {
            from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
            to: perPage.value * (currentPage.value - 1) + localItemsCount,
            of: totalUsers.value,
        }
    })

    const categoriesTree = fetchCategoriesTree
    const refetchData = () => {
        refUserListTable.value.refresh()
    }

    watch([currentPage, perPage, searchQuery, dateFilter, birthDateFilter,
        genderFilter, regionFilter, municipalityFilter, villageFilter,
        userType, roleFilter, planFilter, statusFilter], () => {
        refetchData()
    })

    const fetchRegions = (ctx, callback) => {
        store.dispatch('app-user/fetchRegions').then((response) => {
            // const regions = response.data.data;
            // console.log("app-user/fetchRegions", response.data)
            return response.data.data;
        })
    };

    const fetchUsers = (ctx, callback) => {
        store
            .dispatch('app-user/fetchUsers', {
                searchWord: searchQuery.value,
                gender: genderFilter.value.value,
                regionId: regionFilter.value.id,
                municipalityId: municipalityFilter.value.id,
                villageId: villageFilter.value.id,
                registrationDate: dateFilter.value,
                birthDate: birthDateFilter.value,
                // perPage: perPage.value,
                // page: currentPage.value,
                role: roleQuery.value,
                userType: userType.value.value,
                take: perPage.value,
                skip: (currentPage.value - 1) *  perPage.value,
                // sortBy: sortBy.value,
                // sortDesc: isSortDirDesc.value,
                // plan: planFilter.value,
                // status: statusFilter.value,
            })
            .then(response => {
                // const { users, total } = response.data
                // const users = response.data
                // const users = []
                // response.data.forEach(user => {
                //     if(user.lockoutEnd === null) users.push(user)
                // });
                const users = response.data;
                const total = response.meta ? response.meta.total : 0;
                // console.log("response data", users);
                callback(users)
                totalUsers.value = total
            })
            .catch(() => {
                toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Error fetching users list',
                        icon: 'AlertTriangleIcon',
                        variant: 'danger',
                    },
                })
            })
    }

    const fetchCategories = (ctx, callback) => {
        store
            .dispatch('app-category/fetchCategories', {
                searchWord: searchQuery.value,
                gender: genderFilter.value.value,
                regionId: regionFilter.value.id,
                municipalityId: municipalityFilter.value.id,
                villageId: villageFilter.value.id,
                registrationDate: dateFilter.value,
                birthDate: birthDateFilter.value,
                // perPage: perPage.value,
                // page: currentPage.value,
                role: roleQuery.value,
                userType: userType.value.value,
                take: perPage.value,
                skip: (currentPage.value - 1) *  perPage.value,
                // sortBy: sortBy.value,
                // sortDesc: isSortDirDesc.value,
                // plan: planFilter.value,
                // status: statusFilter.value,
            })
            .then(response => {
                // const { users, total } = response.data
                // const users = response.data
                // const users = []
                // response.data.forEach(user => {
                //     if(user.lockoutEnd === null) users.push(user)
                // });
                const categories = response.data;
                const total = response.meta ? response.meta.total : 0;
                console.log("response data", categories);
                callback(categories)
                totalUsers.value = total
            })
            .catch(() => {
                toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Error fetching users list',
                        icon: 'AlertTriangleIcon',
                        variant: 'danger',
                    },
                })
            })
    }

    const fetchCategoriesTree = (ctx, callback) => {
        store
            .dispatch('app-category/fetchCategoriesTree', {
                searchWord: searchQuery.value,
                gender: genderFilter.value.value,
                regionId: regionFilter.value.id,
                municipalityId: municipalityFilter.value.id,
                villageId: villageFilter.value.id,
                registrationDate: dateFilter.value,
                birthDate: birthDateFilter.value,
                // perPage: perPage.value,
                // page: currentPage.value,
                role: roleQuery.value,
                userType: userType.value.value,
                take: perPage.value,
                skip: (currentPage.value - 1) *  perPage.value,
                // sortBy: sortBy.value,
                // sortDesc: isSortDirDesc.value,
                // plan: planFilter.value,
                // status: statusFilter.value,
            })
            .then(response => {
                // const { users, total } = response.data
                // const users = response.data
                // const users = []
                // response.data.forEach(user => {
                //     if(user.lockoutEnd === null) users.push(user)
                // });
                const categoriesTree = response;
                const total = response.meta ? response.meta.total : 0;
                console.log("response data", categoriesTree);
                callback(categoriesTree)
                totalUsers.value = total
            })
            .catch(() => {
                toast({
                    component: ToastificationContent,
                    props: {
                        title: 'Error fetching users list',
                        icon: 'AlertTriangleIcon',
                        variant: 'danger',
                    },
                })
            })
    }

    // *===============================================---*
    // *--------- UI ---------------------------------------*
    // *===============================================---*

    const resolveUserRoleVariant = role => {
        if (role === 'subscriber') return 'primary'
        if (role === 'author') return 'warning'
        if (role === 'maintainer') return 'success'
        if (role === 'editor') return 'info'
        if (role === 'admin') return 'danger'
        return 'primary'
    }

    const resolveUserRoleIcon = role => {
        if (role === 'subscriber') return 'UserIcon'
        if (role === 'author') return 'SettingsIcon'
        if (role === 'maintainer') return 'DatabaseIcon'
        if (role === 'editor') return 'Edit2Icon'
        if (role === 'admin') return 'ServerIcon'
        return 'UserIcon'
    }

    const resolveUserStatusVariant = status => {
        if (status === 'pending') return 'warning'
        if (status === 'active') return 'success'
        if (status === 'inactive') return 'secondary'
        return 'primary'
    }

    return {
        fetchUsers,
        fetchCategories,
        fetchCategoriesTree,
        categoriesTree,
        tableColumns,
        perPage,
        currentPage,
        totalUsers,
        dataMeta,
        perPageOptions,
        searchQuery,
        genderFilter,
        regionFilter,
        municipalityFilter,
        villageFilter,
        dateFilter,
        birthDateFilter,
        userType,
        sortBy,
        isSortDirDesc,
        refUserListTable,
        editFieldsDict,
        requestUrls,

        resolveUserRoleVariant,
        resolveUserRoleIcon,
        resolveUserStatusVariant,
        refetchData,
        fetchRegions,

        // Extra Filters
        roleFilter,
        planFilter,
        statusFilter,
    }
}
