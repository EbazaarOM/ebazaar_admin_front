/* eslint-disable */
import {ref, watch, computed} from '@vue/composition-api'
import store from '@/store'
import {title} from '@core/utils/filter'

// Notification
import {useToast} from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useProductsList(props) {
    // Use toast
    const toast = useToast()

    const refUserListTable = ref(null)

    // Table Handlers
    const tableColumns = [
        {key: 'actions', label: 'ექშენები'},
        {key: 'uniqueCode', label: 'ID'},
        {key: 'user', label: 'სახელი, გვარი'},
        {key: 'verified', label: 'ვერიფიცირებული'},
        {key: 'userType', label: 'მომხმარებლის ტიპი'},
        {key: 'identity', label: 'პირადი ნომერი'},
        {key: 'phone', label: 'ტელეფონის ნომერი'},
        {key: 'gender', label: 'სქესი'},
        {key: 'birthDate', label: 'დაბადების თარიღი'},
        {key: 'email', label: 'ელ ფოსტა'},
        {key: 'date', label: 'რეგისტრაციის თარიღი'},
        {key: 'workPhone', label: 'შიდა ნომერი'},
        {key: 'status', label: 'სტატუსი'},
        {key: 'region', label: 'რეგიონი'},
        {key: 'city', label: 'მუნიციპალიტეტი/ქალაქი'},
        {key: 'address', label: 'მისამართი'},
        {key: 'village', label: 'სოფელი'},
        {key: 'juridicalType', label: 'იურიდიული პირის ტიპი'},
        {key: 'identificationNumber', label: 'საიდენტიფიკაციო კოდი'},
        {key: 'commercialName', label: 'კომერციული სახელი'},
        {key: 'juridicalName', label: 'იურიდიული დასახელება'},
        {key: 'contactPerson', label: 'საკონტაქტო პირი'},
        {key: 'consul', label: 'პასუხისმგებელი კონსული'},
        {key: 'vehicleManufacturer', label: 'მწარმოებელი'},
        {key: 'vehicleModel', label: 'მოდელი'},
        {key: 'licensePlate', label: 'სერია და ნომერი'},
        {key: 'sticker', label: 'სტიკერი'},
        {key: 'enableCash', label: 'ბარათი/ქეში'},
        {key: 'published', label: 'გამოქვეყნებული'},
        {key: 'reset_password', label: 'პაროლის შეცვლა'},
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
    const dateFilterFrom = ref('')
    const dateFilterTo = ref('')
    const birthDateFilter = ref('')
    const juridicalTypeFilter = ref('')
    const publishedFilter = ref('')
    const paymentTypeFilter = ref('')
    const sortBy = ref('id')
    const isSortDirDesc = ref(true)
    const roleFilter = ref(null)
    const planFilter = ref(null)
    const statusFilter = ref(null)
    const stickersFilter = ref([])
    const roleQuery = ref(props.roleQuery)
    const userType = ref('')
    const activeFilter = ref('')
    const userTypeFilter = ref('')
    const consulFilter = ref('')

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

    const refetchData = () => {
        refUserListTable.value.refresh()
    }

    watch([currentPage, perPage, searchQuery, dateFilter, dateFilterFrom, dateFilterTo, juridicalTypeFilter,
        birthDateFilter, genderFilter, regionFilter, municipalityFilter, villageFilter, publishedFilter, paymentTypeFilter,
        userType, roleFilter, planFilter, statusFilter, stickersFilter, activeFilter, userTypeFilter, consulFilter], () => {
        if (publishedFilter.value == null) publishedFilter.value = "";
        if (paymentTypeFilter.value == null) paymentTypeFilter.value = "";
        if (regionFilter.value == null) regionFilter.value = "";
        if (municipalityFilter.value == null) municipalityFilter.value = "";
        if (villageFilter.value == null) villageFilter.value = "";
        if (juridicalTypeFilter.value == null) juridicalTypeFilter.value = "";
        if (genderFilter.value == null) genderFilter.value = "";
        if (userType.value == null) userType.value = "";
        if (roleFilter.value == null) roleFilter.value = "";
        if (statusFilter.value == null) statusFilter.value = "";
        if (activeFilter.value == null) activeFilter.value = "";
        if (consulFilter.value == null) consulFilter.value = "";
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
                regDateFrom: dateFilterFrom.value,
                regDateTo: dateFilterTo.value,
                birthDate: birthDateFilter.value,
                juridicalType: juridicalTypeFilter.value.value,
                stickerIds: stickersFilter.value,
                status: activeFilter.value.value,
                published: publishedFilter.value.value,
                cash: paymentTypeFilter.value.value,
                // perPage: perPage.value,
                // page: currentPage.value,
                role: roleQuery.value,
                userType: userType.value.value,
                consulId: consulFilter.value.id,
                take: perPage.value,
                skip: (currentPage.value - 1) * perPage.value,
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
        dateFilterFrom,
        dateFilterTo,
        birthDateFilter,
        juridicalTypeFilter,
        userType,
        sortBy,
        isSortDirDesc,
        refUserListTable,
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
        publishedFilter,
        paymentTypeFilter,
        stickersFilter,
        activeFilter,
        consulFilter,
    }
}
