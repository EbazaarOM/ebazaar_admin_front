<!-- eslint-disable no-tabs vue/html-this-closing  vue/no-template-shadow  -->
<template>
	<div>
		<horizontal-navbar :arrow-visible="true" @go-back="goBack" />
		<b-card>
			<!-- {{originalDescription}}
			{{originalDescription_en}}
			{{originalAdditionalDescription}}
			{{originalAdditionalDescription_en}} -->
			<div class="card">
				<!-- Header -->
				<div
					class="px-2 py-1 d-flex justify-content-between align-items-center content-sidebar-header"
				>
					<h5 class="mb-0">
            {{ $t('products.editProduct') }}
					</h5>
					<div class="">
						<label>{{ $t('statistics.productCode') }}: {{ code }} </label> <br>
						<label v-if="views">{{ $t('statistics.views') }}: {{ views }} </label>
					</div>
				</div>
				<!-- Body -->
				<validation-observer v-slot="{ errors }" ref="refFormObserver">
					<b-form class="flex-wrap p-2 row" @reset.prevent="resetForm">
						<div class="col-12 col-lg-6">
							<!-- cat -->
							<div>
								<label>{{ $t('products.category') }}:</label>
								<div class="d-flex justify-content-between">
									<p class="block mb-0">
										{{ subCategoryName }}
									</p>
									<a
										class="block mb-0"
										style="color:#7367f0; text-decoration:underline"
										@click="showCategoryContainer = !showCategoryContainer"
									>
                    {{ $t('products.changeCategory') }}
									</a>
								</div>
							</div>
							<div
								v-if="showCategoryContainer"
								id="categoryContainer"
								class="p-1 my-2 rounded-sm shadow-sm bg-light"
							>
								<validation-provider name="Main Category" rules="required">
									<b-form-group :label="$t('products.mainCategory')" label-for="category">
										<v-select
											v-model="category"
											:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
											:options="categoryList"
											label="title"
										>
											<template #option="{ title }">
												<span>{{ title }}</span>
											</template>
										</v-select>
									</b-form-group>
									<!-- subcat -->
								</validation-provider>
								<validation-provider name="Sub Category" rules="required">
									<b-form-group :label="$t('orders.subCategory')" label-for="sub-category">
										<v-select
											v-model="subCategory"
											:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
											:options="subcategoryList"
											label="title"
										>
											<template #option="{ title }">
												<span>{{ title }}</span>
											</template>
										</v-select>
									</b-form-group>
								</validation-provider>
								<!-- sub sub cat -->
								<validation-provider
									v-if="subcategoryChildren != 0"
									:name="$t('orders.productCategory')"
								>
									<b-form-group
										:label="$t('orders.productCategory')"
										label-for="sub-sub-category"
									>
										<v-select
											v-model="subSubCategory"
											:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
											:options="subcategoryChildren"
											label="title"
										>
											<template #option="{ title }">
												<span>{{ title }}</span>
											</template>
										</v-select>
									</b-form-group>
								</validation-provider>
							</div>
							<hr
								class="mx-auto my-2 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<div v-if="specificationsList" class="flex-wrap d-flex">
								<div
									v-for="(specs, index) in specificationsList"
									:key="index"
									class="border rounded shadow-sm"
									style="padding: 0.5rem; margin: 0 0.25rem;"
								>
									<b-form-group v-if="specs.specs.length" :label="specs.title">
										<b-form-checkbox-group
											v-model="specifications"
											:options="specs.specs"
											text-field="title"
											stacked
										/>
									</b-form-group>
								</div>
							</div>
							<hr
								class="mx-auto my-2 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<!-- farmer -->
							<b-form-group :label="$t('roles.farmer')" label-for="farmer">
								<v-select
									v-model="farmer"
									:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
									:options="farmersList"
									label="name"
								>
									<template #option="{ name }">
										<span>{{ name }}</span>
									</template>
								</v-select>
								<div v-if="farmer" class="">
									<p style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 0">
                    {{ $t('roles.consul') }}: {{ farmer.responsiblePerson }} {{ consulCode }}
									</p>
								</div>
							</b-form-group>
							<!-- end farmer -->
							<hr
								class="mx-auto my-2 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<!-- product title -->
							<validation-provider
								v-slot="{ valid, dirty }"
								:name="$t('global.title')"
								rules="required"
							>
								<b-form-group :label="$t('orders.productTitle') + '*'" label-for="title">
									<b-tabs>
										<b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
											<b-form-input
												id="product-title_ka"
												v-model="title"
												:state="
													dirty
														? errors[0]
															? false
															: valid
															? true
															: null
														: null
												"
												trim
												:placeholder="$t('orders.productTitle')"
											/>
										</b-tab>
										<b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
											<b-form-input
												id="product-title-en"
												v-model="title_en"
												:state="
													dirty
														? errors[0]
															? false
															: valid
															? true
															: null
														: null
												"
												trim
												:placeholder="$t('orders.productTitle')"
											/>
										</b-tab>
									</b-tabs>
								</b-form-group>
							</validation-provider>
							<hr
								class="mx-auto my-2 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<!-- mesurements -->
							<hr
								class="mx-auto my-2 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<div class="d-flex align-items-end">
								<validation-provider #default="{ errors }" name="Units" rules="required" class="pl-0 pr-1 col-4">
										<b-form-group :label="$t('products.unit')" label-for="measuring" :state="errors.length > 0 ? false : null">
										<b-form-select v-model="unitId" :options="units" label="title" value-field="id" text-field="title"/>
										<small class="text-danger">{{ errors[0] }}</small>
									</b-form-group>
								</validation-provider>

								<!-- Pieces -->
								<validation-provider name="მინიმალური რაოდენობა" class="pl-0 pr-1 col-4">
									<b-form-group :label="$t('products.minimalAmount')" label-for="pieces">
										<b-form-input id="minAmount" v-model="pieces" type="number" placeholder="0.0" value="0" />
									</b-form-group>
								</validation-provider>
								<validation-provider
									:name="$t('products.inStock')"
									class="px-0 col-4"
								>
									<div class="d-flex align-items-center" >
										<p style="font-size:0.75rem" class="m-0 mr-1">
                      {{ $t('statistics.reservedProduct') }}: {{ reserved.toFixed(2) }}
										</p>
										<b-button
											v-if="role === 'admin' || role === 'callCenterManager'"
											size="sm"
											variant="primary"
											style="padding: 0.5rem"
											@click.prevent="synchronize(code)"
										>
											<feather-icon size="10" icon="RefreshCwIcon" />
										</b-button>
									</div>
									<b-form-group :label="$t('products.inStock')" label-for="stockCount">
										<b-form-input
											id="product-title"
											v-model="stockCount"
											type="number"
											placeholder="0.0"
											value="0"
											@blur="stockCountHandler()"
										/>
									</b-form-group>
								</validation-provider>
							</div>

							<!-- Pricing -->
							<div class="d-flex">
								<!-- farmer price -->
								<validation-provider
									:name="$t('products.farmerPrice')"
									class="pr-1 w-50"
								>
									<b-form-group :label="$t('products.farmerPrice') + '*'" label-for="unitCost">
										<b-form-input
											id="unitCost"
											v-model="unitCost"
											type="number"
											placeholder="0.0"
											value="0"
										/>
									</b-form-group>
								</validation-provider>

								<!-- markup -->
								<validation-provider
									:name="$t('products.markupPercentage')"
									class="w-50"
								>
									<b-form-group :label="$t('products.markupPercentage') + '*'" label-for="markup">
										<b-form-input
											id="markup"
											v-model="markup"
											type="number"
											placeholder="0.0"
											value="0"
											@blur="handleBlur"
										/>
									</b-form-group>
								</validation-provider>
							</div>

							<!-- more pricing -->

							<div class="row align-items-end">
								<validation-provider
									v-slot="{ valid, dirty }"
									:name="$t('products.ebazaarCommission')"
									rules="required"
									class="pr-1 col-4"
								>
									<b-form-group :label="$t('products.ebazaarCommission')" label-for="margin">
										<b-form-input
											id="margin"
											v-model="margin"
											:state="
												dirty ? (errors[0] ? false : valid ? true : null) : null
											"
											type="text"
											placeholder="0.0"
											readonly
										/>
									</b-form-group>
								</validation-provider>

								<!-- sale price -->
								<validation-provider
									:name="$t('products.sellingPrice')"
									rules="required"
									class="pr-1 col-4"
								>
									<b-form-group :label="$t('products.sellingPrice') + '*'" label-for="saleCost">
										<b-form-input
											id="saleCost"
											v-model="saleCost"
											type="text"
											placeholder="0.0"
											readonly
										/>
									</b-form-group>
								</validation-provider>

								<!-- მოგება -->

								<validation-provider
									:name="$t('products.profit')"
									rules="required"
									class="col-4"
								>
									<b-form-group :label="$t('products.profit') + '*'" label-for="profit">
										<b-form-input
											id="profit"
											v-model="profit"
											type="text"
											placeholder="0.0"
											readonly
										/>
									</b-form-group>
								</validation-provider>
							</div>
							<!-- SALE -->
							<br />
							<hr
								class="mx-auto my-2 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<div class="d-flex align-items-center">
								<b-form-group
									class="mr-1 text-center border rounded w-100"
									style="padding:0.5rem; min-width: 100px"
								>
									<label>{{ $t('products.startDiscount') }}</label>
									<b-form-checkbox
										v-model="saleActive"
										name="check-button"
										switch
									/>
								</b-form-group>
								<div class="d-flex align-items-center">
									<b-form-group class="mr-1" style="width: 160px">
										<label>{{ $t('products.discountStartDate') }}:</label>
										<datetime
											v-model="saleStartDate"
											type="datetime"
											:disabled="!saleActive"
											placeholder=""
											input-class="dateTime"
										/>
									</b-form-group>
									<b-form-group class="" style="width: 160px">
										<label>{{ $t('products.discountEndDate') }}:</label>
										<datetime
											v-model="saleEndDate"
											type="datetime"
											:disabled="!saleActive"
											placeholder=""
											input-class="dateTime"
										/>
									</b-form-group>
								</div>
							</div>
							<div class="mb-1 d-flex align-items-end">
								<!-- salePercentage -->
								<b-form-group
									:label="$t('products.discountPercentage')"
									label-for="salePercentage"
									class="mb-0 mr-1"
								>
									<b-form-input
										id="salePercentage"
										v-model="salePercentage"
										type="number"
										placeholder="0.0"
										value="0"
										:disabled="!saleActive"
										@blur="handleBlur"
									/>
								</b-form-group>

								<!-- Pieces -->
								<b-form-group
									:label="$t('products.discountPrice')"
									label-for="salePrice"
									class="flex mb-0 mr-1"
								>
									<b-form-input
										id="salePrice"
										v-model="salePrice"
										type="number"
										placeholder="0.0"
										readonly
									/>
								</b-form-group>
								<b-form-group
									:label="$t('products.discountCommission')"
									label-for="saledPercentage"
									class="mb-0"
								>
									<b-form-input
										id="saledPercentage"
										v-model="saledPercentage"
										type="text"
										placeholder="0.0"
										readonly
									/>
								</b-form-group>
							</div>
							<hr
								class="mx-auto my-1 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<b-form-group
								class="text-center"
								:label="$t('products.displayingOptions')"
								label-for="stickers"
							>
								<div class="flex-wrap mx-auto my-1 row d-flex">
									<div class="mb-1 text-center col-4">
										<label>{{ $t('products.premium') }}</label>
										<b-form-checkbox
											v-model="premium"
											name="check-button"
											switch
										/>
									</div>
									<div class="mb-1 text-center col-4">
										<label>{{ $t('products.seasonal') }}</label>
										<b-form-checkbox
											v-model="hotSeasonal"
											name="check-button"
											switch
										/>
									</div>
									<div class="mb-1 text-center col-4">
										<label>{{ $t('products.publishOnWebsite') }}</label>
										<b-form-checkbox
											v-model="published"
											name="check-button"
											switch
										/>
									</div>
								</div>
							</b-form-group>
							<hr
								class="mx-auto my-1 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
							<b-form-group
								class="text-center"
								:label="$t('products.stickers')"
								label-for="stickers"
							>
								<div class="flex-wrap mx-auto my-1 d-flex">
									<div
										v-for="item in stickersList"
										:key="item.title"
										class="py-1 mx-auto mb-1 border rounded d-flex justify-content-center align-items-center"
										style="width:45%"
									>
										<label class="mb-0" style="width:100%">{{
											item.title
										}}</label>
										<b-form-checkbox
											v-model="stickers[item.id]"
											name="check-button"
											:disabled="item.id == disabledStickerId"
											switch
										/>
									</div>
								</div>
							</b-form-group>
							<hr
								class="mx-auto my-1 w-75"
								style="height: 1px; background:#E2E2E2"
							/>
						</div>
						<!-- subcat -->
						<!-- second col -->
						<div class="col-12 col-lg-6">
							<ImageUpload :on-crop="addImage" :x="766" :y="474" />
							<div v-if="image.length" class="mt-3">
                {{ $t('products.uploadedPicturesSort') }}:
							</div>
							<div v-if="image.length" class="mb-4 upload-images-container">
								<draggable v-model="image" ghost-class="ghost">
									<transition-group type="transition" name="flip-list">
										<div
											v-for="(img, index) in image"
											:key="img.name + index"
											class="image-wrapper"
										>
											<p>#{{ index + 1 }}</p>
											<div class="">
												<img :src="staticEnvValue + `/` + img.name" />
											</div>
											<div class="">
												<b-button
													class="btn-icon"
													variant="flat-danger"
													@click="removeImage(img)"
												>
													<feather-icon size="16" icon="TrashIcon" />
												</b-button>
											</div>
										</div>
									</transition-group>
								</draggable>
							</div>
							<b-form-group :label="$t('products.videoLink')" label-for="videolink">
								<b-form-input
									id="videolink"
									v-model="videoLink"
									trim
									placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
								/>
							</b-form-group>
							<hr
								class="mx-auto my-1 w-75"
								style="height: 1px; background:#E2E2E2"
							>
							<p class="mb-0">{{ $t('products.mainDescription') }}</p>
							<b-tabs v-if="role === 'admin'">
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
							<b-tabs v-if="role === 'admin'">
								<b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
									<!-- Form: Description -->
									<TinyEditor v-if="additionalDescription !== null" :editor="additionalDescription" @update="updateAdditionalDescriptionValue_ka" />
								</b-tab>
								<b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
									<!-- Form: Description -->
									<TinyEditor v-if="additionalDescription_en !== null" :editor="additionalDescription_en" @update="updateAdditionalDescriptionValue_en" />
								</b-tab>
							</b-tabs>
							<div v-if="role != 'admin'">
								<div>
									<p class="mb-0">
										{{ $t('products.mainDescription') }}
									</p>
									<label>{{ $t('global.geo') }}: </label><br />
									<div v-html="description" class="descriptions"/>
									<label>{{ $t('global.eng') }}: </label><br />
									<div v-html="description_en" class="descriptions"/>
								</div>
								<div>
									<p class="mb-0">
										{{ $t('products.productDetails') }}
									</p>
									<label>{{ $t('global.geo') }}: </label><br />
									<div v-html="additionalDescription" class="descriptions"/>
									<label>{{ $t('global.eng') }}: </label><br />
									<div v-html="additionalDescription_en" class="descriptions"/>
								</div>
							</div>
						</div>
						<div class="mx-auto mt-2 d-flex">
							<b-button
								v-ripple.400="'rgba(255, 255, 255, 0.15)'"
								variant="primary"
								class="mr-2"
								type="submit"
								:disabled="isInvalid(errors) || disableEdit"
								@click.prevent="handleSubmitButtonPress"
							>
                {{ $t('global.update') }}
							</b-button>
							<b-button
								ref="closeBtn"
								v-ripple.400="'rgba(186, 191, 199, 0.15)'"
								type="button"
								variant="outline-secondary"
								@click="$router.go(-1)"
							>
                {{ $t('global.goBack') }}
							</b-button>
						</div>
					</b-form>
				</validation-observer>
			</div>
		</b-card>
	</div>
