/* eslint-disable */
export default [
	{
		path: '/apps/calendar',
		name: 'apps-calendar',
		component: () => import('@/views/apps/calendar/Calendar.vue'),
	},

	// *===============================================---*
	// *--------- EMAIL & IT'S FILTERS N LABELS -------------------------------*
	// *===============================================---*
	{
		path: '/apps/email',
		name: 'apps-email',
		component: () => import('@/views/apps/email/Email.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'email-application',
		},
	},
	{
		path: '/apps/email/:folder',
		name: 'apps-email-folder',
		component: () => import('@/views/apps/email/Email.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'email-application',
			navActiveLink: 'apps-email',
		},
		beforeEnter(to, _, next) {
			if (
				['sent', 'draft', 'starred', 'spam', 'trash'].includes(to.params.folder)
			)
				next();
			else next({ name: 'error-404' });
		},
	},
	{
		path: '/apps/email/label/:label',
		name: 'apps-email-label',
		component: () => import('@/views/apps/email/Email.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'email-application',
			navActiveLink: 'apps-email',
		},
		beforeEnter(to, _, next) {
			if (
				['personal', 'company', 'important', 'private'].includes(
					to.params.label
				)
			)
				next();
			else next({ name: 'error-404' });
		},
	},

	// *===============================================---*
	// *--------- TODO & IT'S FILTERS N TAGS ---------------------------------------*
	// *===============================================---*
	{
		path: '/apps/todo',
		name: 'apps-todo',
		component: () => import('@/views/apps/todo/Todo.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'todo-application',
		},
	},
	{
		path: '/apps/todo/:filter',
		name: 'apps-todo-filter',
		component: () => import('@/views/apps/todo/Todo.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'todo-application',
			navActiveLink: 'apps-todo',
		},
		beforeEnter(to, _, next) {
			if (['important', 'completed', 'deleted'].includes(to.params.filter))
				next();
			else next({ name: 'error-404' });
		},
	},
	{
		path: '/apps/todo/tag/:tag',
		name: 'apps-todo-tag',
		component: () => import('@/views/apps/todo/Todo.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'todo-application',
			navActiveLink: 'apps-todo',
		},
		beforeEnter(to, _, next) {
			if (['team', 'low', 'medium', 'high', 'update'].includes(to.params.tag))
				next();
			else next({ name: 'error-404' });
		},
	},

	// *===============================================---*
	// *--------- CHAT  ---------------------------------------*
	// *===============================================---*
	{
		path: '/apps/chat',
		name: 'apps-chat',
		component: () => import('@/views/apps/chat/Chat.vue'),
		meta: {
			contentRenderer: 'sidebar-left',
			contentClass: 'chat-application',
		},
	},

	// *===============================================---*
	// *--------- ECOMMERCE  ---------------------------------------*
	// *===============================================---*
	{
		path: '/apps/e-commerce/shop',
		name: 'apps-e-commerce-shop',
		component: () =>
			import('@/views/apps/e-commerce/e-commerce-shop/ECommerceShop.vue'),
		meta: {
			contentRenderer: 'sidebar-left-detached',
			contentClass: 'ecommerce-application',
			pageTitle: 'Shop',
			breadcrumb: [
				{
					text: 'ECommerce',
				},
				{
					text: 'Shop',
					active: true,
				},
			],
		},
	},
	{
		path: '/apps/e-commerce/wishlist',
		name: 'apps-e-commerce-wishlist',
		component: () =>
			import(
				'@/views/apps/e-commerce/e-commerce-wishlist/ECommerceWishlist.vue'
			),
		meta: {
			pageTitle: 'Wishlist',
			contentClass: 'ecommerce-application',
			breadcrumb: [
				{
					text: 'ECommerce',
				},
				{
					text: 'Wishlist',
					active: true,
				},
			],
		},
	},
	{
		path: '/apps/e-commerce/checkout',
		name: 'apps-e-commerce-checkout',
		component: () =>
			import(
				'@/views/apps/e-commerce/e-commerce-checkout/ECommerceCheckout.vue'
			),
		meta: {
			pageTitle: 'Checkout',
			contentClass: 'ecommerce-application',
			breadcrumb: [
				{
					text: 'ECommerce',
				},
				{
					text: 'Checkout',
					active: true,
				},
			],
		},
	},
	{
		path: '/apps/e-commerce/:slug',
		name: 'apps-e-commerce-product-details',
		component: () =>
			import(
				'@/views/apps/e-commerce/e-commerce-product-details/ECommerceProductDetails.vue'
			),
		meta: {
			pageTitle: 'Product Details',
			contentClass: 'ecommerce-application',
			breadcrumb: [
				{
					text: 'ECommerce',
				},
				{
					text: 'Shop',
					active: true,
				},
				{
					text: 'Product Details',
					active: true,
				},
			],
		},
	},

	// *===============================================---*
	// *--------- USER ---- ---------------------------------------*
	// *===============================================---*
	{
		path: '/:lang/admins-list',
		name: 'admins-list',
		component: () => import('@/views/apps/user/AdminsList.vue'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/consuls-list',
		name: 'consuls-list',
		component: () => import('@/views/apps/user/ConsulsList.vue'),
		meta: {
			data: { roles: ['admin', 'consul'] },
		},
	},
	{
		path: '/:lang/farmers-list',
		name: 'farmers-list',
		component: () => import('@/views/apps/user/FarmersList.vue'),
		meta: {
			data: { roles: ['admin', 'farmer'] },
		},
	},
	{
		path: '/:lang/couriers-list',
		name: 'couriers-list',
		component: () => import('@/views/apps/user/CouriersList.vue'),
		meta: {
			data: { roles: ['admin', 'courier'] },
		},
	},
	{
		path: '/:lang/logistic-managers-list',
		name: 'logistic-managers-list',
		component: () => import('@/views/apps/user/LogisticManagersList.vue'),
		meta: {
			data: { roles: ['admin', 'logistics-manager'] },
		},
	},
	{
		path: '/:lang/call-center-managers-list',
		name: 'call-center-managers-list',
		component: () => import('@/views/apps/user/CallCenterManagersList.vue'),
		meta: {
			data: { roles: ['admin', 'call-center-manager'] },
		},
	},
	{
		path: '/:lang/users-list',
		name: 'users-list',
		component: () => import('@/views/apps/user/ClientsList.vue'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/profile/:id?',
		name: 'user-profile',
		component: () => import('@/views/apps/user/user-profile/UserProfile.vue'),
	},
	{
		path: '/:lang/profile/edit/:id',
		name: 'edit-user-profile',
		component: () =>
			import('@/views/apps/user/user-profile/EditUserProfile.vue'),
	},
	{
		path: '/apps/users/view/:id',
		name: 'apps-users-view',
		component: () => import('@/views/apps/user/users-view/UsersView.vue'),
	},
	{
		path: '/apps/users/edit/:id',
		name: 'apps-users-edit',
		component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
	},

	// Invoice
	{
		path: '/apps/invoice/list',
		name: 'apps-invoice-list',
		component: () =>
			import('@/views/apps/invoice/invoice-list/InvoiceList.vue'),
	},
	{
		path: '/apps/invoice/preview/:id',
		name: 'apps-invoice-preview',
		component: () =>
			import('@/views/apps/invoice/invoice-preview/InvoicePreview.vue'),
	},
	{
		path: '/apps/invoice/add/',
		name: 'apps-invoice-add',
		component: () => import('@/views/apps/invoice/invoice-add/InvoiceAdd.vue'),
	},
	{
		path: '/apps/invoice/edit/:id',
		name: 'apps-invoice-edit',
		component: () =>
			import('@/views/apps/invoice/invoice-edit/InvoiceEdit.vue'),
	},

	// *===============================================---*
	// *--------- stickers -------------------------------*
	// *===============================================---*
	{
		path: '/:lang/stickers',
		name: 'stickers',
		component: () => import('@/views/apps/products/Stickers.vue'),
	},

	// *===============================================---*
	// *--------- product --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/products-list',
		name: 'products-list',
		component: () => import('@/views/apps/products/ProductsList.vue'),
	},
	{
		path: '/:lang/product/:id',
		name: 'product-view',
		component: () =>
			import('@/views/apps/products/product-view/ProductView.vue'),
	},
	{
		path: '/:lang/product-add/',
		name: 'product-add',
		component: () => import('@/views/apps/products/productAdd.vue'),
		meta: {
			data: { roles: ['admin', 'consul'] },
		},
	},
	{
		path: '/:lang/product-edit/:id',
		name: 'product-edit',
		component: () => import('@/views/apps/products/productEdit.vue'),
		meta: {
			data: { roles: ['admin', 'consul'] },
		},
	},

	// *===============================================---*
	// *--------- category --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/category',
		name: 'categories',
		component: () => import('@/views/apps/category/Categories'),
	},

	// *===============================================---*
	// *--------- Orders --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/villages',
		name: 'villages',
		component: () => import('@/views/apps/address/Villages'),
	},

	// *===============================================---*
	// *--------- Reviews --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/reviews',
		name: 'reviews',
		component: () => import('@/views/pages/reviews/Reviews'),
	},

	// *===============================================---*
	// *--------- Villages --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/orders',
		name: 'orders',
		component: () => import('@/views/apps/orders/Orders'),
	},

	// *===============================================---*
	// *--------- Notifications --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/notifications',
		name: 'notifications',
		component: () => import('@/views/pages/notification/NotificationList'),
	},
	{
		path: '/:lang/notification/:id?',
		name: 'notification',
		component: () => import('@/views/pages/notification/AddNotification'),
	},

	// *===============================================---*
	// *--------- Content Pages --------------------------------*
	// *===============================================---*
	{
		path: '/:lang/main-page',
		name: 'main-page',
		component: () => import('@/views/pages/content-pages/MainPage'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/website-info',
		name: 'website-info',
		component: () => import('@/views/pages/content-pages/SharingInfo'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/faq',
		name: 'faq',
		component: () => import('@/views/pages/content-pages/FaqManagement'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/blogs',
		name: 'blogs',
		component: () => import('@/views/pages/content-pages/BlogList'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/blog/:id?',
		name: 'blog',
		component: () => import('@/views/pages/content-pages/components/Blog'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/about-us',
		name: 'about-us',
		component: () => import('@/views/pages/content-pages/AboutUs.vue'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/contact-us',
		name: 'contact-us',
		component: () => import('@/views/pages/content-pages/ContactUs.vue'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/career',
		name: 'career',
		component: () => import('@/views/pages/content-pages/Career'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/terms-and-conditions',
		name: 'terms-and-conditions',
		component: () => import('@/views/pages/content-pages/TermsAndConditions'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/template-pages',
		name: 'template-pages',
		component: () => import('@/views/pages/content-pages/TemplatePages'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/template-page/:id?',
		name: 'template-page',
		component: () =>
			import('@/views/pages/content-pages/components/TemplatePage'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	// *===============================================---*
	// *----------------- Statistics ---------------------*
	// *===============================================---*
	{
		path: '/:lang/statistics',
		name: 'statistics',
		component: () => import('@/views/apps/statistics/Statistics.vue'),
		meta: {
			data: { roles: ['admin', 'farmer', 'consul', 'callCenterManager'] },
		},
	},
	{
		path: '/:lang/promocodes',
		name: 'promocodes',
		component: () => import('@/views/apps/promocodes/PromoCodes.vue'),
		meta: {
			data: { roles: ['admin'] },
		},
	},
	{
		path: '/:lang/promocodes/:id',
		name: 'promocodes-view',
		component: () => import('@/views/apps/promocodes/PromoCodesEdit.vue'),
	},
];
