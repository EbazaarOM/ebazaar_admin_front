<!-- eslint-disable  -->
<template>
	<div>
		<horizontal-navbar />
		<!-- container with filters -->
		<b-card no-body class="mb-0 products-list">
			<div class="m-2">
				<!-- Table Top -->
				<b-row class="d-flex">
					<!-- Per Page -->
					<b-col class="flex-wrap mb-1 d-flex align-items-end mb-md-0">
						<div>
							<label>{{ $t('global.onPage') }}</label>
							<v-select
								v-model="perPage"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="perPageOptions"
								:clearable="false"
								class="mr-2 per-page-selector"
							/>
						</div>
						<div>
							<label>{{ $t('global.priceFrom') }} </label>
							<b-form-input
								v-model="priceFromFilter"
								type="number"
								style="width: 120px;"
								class="mr-2"
							/>
						</div>
						<div>
							<label>{{ $t('global.priceTo') }} </label>
							<b-form-input
								v-model="priceToFilter"
								type="number"
								style="width: 120px;"
								class="mr-2"
							/>
						</div>
						<div class="mr-2">
							<label>{{ $t('global.search') }}</label>
							<b-form-input
								v-model="searchQuery"
								:placeholder="$t('orders.searchNameOrCode')"
								style="width: 230px;"
							/>
						</div>
						<div v-if="role === 'admin' || role === 'consul'" class="mt-1">
							<b-link :to="{ name: 'product-add' }">
								<b-button variant="primary">
									<span class="text-nowrap">{{ $t('products.addProduct') }}</span>
								</b-button>
							</b-link>
						</div>
					</b-col>
				</b-row>

				<!-- FILTER ROW -->
				<b-row class="mt-2">
					<!-- Filter by farmer -->
					<b-col v-if="role === 'admin'" cols="12" md="3" class="mb-md-0">
						<b-form-group>
							<label>{{ $t('roles.consul') }}</label>
							<v-select
								v-model="consulFilter"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="consulsList"
								class="w-100"
								label="consulName"
							>
								<template #option="{ firstName, lastName, uniqueCode }">
									<span>
										{{ firstName }} {{ lastName }} - {{ uniqueCode }}
									</span>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
					<b-col
						v-if="role === 'admin' || role === 'consul'"
						cols="12"
						md="3"
						class="mb-md-0"
					>
						<b-form-group>
							<label>{{ $t('roles.farmer') }}</label>
							<v-select
								v-model="farmerFilter"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="farmersList"
								class="w-100"
								label="farmerName"
							>
								<template #option="{ farmerName }">
									<span> {{ farmerName }} </span>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
					<b-col class="d-flex align-items-center w-100">
						<div class="mb-1 mr-2">
							<label>{{ $t('products.dateFrom') }}:</label>
							<b-form-datepicker
								v-model="dateFromFilter"
								:reset-button="true"
								:date-format-options="{
									year: 'numeric',
									month: 'numeric',
									day: 'numeric',
								}"
								:placeholder="$t('global.from')"
							/>
						</div>
						<div class="mb-1">
							<label>{{ $t('products.dateTo') }}:</label>
							<b-form-datepicker
								v-model="dateToFilter"
								:reset-button="true"
								:date-format-options="{
									month: 'numeric',
									day: 'numeric',
									year: 'numeric',
								}"
								:placeholder="$t('global.to')"
							/>
						</div>
					</b-col>
				</b-row>
				<b-row>
					<b-col v-if="role === 'admin'" cols="12" md="3" class="mb-md-0">
						<b-form-group>
							<label>{{ $t('category.category') }}</label>
							<v-select
								v-model="categoryFilter"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="categoryList"
								class="w-100"
								label="title"
							>
								<template #option="{ title }">
									<span>{{ title }}</span>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
					<b-col v-if="categoryFilter" cols="12" md="3" class="mb-md-0">
						<b-form-group>
							<label>{{ $t('category.subCategory') }}</label>
							<v-select
								v-model="subCategoryFilter"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="subcategoryList"
								class="w-100"
								label="title"
							>
								<template #option="{ title }">
									<span> {{ title }}</span>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
					<b-col
						v-if="subcategoryChildren.length"
						cols="12"
						md="3"
						class="mb-md-0"
					>
						<b-form-group>
							<label>{{ $t('category.productCategory') }}</label>
							<v-select
								v-model="subCategoryChildrenFilter"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="subcategoryChildren"
								class="w-100"
								label="title"
							>
								<template #option="{ title }">
									<span> {{ title }}</span>
								</template>
							</v-select>
						</b-form-group>
					</b-col>
					<b-col
						v-if="role === 'admin' || role === 'callCenterManager' || role === 'consul'"
						class="d-flex align-items-center justify-content-start mb-0 flex-wrap"
						style="margin-top: -16px !important;"
					>
					<!-- <div class="mt-1 mr-1 d-flex flex-column align-items-center"> -->
						<!-- <label class="mb-0">{{ $t('products.visible') }}</label> -->
						<!-- <b-form-checkbox v-model="visible" name="check-button" switch variant="secondary" class="mx-auto" /> -->
					<!-- </div> -->
						<b-button variant="success" @click="exportToExcel" class="mt-1">
              {{ $t('global.export') }}
						</b-button>
						<div class="mt-1 ml-1">
							<b-form-file
								v-model="importInput"
								:placeholder="$t('global.import')"
								:drop-placeholder="$t('uploadImage.uploadFileHere')"
								@change="insert_data"
							/>
						</div>
					</b-col>
				</b-row>
				<b-row class="px-1 mt-1">
					<b-form-group :label="$t('products.stickers')">
						<b-form-checkbox-group
							v-model="stickersFilter"
							:options="stickersList"
							value-field="id"
							text-field="title"
							switches
							class="p-1 mx-auto mb-1 overflow-x-visible border rounded justify-content-center align-items-center"
						/>
					</b-form-group>
				</b-row>
				<b-row class="px-1">
					<b-col
						class="flex-wrap p-1 mb-1 border rounded d-flex align-items-center"
					>
						<div
							class="mr-1 text-center d-flex justify-content-center align-items-center"
						>
							<b-form-checkbox
								v-model="publishedFilter"
								name="check-button"
								switch
							/>
							<p class="mb-0" style="width:100%; font-size:12px;">
                {{ $t('global.published') }}
							</p>
						</div>
						<div
							class="text-center d-flex justify-content-center align-items-center"
						>
							<b-form-checkbox
								v-model="onSaleFilter"
								name="check-button"
								switch
							/>
							<p class="mb-0" style="width:100%; font-size:12px;">{{ $t('products.onSale') }}</p>
						</div>
					</b-col>
				</b-row>
			</div>

			<b-table
				ref="refProductListTable"
				class="position-relative"
				:items="fetchProducts"
				responsive
				:fields="tableColumns1"
				primary-key="id"
				:sort-by.sync="sortBy"
				show-empty
				empty-text="No matching records found"
				:sort-desc.sync="isSortDirDesc"
			>
				<!-- Column: Title -->
				<template #cell(title)="data">
					<div class="text-nowrap">
						<b-link
							v-if="role === 'admin' || role === 'consul'"
							:to="{ name: 'product-edit', params: { id: data.item.id } }"
						>
							<span class="align-text-top text-capitalize">{{
								data.item.title
							}}</span>
						</b-link>
						<b-link
							v-else
							:to="{ name: 'product-view', params: { id: data.item.code } }"
						>
							<span class="align-text-top text-capitalize">{{
								data.item.title
							}}</span>
						</b-link>
					</div>
				</template>
				<template #cell(pieces)="data">
					<div v-if="data.item.unit" class="text-nowrap">
						{{ data.item.pieces }} {{ data.item.unit.title }}
					</div>
					<div v-else class="text-nowrap">
						{{ data.item.pieces }}
					</div>
				</template>
				<template #cell(stickers)="data">
					<div class="stickers-container">
						<img
							v-for="st in data.item.stickers"
							:key="st.id"
							:src="staticEnvValue + `/` + st.image"
							alt="st.title"
						/>
					</div>
				</template>
				<!-- Column: Date -->
				<template #cell(createDate)="data">
					<div class="text-nowrap">
						{{ new Date(data.item.createDate).getDate() }} /
						{{ new Date(data.item.createDate).getMonth() + 1 }} /
						{{ new Date(data.item.createDate).getFullYear() }}
					</div>
				</template>
				<!-- Column: Published -->
				<template #cell(published)="data">
					<div class="text-nowrap">
						<p v-if="data.item.published">
              {{ $t('global.published') }}
						</p>
						<p v-else>
              {{ $t('global.unpublished') }}
						</p>
					</div>
				</template>

				<!-- Column: subcategory -->
				<template #cell(category)="data">
					<div v-if="data.item.subCategory" class="text-nowrap">
						<span class="align-text-top text-capitalize">{{
							data.item.subCategory.title
						}}</span>
					</div>
				</template>
				<template #cell(unitSaleCost)="data">
					<span v-if="role != 'farmer'">{{ data.item.unitSaleCost.toFixed(2) }}₾</span>
					<span v-if="role === 'farmer'">{{ data.item.unitOriginalCost.toFixed(2) }}₾</span>
				</template>
				<!-- Column: Actions -->
				<template
					#cell(actions)="data"
					style="padding: 0 !important;"
				>
					<div v-if="role === 'admin' || role === 'consul'" class="d-flex align-items-center" >
						<b-button
							variant="flat-primary"
							class="btn-icon"
							:to="{ name: 'product-edit', params: { id: data.item.id } }"
						>
							<feather-icon size="16" icon="EditIcon" />
						</b-button>
						<b-button
							class="btn-icon"
							variant="flat-success"
							@click="copyConfirm(data.item)"
						>
							<feather-icon size="16" icon="CopyIcon" />
						</b-button>
							<b-button
							class="btn-icon"
							variant="flat-danger"
							@click="confirmText(data.item)"
						>
							<feather-icon size="16" icon="TrashIcon" />
						</b-button>
					</div>
					<div v-if="role === 'farmer'" class="d-flex align-items-center justify-content-center" >
						<b-button
							variant="flat-primary"
							class="btn-icon"
							:to="{ name: 'product-view', params: { id: data.item.code } }"
						>
							<feather-icon size="16" icon="EditIcon" />
						</b-button>
					</div>
				</template>
			</b-table>
			<div class="mx-2 mb-2">
				<b-row>
					<b-col
						cols="12"
						sm="6"
						class="d-flex align-items-center justify-content-center justify-content-sm-start"
					>
						<span v-if="true" class="text-muted">
							Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries
						</span>
					</b-col>
					<!-- Pagination -->
					<b-col
						cols="12"
						sm="6"
						class="d-flex align-items-center justify-content-center justify-content-sm-end pr-sm-4"
					>
						<b-pagination
							v-model="currentPage"
							:total-rows="totalProducts"
							:per-page="perPage"
							first-number
							last-number
							class="mt-1 mb-0 mt-sm-0"
							prev-class="prev-item"
							next-class="next-item"
						>
							<template #prev-text>
								<feather-icon icon="ChevronLeftIcon" size="18" />
							</template>
							<template #next-text>
								<feather-icon icon="ChevronRightIcon" size="18" />
							</template>
						</b-pagination>
					</b-col>
				</b-row>
			</div>
		</b-card>
	</div>
