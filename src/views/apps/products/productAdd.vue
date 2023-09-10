<template>
	<div>
		<horizontal-navbar :arrow-visible="true" @go-back="goBack"/>
		<div class="card">
			<!-- Header -->
			<div class="px-2 py-1 d-flex justify-content-between align-items-center content-sidebar-header">
				<h5 class="mb-0">
          {{ $t('products.addProduct') }}
				</h5>
			</div>
			<!-- Body -->
			<validation-observer ref="simpleRules">
				<b-form class="flex-wrap p-2 row" @reset.prevent="resetForm">
					<!-- cat -->
					<div class="col-12 col-lg-6">
						<validation-provider #default="{ errors }" name="Main Category" rules="required">
							<b-form-group :label="$t('products.mainCategory')" label-for="category" :state="errors.length > 0 ? false : null">
								<v-select v-model="category" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="categoryList" label="title">
									<template #option="{ title }">
										<span>{{ title }}</span>
									</template>
								</v-select>
								<small class="text-danger">{{ errors[0] }}</small>
							</b-form-group>
						</validation-provider>
						<!-- subcat -->
						<validation-provider #default="{ errors }" name="Sub Category" rules="required">
							<b-form-group :label="$t('category.subCategory')" label-for="sub-category" :state="errors.length > 0 ? false : null">
								<v-select v-model="subCategory" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="subcategoryList" label="title">
									<template #option="{ title }">
										<span>{{ title }}</span>
									</template>
								</v-select>
								<small class="text-danger">{{ errors[0] }}</small>
							</b-form-group>
						</validation-provider>
						<!-- sub sub cat -->
						<b-form-group v-if="subcategoryChildren != 0" :label="$t('category.productCategory')" label-for="sub-sub-category">
							<v-select v-model="subSubCategory" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="subcategoryChildren" label="title">
								<template #option="{ title }">
									<span>{{ title }}</span>
								</template>
							</v-select>
						</b-form-group>
						<div v-if="specificationsList" class="d-flex">
							<div v-for="(specs, index) in specificationsList" :key="index" class="border rounded card custom-shadow" style="padding: 0.5rem; margin: 0.5rem;">
								<b-form-group :label="specs.title">
									<b-form-checkbox-group v-model="specifications" :options="specs.specs" text-field="title" stacked />
								</b-form-group>
							</div>
						</div>
						<!-- product title -->
						<validation-provider #default="{ errors }" name="Product Title" rules="required">
							<b-form-group :label="$t('products.productName') + '*'" label-for="title" :state="errors.length > 0 ? false : null">
								<b-tabs>
									<b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
										<b-form-input id="product-title_ka" v-model="title" trim :placeholder="$t('products.productName')" />
									</b-tab>
									<b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
										<b-form-input id="product-title_en" v-model="title_en" trim :placeholder="$t('products.productName')" />
									</b-tab>
								</b-tabs>
								<small class="text-danger">{{ errors[0] }}</small>
							</b-form-group>
						</validation-provider>
						<validation-provider #default="{ errors }" name="Farmer" rules="required">
							<b-form-group :label="$t('roles.farmer')" label-for="farmer" :state="errors.length > 0 ? false : null">
								<v-select v-model="farmer" :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'" :options="farmersList" label="name">
									<template #option="{ name }">
										<span>{{ name }}</span>
									</template>
								</v-select>
								<div v-if="farmer" class="">
									<p style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 0">
{{ $t('roles.farmer') }}: {{ farmer.responsiblePerson }} - {{ consulCode }}
</p>
									<p v-if="farmer" style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 0.25rem">
{{ farmerAddress.village }}, {{ farmerAddress.municipality }}. {{ farmerAddress.region }}
</p>
								</div>
								<small class="text-danger">{{ errors[0] }}</small>
							</b-form-group>
							<!-- subcat -->
						</validation-provider>
						<!-- mesurements -->
						<hr class="mx-auto my-2 w-75" style="height: 1px; background:#E2E2E2" >
						<div class="d-flex">
							<validation-provider #default="{ errors }" name="Units" rules="required" class="pl-0 pr-1 col-4">
									<b-form-group :label="$t('products.units')" label-for="measuring" :state="errors.length > 0 ? false : null">
									<b-form-select v-model="unitId" :options="units" label="title" value-field="id" text-field="title"/>
									<small class="text-danger">{{ errors[0] }}</small>
								</b-form-group>
							</validation-provider>

							<!-- Pieces -->
							<validation-provider :name="$t('products.minimalAmount')" class="pl-0 pr-1 col-4">
								<b-form-group :label="$t('products.minimalAmount')" label-for="pieces">
									<b-form-input id="unit" v-model="pieces" type="number" placeholder="0.0" value="0" />
								</b-form-group>
							</validation-provider>
							<validation-provider :name="$t('products.inStock')" class="px-0 col-4">
								<b-form-group :label="$t('products.inStock')" label-for="stockCount">
									<b-form-input id="stock" v-model="stockCount" type="number" placeholder="0.0" value="0" />
								</b-form-group>
							</validation-provider>
						</div>

						<!-- Pricing -->
						<div class="d-flex">
							<!-- farmer price -->
							<validation-provider :name="$t('products.farmerPrice')" class="pr-1 w-50">
								<b-form-group :label="$t('products.farmerPrice') + '*'" label-for="unitCost">
									<b-form-input id="unitCost" v-model="unitCost" type="number" placeholder="0.0" />
								</b-form-group>
							</validation-provider>

							<!-- markup -->
							<validation-provider :name="$t('products.markupPercentage')" class="w-50">
								<b-form-group :label="$t('products.markupPercentage')" label-for="markup">
									<b-form-input id="markup" v-model="markup" type="number" value="0" placeholder="0.0" />
								</b-form-group>
							</validation-provider>
						</div>

						<!-- more pricing -->

						<div class="row">
							<validation-provider :name="$t('products.ebazaarCommission')" class="pr-1 col-4">
								<b-form-group :label="$t('products.ebazaarCommission')" label-for="margin">
									<b-form-input id="margin" v-model="margin" type="text" placeholder="0.0" readonly />
								</b-form-group>
							</validation-provider>

							<!-- sale price -->
							<validation-provider :name="$t('products.sellingPrice')" class="pr-1 col-4">
								<b-form-group :label="$t('products.sellingPrice') + '*'" label-for="saleCost">
									<b-form-input id="saleCost" v-model="saleCost" type="text" placeholder="0.0" readonly />
								</b-form-group>
							</validation-provider>

							<!-- მოგება -->

							<validation-provider :name="$t('products.profit')" class="col-4">
								<b-form-group :label="$t('products.profit') + '*'" label-for="profit">
									<b-form-input id="profit" v-model="profit" type="text" placeholder="0.0" readonly />
								</b-form-group>
							</validation-provider>
						</div>
						<!-- SALE -->
						<hr class="mx-auto my-2 w-75" style="height: 1px; background:#E2E2E2" >
						<div class="d-flex align-items-center">
							<b-form-group class="mr-1 text-center border rounded" style="width: 160px; padding:0.5rem">
								<label>{{ $t('products.startDiscount') }}</label>
								<b-form-checkbox v-model="saleActive" name="check-button" switch />
							</b-form-group>
							<div class="d-flex align-items-center">
								<b-form-group class="mr-1" style="width: 160px">
									<label>{{ $t('products.discountStartDate') }}:</label>
									<datetime v-model="saleStartDate" type="datetime" :disabled="!saleActive" :placeholder="$t('global.start')" input-class="dateTime" />
								</b-form-group>
								<b-form-group class="" style="width: 160px">
									<label>{{ $t('products.discountEndDate') }}:</label>
									<datetime v-model="saleEndDate" type="datetime" :disabled="!saleActive" :placeholder="$t('global.end')" input-class="dateTime" />
								</b-form-group>
							</div>
						</div>
						<div class="mb-1 d-flex align-items-end">
							<!-- salePercentage -->
							<b-form-group :label="$t('products.discountPercentage')" label-for="salePercentage" class="mb-0 mr-1">
								<b-form-input id="salePercentage" v-model="salePercentage" type="number" placeholder="0.0" value="0" :disabled="!saleActive" />
							</b-form-group>

							<!-- Pieces -->
							<b-form-group :label="$t('products.discountPrice')" label-for="salePrice" class="flex mb-0 mr-1">
								<b-form-input id="salePrice" v-model="salePrice" type="number" placeholder="0.0" readonly />
							</b-form-group>
							<b-form-group :label="$t('products.discountPercentage')" label-for="saledPercentage" class="mb-0">
								<b-form-input id="saledPercentage" v-model="saledPercentage" type="text" placeholder="0.0" readonly />
							</b-form-group>
						</div>

						<hr class="mx-auto my-1 w-75" style="height: 1px; background:#E2E2E2" >
						<b-form-group class="text-center" :label="$t('products.displayingOptions')" label-for="options">
							<div class="flex-wrap mx-auto my-1 row d-flex">
								<div class="mb-1 text-center col-4">
									<label>{{ $t('products.premium') }}</label>
									<b-form-checkbox v-model="premium" name="check-button" switch />
								</div>
								<div class="mb-1 text-center col-4">
									<label>{{ $t('products.seasonal') }}</label>
									<b-form-checkbox v-model="hotSeasonal" name="check-button" switch />
								</div>
								<div class="mb-1 text-center col-4">
									<label>{{ $t('products.publishOnWebsite') }}</label>
									<b-form-checkbox v-model="published" name="check-button" switch />
								</div>
							</div>
						</b-form-group>
						<hr class="mx-auto my-1 w-75" style="height: 1px; background:#E2E2E2" >
						<b-form-group class="text-center" :label="$t('products.stickers')" label-for="stickers">
							<div class="flex-wrap mx-auto my-1 d-flex">
								<div v-for="item in stickersList" :key="item.title" class="py-1 mx-auto mb-1 border rounded d-flex justify-content-center align-items-center" style="width:45%">
									<label class="mb-0" style="width:100%">{{ item.title }}</label>
										<b-form-checkbox v-model="stickers[item.id]" :disabled="item.id == disabledStickerId" name="check-button" switch />
								</div>
							</div>
						</b-form-group>
						<hr class="mx-auto my-1 w-75" style="height: 1px; background:#E2E2E2" >
					</div>
					<!-- subcat -->
					<!-- second col -->
					<div class="col-12 col-lg-6">
						<ImageUpload :on-crop="addImage" :x="766" :y="474" />
						<div v-if="image.length" class="mt-3">
              {{ $t('products.uploadedPicturesSort') }}
						</div>
						<div v-if="image.length" class="mb-4 upload-images-container">
							<draggable v-model="image" ghost-class="ghost">
								<transition-group type="transition" name="flip-list">
									<div v-for="(img, index) in image" :key="img.name + index" class="image-wrapper">
										<p>#{{ index + 1 }}</p>
										<div class="">
											<img :src="staticEnvValue + `/` + img.name" >
										</div>
										<div class="">
											<b-button class="btn-icon" variant="flat-danger" @click="removeImage(img)">
												<feather-icon size="16" icon="TrashIcon" />
											</b-button>
										</div>
									</div>
								</transition-group>
							</draggable>
						</div>
						<b-form-group :label="$t('products.videoLink')" label-for="videolink">
							<b-form-input id="videolink" v-model="videoLink" trim placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
						</b-form-group>
						<hr class="mx-auto my-1 w-75" style="height: 1px; background:#E2E2E2" >
						<p class="mb-0">
							{{ $t('products.mainDescription') }}
						</p>
						<b-tabs>
								<b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
									<!-- Form: Description -->
									<TinyEditor v-if="description !== null" :editor="description" @update="updateDescriptionValue_ka" />
								</b-tab>
								<b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
									<!-- Form: Description -->
									<TinyEditor v-if="description_en !== null" :editor="description_en" @update="updateDescriptionValue_en" />
								</b-tab>
							</b-tabs>
							<hr
								class="mx-auto my-1 w-75"
								style="height: 1px; background:#E2E2E2"
							>
							<p class="mt-4 mb-0">{{ $t('products.productDetails') }}</p>
							<b-tabs>
								<b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
									<!-- Form: Description -->
									<TinyEditor v-if="additionalDescription !== null" :editor="additionalDescription" @update="updateAdditionalDescriptionValue_ka" />
								</b-tab>
								<b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
									<!-- Form: Description -->
									<TinyEditor v-if="additionalDescription_en !== null" :editor="additionalDescription_en" @update="updateAdditionalDescriptionValue_en" />
								</b-tab>
							</b-tabs>
					</div>
					<div class="mx-auto mt-2 d-flex">
						<b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2" type="submit" :disabled="isAddProductDisabled" @click.prevent="addProduct">
              {{ $t('global.add') }}
						</b-button>
						<b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="mr-2" type="submit" @click="$router.go(-1)">
              {{ $t('global.goBack') }}
						</b-button>
					</div>
				</b-form>
			</validation-observer>
		</div>
	</div>
