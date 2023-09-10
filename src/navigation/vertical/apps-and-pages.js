/* eslint-disable */
import i18n from '@/main.js';

export default [
	{
		header: 'Apps & Pages',
	},

	{
		title: i18n.t('navigation.roles'),
		icon: 'UserIcon',
		tag: '7',
		tagVariant: 'light-success',
		meta: {
			data: { roles: ['admin', 'callCenterManager'] },
		},
		disabled: !['admin', 'callCenterManager'].includes(
			localStorage.getItem('role')
		),
		children: [
			{
				title: i18n.t('navigation.admins'),
				icon: 'UserIcon',
				// route: "admins-list",
				route: { name: 'admins-list' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},

			{
				title: i18n.t('navigation.consuls'),
				icon: 'UserIcon',
				// route: "consuls-list",
				route: { name: 'consuls-list' },
				disabled: !['admin', 'callCenterManager'].includes(
					localStorage.getItem('role')
				),
			},

			{
				title: i18n.t('navigation.farmers'),
				icon: 'UserIcon',
				// route: "farmers-list",
				route: { name: 'farmers-list' },
				disabled: !['admin', 'consul', 'callCenterManager'].includes(
					localStorage.getItem('role')
				),
			},

			{
				title: i18n.t('navigation.couriers'),
				icon: 'TruckIcon',
				// route: 'couriers-list',
				route: { name: 'couriers-list' },
				disabled: !['admin', 'logisticsManager', 'callCenterManager'].includes(
					localStorage.getItem('role')
				),
			},

			{
				title: i18n.t('navigation.logisticsManager'),
				icon: 'BoxIcon',
				// route: "logistic-managers-list",
				route: { name: 'logistic-managers-list' },
				disabled: !['admin', 'callCenterManager'].includes(
					localStorage.getItem('role')
				),
			},

			{
				title: i18n.t('navigation.callCenterManager'),
				icon: 'PhoneIcon',
				// route: 'call-center-managers-list',
				route: { name: 'call-center-managers-list' },
				disabled: !['admin', 'callCenterManager'].includes(
					localStorage.getItem('role')
				),
			},

			{
				title: i18n.t('navigation.customers'),
				icon: 'UserIcon',
				// route: 'clients-list',
				route: { name: 'users-list' },
				disabled: !['admin', 'callCenterManager'].includes(
					localStorage.getItem('role')
				),
			},
		],
	},

	{
		title: i18n.t('navigation.farmers'),
		icon: 'UserIcon',
		// route: "farmers-list",
		route: { name: 'farmers-list' },
		disabled: !['consul'].includes(localStorage.getItem('role')),
	},

	{
		title: i18n.t('navigation.couriers'),
		icon: 'TruckIcon',
		// route: 'couriers-list',
		route: { name: 'couriers-list' },
		disabled: !['logisticsManager'].includes(localStorage.getItem('role')),
	},

	{
		title: i18n.t('navigation.products'),
		icon: 'PackageIcon',
		// route: "products-list",
		route: { name: 'products-list' },
		disabled: ![
			'admin',
			'logistic-manager',
			'callCenterManager',
			'consul',
			'farmer',
		].includes(localStorage.getItem('role')),
	},
	{
		title: i18n.t('navigation.stickers'),
		icon: 'LayersIcon',
		route: { name: 'stickers' },
		disabled: !['admin'].includes(localStorage.getItem('role')),
	},
	{
		title: i18n.t('navigation.categories'),
		icon: 'FilterIcon',
		// route: "category",
		route: { name: 'categories' },
		disabled: !['admin'].includes(localStorage.getItem('role')),
	},

	{
		title: i18n.t('navigation.villages'),
		icon: 'FilterIcon',
		// route: "villages",
		route: { name: 'villages' },
		disabled: !['admin', 'consul'].includes(localStorage.getItem('role')),
	},
	{
		title: i18n.t('navigation.orders'),
		icon: 'FileTextIcon',
		route: { name: 'orders' },
	},
	{
		title: i18n.t('navigation.reviews'),
		icon: 'StarIcon',
		route: { name: 'reviews' },
		disabled: ![
			'admin',
			'consul',
			'consul',
			'farmer',
			'callCenterManager',
		].includes(localStorage.getItem('role')),
	},
	{
		title: i18n.t('navigation.notifications'),
		icon: 'BellIcon',
		route: { name: 'notifications' },
		disabled: !['admin'].includes(localStorage.getItem('role')),
	},

	{
		title: i18n.t('navigation.content'),
		icon: 'PieChartIcon',
		tag: '7',
		tagVariant: 'light-danger',
		meta: {
			data: { roles: ['admin'] },
		},
		disabled: !['admin'].includes(localStorage.getItem('role')),
		children: [
			{
				title: i18n.t('navigation.mainPage'),
				// route: 'main-page',
				route: { name: 'main-page' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.websiteInfo'),
				// route: 'main-page',
				route: { name: 'website-info' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.blogs'),
				route: { name: 'blogs' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.faq'),
				route: { name: 'faq' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.aboutUs'),
				route: { name: 'about-us' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.contact'),
				route: { name: 'contact-us' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.career'),
				route: { name: 'career' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.termsAndConditions'),
				route: { name: 'terms-and-conditions' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
			{
				title: i18n.t('navigation.templatePages'),
				route: { name: 'template-pages' },
				meta: {
					data: { roles: ['admin'] },
				},
				disabled: !['admin'].includes(localStorage.getItem('role')),
			},
		],
	},
	{
		title: i18n.t('navigation.statistics'),
		icon: 'ClipboardIcon',
		route: { name: 'statistics' },
		disabled: !['admin', 'farmer', 'consul', 'callCenterManager'].includes(
			localStorage.getItem('role')
		),
	},
	{
		title: i18n.t('navigation.promoCodes'),
		icon: 'DivideIcon',
		route: { name: 'promocodes' },
		disabled: !['admin'].includes(localStorage.getItem('role')),
	},
];