</template>

<script>
/* eslint-disable */
import {
	BCard,
	BRow,
	BCol,
	BFormInput,
	BButton,
	BTable,
	BLink,
	BPagination,
	BFormGroup,
	BFormCheckbox,
	BFormCheckboxGroup,
	BFormDatepicker,
	BFormFile,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import store from '@/store';
import { watch, onUnmounted } from '@vue/composition-api';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import productStoreModule from './productStoreModule';
import useProductsList from './useProductsList';
import HorizontalNavbar from '../../navbar/HorizontalNavbar.vue';

const FileSaver = require('file-saver');

export default {
	components: {
		HorizontalNavbar,
		BCard,
		BRow,
		BCol,
		BFormInput,
		BButton,
		BTable,
		BFormDatepicker,
		BLink,
		BPagination,
		vSelect,
		BFormCheckboxGroup,
		BFormCheckbox,
		BFormGroup,
		BFormFile
	},

	props: [
		'productsList',
	],

	mounted() {
		this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
		this.role = localStorage.getItem('role');
		const role = this.role;
		this.fetchCategories();
		this.fetchStickers();

		if(role === 'admin' || role === 'callCenterManager' || role === 'consul'){
			this.fetchFarmers();
		}
		if(role === 'admin' || role === 'callCenterManager'){
			this.fetchConsuls();
		}
		console.log('My role is ', this.role);
	},

	methods: {
		 insert_data(e) {
			this.importInput = [];
			this.upExcel = e.target.files[0];
      const formData = new FormData();
      formData.append('file', this.upExcel);
			store.dispatch('app-product/insert_data', formData)
				.then((responnse) => {
					this.refetchData();
				})
				.catch((e)=>{
					// alert(e)
					console.log(e);
				})
		},
		fetchFarmers(consulId = '') {
			console.log(consulId);
			store.dispatch('app-product/fetchFarmers', consulId).then((response) => {
				this.farmersList = [];
				let farmerName = '';
				console.log(response.data)
				response.data.forEach((el) => {
					farmerName = el.juridicalInfo ? `${el.juridicalInfo.commercialName} - ${el.uniqueCode}` : `${el.firstName} ${el.lastName} - ${el.uniqueCode}`;
					this.farmersList.push({
						farmerName: farmerName,
						id: el.id,
						address: el.address,
						responsiblePerson: el.responsiblePerson,
						responsiblePersonId: el.responsiblePersonId,
						uniqueCode: el.uniqueCode,
					});
				});
			});
		},
		fetchConsuls() {
			store.dispatch('app-product/fetchConsuls').then((response) => {
				this.consulsList = response.data;
			});
		},
		confirmText(product) {
			this.$swal({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!',
				customClass: {
					confirmButton: 'btn btn-primary',
					cancelButton: 'btn btn-outline-danger ml-1',
				},
				buttonsStyling: false,
			}).then((result) => {
				if (result.value) {
					this.deleteProduct(product);
				}
			});
		},
		deleteProduct(product) {
			store.dispatch('app-product/deleteProduct', product).then(() => {
				this.$swal({
					icon: 'success',
					title: 'Deleted!',
					text: 'Your product has been deleted.',
					customClass: {
						confirmButton: 'btn btn-success',
					},
				});
				this.refetchData();
			});
		},

		copyConfirm(product) {
			this.$swal({
				title: 'Do you want to copy this product?',
				text: "გსურს პროდუქტის კოპირება?",
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Yes, copy it!',
				customClass: {
					confirmButton: 'btn btn-primary',
					cancelButton: 'btn btn-outline-danger ml-1',
				},
				buttonsStyling: false,
			}).then((result) => {
				if (result.value) {
					this.copyProduct(product);
				}
			});
		},

		copyProduct(product) {
			const { id } = product;
			store.dispatch('app-product/fetchProduct', { id }).then((response) => {
				response.data.published = false;
				response.data.farmerId = "";
				response.data.consulId = "";
				store
						.dispatch('app-product/addProduct', response.data)
						.then(() => {
							this.refetchData();
							this.$toast({
								component: ToastificationContent,
								props: {
									title: 'პროდუქტი წარმატებით დაკოპირდა',
									icon: 'EditIcon',
									variant: 'success',
								},
							});
						})
						.catch((err) => {
							console.log('error copying product', err.response);
							alert('Error copying product. Checkk all the fields.');
						});
			});
		},
		exportToExcel() {
			const visible = this.visible;
			store.dispatch('app-product/exportToExcel', visible)
			.then((response) => {
				FileSaver.saveAs(response, 'prdocuts' + 's_list.xls');
			});
		},

		//
		fetchCategories() {
			store.dispatch('app-product/fetchCategories').then((response) => {
				this.categoryList = response.data;
				this.subcategoryChildren = [];
			});
		},
		fetchSubCategory(id) {
			store
				.dispatch('app-product/fetchSubCategory', { id })
				.then((response) => {
					this.subcategoryList = response.data;
					this.subCategoryFilter = '';
					this.subCategoryChildrenFilter = '';
					this.subcategoryChildren = [];
				});
		},
		fetchSubCategoryChildren(id) {
			store
				.dispatch('app-product/fetchSubCategoryChildren', { id })
				.then((response) => {
					this.subcategoryChildren = response.data;
				});
		},
		fetchStickers() {
			store.dispatch('app-product/fetchStickers').then((response) => {
				this.stickersList = response.data;
			});
		},
	},

	watch: {
		consulFilter(newVal){
			const consulId = newVal.id;
			this.fetchFarmers(consulId);
		},
		categoryFilter(newVal) {
			if (newVal) this.fetchSubCategory(newVal.id);
		},
		subCategoryFilter(newVal) {
			this.subCategoryChildrenFilter = '';
			this.subcategoryChildren = [];
			if (newVal && newVal.isParent) {
				this.fetchSubCategoryChildren(newVal.id);
			}
		},
		// farmersList() {
		// 	this.farmersList.forEach((e) => {
		// 		e.farmerName = `${e.firstName} ${e.lastName}`;
		// 	});
		// },
		consulsList() {
			this.consulsList.forEach((e) => {
				e.consulName = `${e.firstName} ${e.lastName}`;
			});
		},
	},

	data() {
		return {
			staticEnvValue: '',
			editSidebarFields: {},
			categoryList: [],
			subcategoryList: [],
			subcategoryChildren: [],
			stickersList: [],
			units: [],
			farmersList: [],
			consulsList: [],
			role: '',
			visible: false,
			upExcel: '',
			importInput: [],
      tableColumns1: [
        {
          key: 'actions',
          label: this.$i18n.t('global.actions'),
          tdClass: 'actionsColumn',
        },
        { key: 'code', label: this.$i18n.t('products.productId'), thStyle: { minWidth: '100px' } },
        { key: 'title', label: this.$i18n.t('global.title') },
        { key: 'stockCount', label: this.$i18n.t('products.inStock') },
        { key: 'pieces', label: this.$i18n.t('products.minUnit') },
        {
          key: 'unitSaleCost',
          label: this.$i18n.t('products.unitSaleCost'),
        },
        { key: 'subCategory.categoryTitle', label: this.$i18n.t('products.category') },
        {
          key: 'subCategory.parentSubCategoryTitle',
          label: this.$i18n.t('orders.subCategory'),
        },
        { key: 'subCategory.title', label: this.$i18n.t('orders.productCategory') },
        { key: 'farmer', label: this.$i18n.t('roles.farmer') },
        { key: 'consul', label: this.$i18n.t('roles.consul') },
        { key: 'village', label: this.$i18n.t('address.village') },
        { key: 'municipality', label: this.$i18n.t('address.municipality') },
        { key: 'region', label: this.$i18n.t('address.region') },
        { key: 'published', label: this.$i18n.t('global.published') },
        { key: 'stickers', label: this.$i18n.t('products.stickers'), formatter: 'assignStickers' },
        { key: 'createDate', label: this.$i18n.t('global.createDate') },
      ]
		};
	},

	setup(props) {
		const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

		// Register module
		if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule);

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME);
		});

		const {
			perPage,
			perPageOptions,
			currentPage,
			searchQuery,
			totalProducts,
			fetchProducts,
			refProductListTable,
			tableColumns,
			sortBy,
			isSortDirDesc,
			dataMeta,
			refetchData,
			product_id,
			farmerFilter,
			consulFilter,
			categoryFilter,
			prodList,
			subCategoryFilter,
			subCategoryChildrenFilter,
			onSaleFilter,
			publishedFilter,
			stickersFilter,
			dateFromFilter,
			dateToFilter,
			priceFromFilter,
			priceToFilter,
		} = useProductsList(props);

		return {
			//
			// from composable
			perPage,
			perPageOptions,
			currentPage,
			searchQuery,
			totalProducts,
			fetchProducts,
			refProductListTable,
			tableColumns,
			sortBy,
			isSortDirDesc,
			dataMeta,
			refetchData,
			prodList,
			product_id,
			farmerFilter,
			consulFilter,
			categoryFilter,
			subCategoryFilter,
			subCategoryChildrenFilter,
			onSaleFilter,
			publishedFilter,
			stickersFilter,
			dateFromFilter,
			dateToFilter,
			priceFromFilter,
			priceToFilter,
		};
	},
};
</script>

<style lang="scss" scoped>
.per-page-selector {
	width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

.stickers-container {
	display: flex;

	img {
		width: 30px;
		height: 30px;
		margin-right: 0.25rem;
	}
}

.custom-control-label {
	margin-bottom: 0.25rem !important;
}
.actionsColumn{
	padding: 0.125rem !important;
}
</style>