</template>

<script>
/* eslint-disable */
import {
	BCard,
	BForm,
	BFormGroup,
	BTab,
	BTabs,
	BFormInput,
	BFormCheckboxGroup,
	BButton,
	BFormCheckbox,
	BFormSelect,
} from 'bootstrap-vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { ref, watch, onUnmounted } from '@vue/composition-api';
import formValidation from '@core/comp-functions/forms/form-validation';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import draggable from 'vuedraggable';
import HorizontalNavbar from '@/views/navbar/HorizontalNavbar';
import store from '@/store';
import router from '@/router';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { Datetime } from 'vue-datetime';
import productStoreModule from './productStoreModule';
import 'vue-datetime/dist/vue-datetime.css';
import ImageUpload from './components/ImageUpload.vue';
import TextEditor from "@/views/components/editor/TextEditor";
import TinyEditor from './components/TinyEditor.vue';


export default {
	name: 'ProductListAddNew',
	components: {
		TinyEditor,
		draggable,
		ImageUpload,
		Datetime,
		BForm,
		BFormGroup,
		BFormInput,
		BButton,
		HorizontalNavbar,
		vSelect,
		BFormCheckbox,
		BFormCheckboxGroup,
		ValidationProvider,
		ValidationObserver,
		BCard,
		BTab,
		BTabs,
		BFormSelect,
		TextEditor
	},
	directives: {
		Ripple,
	},

	data() {
		return {
			disableEdit: false,
			// extras
			showCategoryContainer: false,
			subCategoryName: '',
			margin: '',
			staticEnvValue: '',
			editSidebarFields: '',
			villageList: [],
			categoryList: [],
			subcategoryList: [],
			subcategoryChildren: [],
			units: [],
			stickersList: [],
			role: '',
			parentCategoryId: 0,
			profit: 0,
			categoryName: '',
			farmersList: [],
			farmer: '',
			village: '',
			sticker: '',
			farmerAddress: '',
			showCategoryChange: false,
			consulCode: '',
			reserved: 0,
			views: 0,

			// category
			title: '',
			title_en: '',
			description: null,
			additionalDescription: null,
			description_en: null,
			additionalDescription_en: null,
			originalDescription: null,
			originalAdditionalDescription: null,
			originalDescription_en: null,
			originalAdditionalDescription_en: null,
			category: '',
			subCategory: '',
			subSubCategory: '',
			disabledStickerId: 0,
			// rest
			specifications: [],
			specificationsList: '',
			consulId: '',
			published: false,
			hotSeasonal: false,
			premium: false,
			stockCount: '',
			unitCost: '',
			markup: '',
			unit: '',
			unitId: '',
			pieces: '',
			resevred: '',
			code: 0,
			// sale
			salePercentage: null,
			saleActive: false,
			saleStartDate: '',
			saleEndDate: '',
			salePrice: null,
			//
			saleCost: 0,
			saledPercentage: '',
			// location
			location: {
				villageId: 0,
				municipalityId: 0,
				regionId: 0,
			},
			//
			videoLink: '',
			subCategoryId: 0,
			farmerId: '',
			stickers: {},
			image: [],
			translations: [
				{
					title: '',
					languageCode: 'ka',
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
	computed: {
		validate_title() {
			if (this.title.length === 0) return null;
			return new RegExp('^[A-Za-z\\d-\._@\+$]{4,}$').test(this.title);
		},
	},
	mounted() {
		this.fetchProduct(router.currentRoute.params.id);
		this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
		this.fetchStickers();
		this.fetchUnits();
		this.fetchCategories();
		this.fetchFarmers();
		this.role = localStorage.getItem('role');
		this.disabledStickerId = process.env.VUE_APP_DISABLED_STICKER_ID;

	},

	// /
	// watchers
	//
	watch: {
		editSidebarFields(newVal) {
			newVal.translations.forEach((lan) => {
				if (lan.languageCode === 'ka') {
					this.title = lan.title;
					this.description = lan.description;
					this.additionalDescription = lan.additionalDescription;
				}
				if (lan.languageCode === 'en') {
					this.title_en = lan.title;
					this.description_en = lan.description;
					this.additionalDescription_en = lan.additionalDescription;
				}
			});
			this.code = newVal.code;
			console.log('prod', newVal);
			this.subCategoryId = newVal.subCategoryId;
			this.getSpecifications(this.subCategoryId);
			this.getCategoryById(newVal.subCategoryId);

			const obj = newVal.specifications;
			for (const i in obj) {
				const newobj = {};
				newobj[i] = obj[i];
				this.specifications.push(newobj);
			}

			// sales
			this.getFarmer(newVal.farmerId);
			this.consulId = newVal.consulId;
			this.saleStartDate = newVal.saleStartDate;
			this.saleEndDate = newVal.saleEndDate;
			this.salePrice = newVal.salePrice;
			//
			this.hotSeasonal = newVal.hotSeasonal;
			this.image = newVal.images;
			this.location = newVal.location;
			this.markup = newVal.markup;
			this.pieces = newVal.pieces;
			this.premium = newVal.premium;
			this.published = newVal.published;
			this.stickers = newVal.stickers;
			this.stockCount = newVal.stockCount;
			this.translations = newVal.translations;
			this.unitCost = newVal.unitCost;
			this.unitId = newVal.unitId;
			this.reserved = newVal.reserved;
			this.salePercentage = newVal.salePercentage;
			this.saleActive = newVal.saleActive;
			if(this.saleActive){
				this.checkSaleLogic(this.salePercentage);
			}

			this.units.forEach((e) => {
				if (e.id === this.unitId) {
					this.unit = e;
				}
			});
			this.views = newVal.views;

			this.videoLink = newVal.videoLink;
			this.checkSaleDate();
			// handling description change issues 
			// only admin can change description
			// for everyone else send the old description back
			newVal.translations.forEach((lan) => {
				if (lan.languageCode === 'ka') {
					this.originalDescription = lan.description;
					this.originalAdditionalDescription = lan.additionalDescription;
				}
				if (lan.languageCode === 'en') {
					this.originalDescription_en = lan.description;
					this.originalAdditionalDescription_en = lan.additionalDescription;
				}
			});
		},
		// generalwatchers
		markup(val) {
			if (this.unitCost > 0 && this.markup > 0) {
				const price = this.unitCost;
				const markup = val;

				this.saleCost = `${(Math.round((this.unitCost * (1 + this.markup / 100)) * 100) / 100)}₾`;
				this.profit = `${(parseFloat(this.saleCost) - price).toFixed(2)}₾`;
				this.margin = `${((100 * parseFloat(this.profit)) / parseFloat(this.saleCost)).toFixed(2)}%`;
			}
		},
		unitCost() {
			if (this.unitCost > 0 && this.markup > 0) {
				const price = this.unitCost;
				const { markup } = this;
				this.saleCost = `${(Math.round((this.unitCost * (1 + this.markup / 100)) * 100) / 100)}₾`;
				this.profit = `${(parseFloat(this.saleCost) - price).toFixed(2)}₾`;
				this.margin = `${((100 * parseFloat(this.profit)) / parseFloat(this.saleCost)).toFixed(2)}%`;
			}
		},
		// SALES
		// salePercentage(val) {
		// 	this.checkSaleLogic(val);
		// },
		saleActive(val){
			if(this.saleActive === true){
				this.checkSaleLogic(this.salePercentage);
			}
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
		category(newVal) {
			this.fetchSubCategory(newVal.id);
			this.subCategory = [];
		},

		subCategory(newVal) {
			if (newVal.id > 0) {
				this.fetchSubCategoryChildren(newVal.id);
				this.subSubCategory = [];
				this.subCategoryId = newVal.id;
				this.getSpecifications(newVal.id);
			}
		},

		subSubCategory(val) {
			if (this.subSubCategory.id) {
				this.subCategoryId = this.subSubCategory.id;
				this.categoryName = this.subSubCategory.title;
				this.subCategoryName = this.subSubCategory.title;
				this.getSpecifications(this.subSubCategory.id);
			}
		},
		farmer(val) {
			this.farmerId = val.id;
			this.consulId = val.responsibleUserId;
		},
	},

	methods: {
		handleSubmitButtonPress() {
			if(this.description === '' || this.additionalDescription === '' 
			|| this.description_en === '' || this.additionalDescription_en === '' ) {
				this.handleEmptyDescriptionCheck();
			} else {
				this.editProduct();
			}	
		},
		handleEmptyDescriptionCheck() {
			this.$swal({
				title: 'Are you sure?',
				text: this.$i18n.t('products.areyousure'),
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: this.$i18n.t('global.yes'),
				cancelButtontext: this.$i18n.t('global.no'),
				customClass: {
					confirmButton: 'btn btn-primary',
					cancelButton: 'btn btn-outline-danger ml-1',
				},
				buttonsStyling: false,
			}).then(result => {
				if (result.value) {
					this.editProduct();
				}
			})
		},
		handleBlur(){
			if(this.saleActive){
				this.checkSaleLogic(this.salePercentage)
			}
			// console.log('blur triggered')
		},
		checkSaleLogic(salePercentage){
			const value = salePercentage;
			if (this.unitCost > 0 && this.markup > 0) {
				// this.saleCost = this.unitCost * ( 1 + this.markup/100).toFixed(2) + '₾';
				this.saleCost = `${(Math.round((this.unitCost * (1 + this.markup / 100)) * 100) / 100)}₾`;
				this.salePrice = ((this.unitCost * ( 1 + this.markup/100)) * (1-salePercentage/100)).toFixed(2);;
				this.saledPercentage = `${(((this.salePrice - this.unitCost) / this.salePrice) * 100).toFixed(2)}%`;
			}

			if(this.saleActive){
				if(this.unitCost * 0.025 < 0.11 && this.salePrice < (parseFloat(this.unitCost) + 0.11) ){
					this.saleError();
				}

				if (this.salePrice < (this.unitCost * 1.025)) {
					this.saleError();
				}
			}
		},

		saleError(){
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
		stockCountHandler() {
			if(this.stockCount < this.reserved){
				this.$swal({
					icon: 'error',
					title: 'შეცდომა!',
					text: 'მარაგი ვერ იქნება დარეზერვებულ რაოდენობაზე ნაკლები.',
					customClass: {
						confirmButton: 'btn btn-success',
					},
				}).then(() => {
					this.saleActive = false;
				});
				this.stockCount = this.reserved;
			}
		},
		getFarmer(id) {
			store
				.dispatch('app-product/fetchAddressAndCouncil', id)
				.then((response) => {
					this.farmerId = response.id;
					let farmerName = '';
					if(localStorage.getItem('lang') === 'ka') {
						farmerName = response.juridicalInfo
						? response.juridicalInfo.juridicalName + ' - ' + response.uniqueCode
						: response.physicalNames[0].firstName +
						  ' ' +
						  response.physicalNames[0].lastName +
						  ' - ' +
						  response.uniqueCode;
					} else{
						farmerName = response.juridicalInfo
						? response.juridicalInfo.juridicalName + ' - ' + response.uniqueCode
						: response.physicalNames[1].firstName +
						  ' ' +
						  response.physicalNames[1].lastName +
						  ' - ' +
						  response.uniqueCode;
					}
					this.farmer = {
						name: farmerName,
						id: response.id,
						address: response.address,
						responsiblePerson: response.responsibleUser,
						uniqueCode: response.uniqueCode,
						responsibleUserId: response.responsibleUserId,
					};
					//
					this.location = {
						villageId: response.address.villageId,
						municipalityId: response.address.municipalityId,
						regionId: response.address.regionId,
					};
					this.consulId = response.responsibleUserId;
					//
					this.consulCode = response.responsibleUserCode;
				});
		},
		fetchFarmers() {
			store.dispatch('app-product/fetchFarmers', '').then((response) => {
				let farmerName = '';
				response.data.forEach((el) => {
					farmerName = el.juridicalInfo
						? el.juridicalInfo.commercialName + ' - ' + el.uniqueCode
						: el.firstName + ' ' + el.lastName + ' - ' + el.uniqueCode;
					this.farmersList.push({
						name: farmerName,
						id: el.id,
						address: el.address,
						responsiblePerson: el.responsiblePerson,
						responsibleUserId: el.responsiblePersonId,
						uniqueCode: el.uniqueCode,
					});
				});
			});
		},
		fetchSubCategory(id) {
			store
				.dispatch('app-product/fetchSubCategory', { id })
				.then((response) => {
					this.subcategoryList = response.data;
					this.subcategoryChildren = [];
				});
		},
		synchronize(code){
			store
			.dispatch('app-product/synchronize', code )
			.then((response) => {
				const id = router.currentRoute.params.id;
				store.dispatch('app-product/fetchProduct', { id }).then((response) => {
					this.reserved = response.data.reserved;
					this.$toast({
						component: ToastificationContent,
						props: {
							title: 'მოთხოვნა გაიგზავნა',
							icon: 'EditIcon',
							variant: 'success',
						},
					});
				});
			});

		},
		fetchSubCategoryChildren(id) {
			store
				.dispatch('app-product/fetchSubCategoryChildren', { id })
				.then((response) => {
					if (response.data) {
						this.subcategoryChildren = response.data;
					} else {
						this.subcategoryChildren = [];
					}
				});
		},
		//
		getSpecifications(id) {
			this.specificationsList = [];
			store.dispatch('app-product/getSpecifications', id).then((response) => {
				if (response.data) {
					let specCats = response.data;
					specCats.forEach((e) => {
						e.specifications.forEach((k) => {
							k.value = {
								[k.id]: true,
							};
						});
						if (e.specifications.length) {
							this.specificationsList.push({
								title: e.title,
								specs: e.specifications,
							});
						}
					});
				}
			});
		},
		fetchStickers() {
			store.dispatch('app-product/fetchStickers').then((response) => {
				this.stickersList = response.data;
			});
		},

		fetchUnits(id) {
			store.dispatch('app-product/fetchUnits', id).then((response) => {
				this.units = response.data;
			});
		},
		//

		fetchProduct(id) {
			store.dispatch('app-product/fetchProduct', { id }).then((response) => {
				this.isAddNewProductSidebarActive = false;
				this.isEditProductSidebarActive = true;
				this.editSidebarFields = response.data;
				window.scrollTo(0, 0);
			});
		},

		getCategoryById(id) {
			const lang = localStorage.getItem('lang');
			store
				.dispatch('app-product/fetchSingleSubCategory', { id: id })
				.then((response) => {
					if(lang === 'ka'){
						this.subCategoryName = response.translations[0].title;
					} else {
						this.subCategoryName = response.translations[1].title;
					}

					if (response.parentSubCategoryId) {
						this.parentCategoryId = response.parentSubCategoryId;
					} else {
						this.parentCategoryId = response.categoryId;
					}
				});
		},

		fetchCategories() {
			store.dispatch('app-product/fetchCategories').then((response) => {
				this.categoryList = response.data;
				this.subcategoryChildren = [];
			});
		},
		//

		//general
		isInvalid(errors) {
			for (const [key, value] of Object.entries(errors)) {
				if (value.length > 0) return true;
			}
			return false;
		},

		handleAddProduct() {
			console.log('handle add product');
		},

		editProduct() {
			this.disableEdit = true;
			setTimeout(() => {
				this.disableEdit = false;
			}, 1000)
			const payload = {
				id: this.editSidebarFields.id,
				title: this.title,
				description: this.description,
				additionalDescription: this.additionalDescription,
				published: this.published,
				hotSeasonal: this.hotSeasonal,
				premium: this.premium,
				stockCount: this.stockCount ? parseFloat(this.stockCount) : 0,
				unitCost: this.unitCost ? parseFloat(this.unitCost) : 0,
				markup: this.markup ? parseFloat(this.markup) : 0,
				pieces: this.pieces ? parseFloat(this.pieces) : 0,
				// sales
				saleActive: this.saleActive,
				salePercentage: this.saleActive ? parseFloat(this.salePercentage) : 0,
				saleStartDate: this.saleActive ? this.saleStartDate : '',
				saleEndDate: this.saleActive ? this.saleEndDate : '',
				salePrice: this.saleActive ? parseFloat(this.salePrice) : 0,
				//
				location: this.location,
				videoLink: this.videoLink,
				subCategoryId: this.subCategoryId,
				unitId: this.unitId,
				//
				farmerId: this.farmerId,
				consulId: this.consulId,
				//
				stickers: this.stickers,
				specifications: Object.assign({}, ...this.specifications),
				images: this.image,
				translations: [
					{
						title: this.title,
						description: this.role === 'admin' ? this.description : this.originalDescription,
						additionalDescription: this.role === 'admin' ? this.additionalDescription : this.originalAdditionalDescription,
						languageCode: 'ka',
					},
					{
						title: this.title_en,
						description: this.role === 'admin' ? this.description_en : this.originalDescription_en,
						additionalDescription: this.role === 'admin' ? this.additionalDescription_en : this.originalAdditionalDescription_en,
						languageCode: 'en',
					},
				]
			};
			console.log('payload', payload);

			store
				.dispatch('app-product/editProduct', payload)
				.then(() => {
					this.toast();
				})
				.catch((err) => {
					console.log('error adding product', err.response);
					alert(err.response.data);
				});
		},

		toast(
			title,
			toaster = 'b-toaster-bottom-right',
			append = false,
			variant = 'success'
		) {
			this.$toast({
				component: ToastificationContent,
				props: {
					title: 'პროდუქტი წარმატებით განახლდა',
					icon: 'EditIcon',
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
			let index = this.image.indexOf(img);
			this.image.splice(index, 1);
		},

    goBack() {
      router.push({ name: 'products-list'})
    },
		checkSaleDate() {
			if(new Date(this.saleEndDate) - new Date() < 0 && this.saleActive === true){
				this.saleActive = false;
				this.saleStartDate = '';
				this.saleEndDate = '';
			}
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

	setup(props, { emit }) {
		const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

		// Register module
		if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME))
			store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule);

		// UnRegister on leave
		onUnmounted(() => {
			if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME))
				store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME);
		});

		const blankProductData = {
			escription: '',
			additionalDescription: '',
			saleStartDate: '',
			saleEndDate: '',
			published: false,
			hotSeasonal: false,
			premium: false,
			saleActive: false,
			stockCount: 0,
			unitCost: null,
			markup: null,
			salePercentage: null,
			unitId: 0,
			pieces: null,
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
			specifications: {
				0: false,
			},
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

.upload-images-container {
	.image-wrapper {
		width: 250px;
		max-height: 75px;
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
	max-width: 100px;
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

.dateTime:disabled {
	background-color: #efefef;
}
</style>
