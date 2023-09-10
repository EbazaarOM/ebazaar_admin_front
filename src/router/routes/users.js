export default [
    {
        path: '/accounts',
        name: 'accounts',
        component: () => import('@/views/apps/user/users-list/UsersList.vue'),
        meta: {
            resource: 'ACL',
            action: 'read',
        },
    },
]