</template>

<script>
// /* eslint-disable */

import { BForm, BFormGroup, BFormInput, BFormCheckboxGroup, BTabs, BTab, BButton, BFormCheckbox, BFormSelect } from 'bootstrap-vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required } from '@validations';
import formValidation from '@core/comp-functions/forms/form-validation';
// eslint-disable-next-line no-unused-vars
import { watch, ref, onUnmounted } from '@vue/composition-api';
import Ripple from 'vue-ripple-directive';
import draggable from 'vuedraggable';
import vSelect from 'vue-select';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { Datetime } from 'vue-datetime';
import store from '@/store';
import HorizontalNavbar from '@/views/navbar/HorizontalNavbar.vue';
import countries from '@/@fake-db/data/other/countries';
import productStoreModule from './productStoreModule';
import 'vue-datetime/dist/vue-datetime.css';
import ImageUpload from './components/ImageUpload.vue';
import router from "@/router";
import TinyEditor from './components/TinyEditor.vue';

export default {
	name: 'ProductAdd',
	components: {
		TinyEditor,
		BFormSelect,
		draggable,
		ImageUpload,
		Datetime,
		BTabs,
		BTab,
		BFormCheckboxGroup,
		BForm,
		BFormGroup,
		BFormInput,
		HorizontalNavbar,
		BButton,
		vSelect,
		BFormCheckbox,
		ValidationProvider,
		ValidationObserver,
	},
	directives: {
		Ripple,
	},

	data() {
		return {
			role: '',
			specificationsList: [],
			staticEnvValue: '',
			categoryList: [],
			subcategoryList: [],
			subcategoryChildren: [],
			units: [],
			stickersList: [],
			isAddProductDisabled: false,
			// extras
			profit: 0,
			farmersList: [],
			farmer: '',
			village: '',
			sticker: '',
			farmerAddress: '',
			villagesList: '',
			// category
			margin: '',
			description: '',
			description_en: '',
			additionalDescription: '',
			additionalDescription_en: '',
			category: '',
			subCategory: '',
			subSubCategory: '',
			title: '',
			title_en: '',
			disabledStickerId: 0,
			// rest
			required,
			consulId: '',
			consulCode: '',
			countries,
			published: false,
			hotSeasonal: false,
			premium: false,
			stockCount: '',
			unitCost: '',
			markup: '',
			unitId: '',
			pieces: '',
			//
			salePercentage: null,
			saleActive: false,
			saleStartDate: '',
			saleEndDate: '',
			salePrice: null,
			//
			saleCost: 0,
			saledPercentage: '',
			//
			location: {
				villageId: null,
				municipalityId: null,
				regionId: null,
			},
			videoLink: '',
			subCategoryId: 0,
			farmerId: '',
			stickers: {},
			specifications: [],
			image: [],
			translations: [
				{
					title: '',
					languageCode: 'ka',
					description: '',
					additionalDescription: '',
				},
				{
					title: '',
					languageCode: 'en',
					description: '',
					additionalDescription: '',
				},
			],

			editorOption: {
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'], // bold, italic, underline, strikethrough
						[{ list: 'ordered' }, { list: 'bullet' }], // ordered list, unordered list
						[{ header: [4, 5, 6, false] }],
						[{ color: [] }, { background: [] }],
						[{ align: [] }],
						['clean'],
						['link', 'image', 'video'],
					],
				},
			},
		};
	},

	// watchers
	watch: {
		markup() {
			if (this.unitCost > 0 && this.markup > 0) {
				const price = this.unitCost;

				// this.saleCost = `${this.unitCost * (1 + this.markup / 100).toFixed(2)}₾`;
				this.saleCost = `${(Math.round((this.unitCost * (1 + this.markup / 100)) * 100) / 100)}₾`;
				this.profit = `${(parseFloat(this.saleCost) - price).toFixed(2)}₾`;
				this.margin = `${((100 * parseFloat(this.profit)) / parseFloat(this.saleCost)).toFixed(2)}%`;
				if (this.saleActive === true) {
					this.checkSaleLogic(this.salePercentage);
				}
			}
		},
		unitCost() {
			if (this.unitCost > 0 && this.markup > 0) {
				const price = this.unitCost;

				// this.saleCost = `${this.unitCost * (1 + this.markup / 100).toFixed(2)}₾`;
				this.saleCost = `${(Math.round((this.unitCost * (1 + this.markup / 100)) * 100) / 100)}₾`;
				this.profit = `${(parseFloat(this.saleCost) - price).toFixed(2)}₾`;
				this.margin = `${((100 * parseFloat(this.profit)) / parseFloat(this.saleCost)).toFixed(2)}%`;
			}
			if (this.saleActive === true) {
				this.checkSaleLogic(this.salePercentage);
			}
		},
		// SALES
		salePercentage(val) {
			this.checkSaleLogic(val);
		},
		saleActive(val) {
			if (val === true && (this.unitCost <= 0 || this.markup <= 0)) {
				this.$swal({
					icon: 'error',
					title: 'შეცდომა!',
					text: 'გთხოვთ ჯერ მიუთითოთ პროდუქტის ფასი და მარკაპი.',
					customClass: {
						confirmButton: 'btn btn-success',
					},
				}).then(() => {
					this.saleActive = false;
				});
			}
		},
		//
		farmer(newVal) {
			this.getFarmerAddressAndCouncil(newVal);
			this.farmerId = newVal.id;
			this.consulId = newVal.responsiblePersonId;
			this.farmerAddress = newVal.address;
		},

		category(newVal) {
			this.fetchSubCategory(newVal.id);
			this.subCategory = [];
		},

		subCategory(newVal) {
			if (newVal.id > 0) {
				this.fetchSubCategoryChildren(newVal.id);
				this.subSubCategory = [];
				this.subCategoryId = newVal.id;
				//
				// etting specifications here
				//
				this.specificationsList = [];
				this.specifications = [];
				//
				if (newVal.specificationCategories.length) {
					const specCats = newVal.specificationCategories;
					specCats.forEach((e) => {
						e.specifications.forEach((k) => {
							// eslint-disable-next-line no-param-reassign
							k.value = {
								[k.id]: true,
							};
						});
						this.specificationsList.push({
							title: e.title,
							specs: e.specifications,
						});
					});
				} else {
					this.specificationsList = '';
				}
			}
		},

		subSubCategory() {
			if (this.subSubCategory.id) {
				this.subCategoryId = this.subSubCategory.id;
				//
				// getting specifications here
				//
				this.specificationsList = [];
				this.specifications = [];
				//
				if (this.subSubCategory.specificationCategories.length) {
					const specCats = this.subSubCategory.specificationCategories;
					specCats.forEach((e) => {
						e.specifications.forEach((k) => {
							// eslint-disable-next-line no-param-reassign
							k.value = {
								[k.id]: true,
							};
						});
						this.specificationsList.push({
							title: e.title,
							specs: e.specifications,
						});
					});
				} else {
					this.specificationsList = '';
				}
			}
		},
	},
	mounted() {
		this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
		this.disabledStickerId = process.env.VUE_APP_DISABLED_STICKER_ID;
		this.stickers[this.disabledStickerId] = true;
		this.fetchFarmers();
		this.fetchCategories();
		this.fetchUnits();
		this.fetchStickers();
		this.role = localStorage.getItem('role');
	},

	methods: {
		checkSaleLogic(salePercentage) {
			if (this.unitCost > 0 && this.markup > 0) {
				this.salePrice = ((this.unitCost * (1 + this.markup / 100)) * (1 - salePercentage / 100)).toFixed(2);
				this.saledPercentage = `${(((this.salePrice - this.unitCost) / this.salePrice) * 100).toFixed(2)}%`;
			}

			if (this.unitCost * 0.025 < 0.11 && this.salePrice < (parseFloat(this.unitCost) + 0.11)) {
				this.saleError();
			}

			if (this.salePrice < (this.unitCost * 1.025)) {
				this.saleError();
			}
		},
		saleError() {
			this.$swal({
				icon: 'error',
				title: 'შეცდომა!',
				text: 'სეილის ფასი არ შეიძლება იყოს პროდუქტის ფასს + 2.5% ზე ნაკლები',
				customClass: {
					confirmButton: 'btn btn-success',
				},
			}).then(() => {
				this.salePercentage = null;
				this.salePrice = null;
				this.saledPercentage = '';
			});
		},
		getFarmerAddressAndCouncil(newVal) {
			store.dispatch('app-product/fetchAddressAndCouncil', newVal.id).then((response) => {
				this.location = {
					villageId: response.address.villageId,
					municipalityId: response.address.municipalityId,
					regionId: response.address.regionId,
				};
				this.consulCode = response.responsibleUserCode;
			});
		},
		fetchFarmers() {
			store.dispatch('app-product/fetchFarmers', '').then((response) => {
				let farmerName = '';
				response.data.forEach((el) => {
					farmerName = el.juridicalInfo ? `${el.juridicalInfo.commercialName} - ${el.uniqueCode}` : `${el.firstName} ${el.lastName} - ${el.uniqueCode}`;
					this.farmersList.push({
						name: farmerName,
						id: el.id,
						address: el.address,
						responsiblePerson: el.responsiblePerson,
						responsiblePersonId: el.responsiblePersonId,
						uniqueCode: el.uniqueCode,
					});
				});
			});
		},
		addProduct() {
			this.$refs.simpleRules.validate().then((success) => {
				if (success) {
					// disable button for 3 sec
					this.isAddProductDisabled = true;

					setTimeout(() => {
						this.isAddProductDisabled = false;
					}, 3000);
					// proceed
					const self = this;
					const payload = {
						published: self.published,
						hotSeasonal: self.hotSeasonal,
						premium: self.premium,
						unitCost: this.unitCost ? parseFloat(self.unitCost) : 0,
						markup: this.markup ? parseFloat(self.markup) : 0,
						pieces: this.pieces ? parseFloat(self.pieces) : 0,
						stockCount: this.stockCount ? parseFloat(self.stockCount) : 0,
						// sales
						saleActive: self.saleActive,
						salePercentage: this.saleActive ? parseFloat(self.salePercentage) : 0,
						saleStartDate: this.saleActive ? self.saleStartDate : '',
						saleEndDate: this.saleActive ? self.saleEndDate : '',
						salePrice: this.saleActive ? parseFloat(self.salePrice) : 0,
						//
						videoLink: self.videoLink,
						subCategoryId: self.subCategoryId,
						unitId: this.unitId,
						farmerId: self.farmerId,
						stickers: self.stickers,
						consulId: self.consulId,
						location: self.location,
						specifications: Object.assign({}, ...self.specifications),
						images: self.image,
						translations: [
							{
								title: self.title,
								description: self.description,
								additionalDescription: self.additionalDescription,
								languageCode: 'ka',
							},
							{
								title: self.title_en,
								description: self.description_en,
								additionalDescription: self.additionalDescription_en,
								languageCode: 'en',
							},
						],
					};
					console.log(payload);

					store
						.dispatch('app-product/addProduct', payload)
						.then(() => {
							this.$router.push({ name: 'products-list' }, () => {
								this.toast();
							});
						})
						.catch((err) => {
							console.log('error adding product', err.response);
							alert('Error adding product. Checkk all the fields.');
						});
				}
			});
		},

		toast() {
			this.$toast({
				component: ToastificationContent,
				props: {
					title: `პროდუქტი წარმატებით დაემატა`,
					icon: 'Success',
					variant: 'success',
				},
			});
		},
		addImage(item) {
			this.image.push({
				enabled: true,
				enableShare: true,
				name: item,
			});
		},
		removeImage(img) {
			const index = this.image.indexOf(img);
			this.image.splice(index, 1);
		},
		fetchCategories() {
			store.dispatch('app-product/fetchCategories').then((response) => {
				this.categoryList = response.data;
				this.subcategoryChildren = [];
			});
		},
		fetchSubCategory(id) {
			store.dispatch('app-product/fetchSubCategory', { id }).then((response) => {
				this.subcategoryList = response.data;
				this.subcategoryChildren = [];
			});
		},
		fetchSubCategoryChildren(id) {
			store.dispatch('app-product/fetchSubCategoryChildren', { id }).then((response) => {
				if (response.data) {
					this.subcategoryChildren = response.data;
				} else {
					this.subcategoryChildren = [];
				}
			});
		},
		fetchUnits(id) {
			store.dispatch('app-product/fetchUnits', id).then((response) => {
				this.units = response.data;
			});
		},
		fetchStickers() {
			store.dispatch('app-product/fetchStickers').then((response) => {
				this.stickersList = response.data;
			});
		},

    goBack() {
      router.push({ name: 'products-list' })
    },
		updateDescriptionValue_ka(description) {
      this.description = description
    },
    updateDescriptionValue_en(description) {
      this.description_en = description
    },
		updateAdditionalDescriptionValue_ka(description) {
      this.additionalDescription = description
    },
    updateAdditionalDescriptionValue_en(description) {
      this.additionalDescription_en = description
    },
	},

	setup() {
		const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

		// Register module
		if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule);

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME);
		});

		const blankProductData = {
			escription: '',
			additionalDescription: '',
			saleStartDate: '',
			saleEndDate: '',
			published: false,
			margin: 0,
			hotSeasonal: false,
			premium: false,
			saleActive: false,
			stockCount: 0,
			unitCost: 0,
			markup: 0,
			salePercentage: null,
			unitId: 0,
			pieces: 0,
			regionId: 0,
			consulId: 0,
			location: {
				villageId: 0,
				municipalityId: 0,
				regionId: 0,
			},
			videoLink: '',
			subCategoryId: 0,
			farmerId: '',
			stickers: {},
			specifications: [],
			image: [],
			translations: [
				{
					title: '',
					languageCode: 'ka',
					description: '',
					additionalDescription: '',
				},
			],
		};

		const productData = ref(JSON.parse(JSON.stringify(blankProductData)));
		const resetProductData = () => {
			productData.value = JSON.parse(JSON.stringify(blankProductData));
		};
		const {
			refFormObserver,
			// getValidationState,
			resetForm,
		} = formValidation(resetProductData);

		return {
			productData,
			// onSubmit,
			refFormObserver,
			// getValidationState,
			resetForm,
		};
	},
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

.upload-images-container {
	.image-wrapper {
		width: 250px;
		display: flex;
		justify-content: space-between;

		align-items: center;
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		border-radius: 0.375rem;
		box-shadow: 1px 1px 3px rgba($color: #000000, $alpha: 0.25);
		cursor: grab;
	}
	p {
		margin-bottom: 0.2rem;
		text-align: center;
	}
}
.upload-images-container img {
	width: 100px;
	margin: 0 1rem;
	height: auto;
	max-height: 100px;
	border-radius: 0.375rem;
	box-shadow: 1px 1px 1px rgba($color: #000000, $alpha: 0.15);
}
.upload-images-container {
	.sortable-drag {
		opacity: 0;
	}
	.flip-list-move {
		transition: transform 0.5s ease;
	}

	.ghost {
		border-left: 6px solid #776bf1;
	}
}

.dateTime {
	padding: 0.5rem;
	border-radius: 0.357rem;
	width: 100%;
	border: 1px solid #d8d6de;
	height: 2.714rem;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.45;
	color: #6e6b7b;
}

.dateTime:disabled {
	background-color: #efefef;
}
</style>
