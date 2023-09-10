<template>
  <div>
  <horizontal-navbar @go-back="goBack" :arrow-visible="true"/>
  <b-card
    v-if="role"
    class="card"
    :header="title"
    header-tag="header"
  >
    <div class="row">
      <div class="p-2 col-12 col-md-6">
        <div class="row d-flex justify-content-between align-items-center">
          <div class="group col-5">
            <p class="heading">{{ $t('global.title') }}:</p>
            <p class="value">{{ title }}</p>
          </div>
          <div class="group col-7">
            <p class="heading">{{ $t('products.category') }}:</p>
            <p class="value">{{ category.title }}, {{ category.categoryTitle }}, {{ category.parentSubCategoryTitle }}</p>
          </div>
        </div>
        <div class="group">
          <p class="heading">{{ $t('products.prices') }}:</p>
          <div class="row d-flex justify-content-between ">
            <div class="options col-6">
              <div class="div">
                 <p class="value" >{{ $t('products.minimalAmount') }}:</p>
                <p>{{ pieces }}{{ unitTitle }}</p>
              </div>
              <div class="div">
                <p class="value" >{{ $t('products.unitSaleCost') }}:</p>
                <p>{{ unitCost }}₾</p>
              </div>
              <div class="div">
                <p class="value" >{{ $t('products.stock') }}:</p>
                <p>{{ stockCount }}</p>
              </div>
              <div class="div mb-1">
                <p class="value" >{{ $t('statistics.reservedProduct') }}:</p>
                <p>{{ reserved }}</p>
              </div>
              <div v-if="role != 'callCenterManager'">
                <p class="border rounded value" style="cursor:pointer; color: #7365F0; text-deocoration: underline; text-align:center;" @click="openChangePriceModal()">
                  {{ $t('global.change') }}</p>
              </div>
            </div>
            <div v-if="role != 'farmer'" class="options col-6">
              <div class="div">
                <p class="value" >{{ $t('products.markup') }}:</p>
                <p>{{ markup }}</p>
              </div>
              <div class="div">
                <p class="value" >{{ $t('products.sellingPrice') }}:</p>
                <p>{{ salePrice }}</p>
              </div>
              <div class="div">
                <p class="value" >{{ $t('products.profit') }}:</p>
                <p>{{ profit }}</p>
              </div>
            </div>
          </div>
        </div>
        <hr class="my-1" style="height: 1px; background:#E2E2E2" >
        <div v-if="role != 'farmer'">
          <div class="row d-flex justify-content-between align-items-center">
            <div class="group col-6">
                <p class="heading">{{ $t('roles.farmer') }}:</p>
                <p class="value">{{ farmer }}</p>
            </div>
            <div class="group col-6">
              <p class="heading">{{ $t('roles.consul') }}:</p>
              <p class="value">{{ consul }}</p>
            </div>
          </div>
          <div class="group">
            <p class="heading">{{ $t('address.address') }}:</p>
            <p class="value">{{ farmerAddress }}</p>
          </div>
          <hr class="my-1" style="height: 1px; background:#E2E2E2" >
        </div>
        <!-- options and stickers -->
        <div class="row d-flex justify-content-between align-items-center">
          <div class="options col-6">
            <p class="heading">{{ $t('products.displayingOptions') }}:</p>
            <div class="">
              <p>{{ $t('global.published') }}:</p>
              <p v-if="published">{{ $t('global.yes') }}</p> <p v-else>{{ $t('global.no') }}</p>
            </div>
            <div class="">
              <p>{{ $t('products.premium') }}:</p>
              <p v-if="premium">{{ $t('global.yes') }}</p> <p v-else>{{ $t('global.no') }}</p>
            </div>
            <div class="">
              <p>{{ $t('products.seasonal') }}:</p>
              <p v-if="hotSeasonal">{{ $t('global.yes') }}</p> <p v-else>{{ $t('global.no') }}</p>
            </div>
          </div>
          <div class="col-6">
            <p class="heading">{{ $t('sticker.title') }}:</p>
            <div class="stickers-container">
              <p v-for="(stick, index) in stickersTrue" :key="index">{{ stick.title }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="p-2 col-12 col-md-6">
        <p class="heading">{{ $t('uploadImage.photos') }}:</p>
        <div class="images">
          <img v-for="(img, index) in fixedImages" :key="index" :src="img.name" :alt="index ">
        </div>
        <hr class="my-1" style="height: 1px; background:#E2E2E2" >

        <div class="group">
          <p class="heading">{{$t('global.description')}}:</p>
          <div v-html="description" class="descriptions"/>
        </div>
        <hr class="my-1" style="height: 1px; background:#E2E2E2" >
        <div class="group">
          <p class="heading">{{ $t('global.shortDescription') }}:</p>
          <div v-html="additionalDescription" class="descriptions"/>
        </div>
        <hr class="my-1" style="height: 1px; background:#E2E2E2" >
        <div class="group">
          <p class="heading">{{ $t('products.videoLink') }}:</p>
          <a :href="videoLink" class="value">{{ videoLink }}</a>
        </div>
      </div>
       <b-link
          v-if="role === 'admin' || role === 'consul'"
          :to="{ name: 'product-edit', params: { id: id}}"
        >
         {{ $t('global.edit') }}
        </b-link>
    </div>
    <!-- <div>
      farmer id: {{ farmerId }}  <br>
      farmer: {{ farmer }} <br>
      location: {{ location }} <br>
      {{ category }} , {{ subCategory }} , {{ subSubCategory }}
      {{ saleStartDate }}
      {{ saleEndDate }} <br>
      description: {{ description }} <br>
      additionalDescription: {{ additionalDescription }} <br>
      published: {{ published }} <br>
      hotseasonal: {{ hotSeasonal }}  <br>
      premium: {{ premium }} <br>
      saleactive: {{ saleActive }} <br>
      stockcount: {{ stockCount }} <br>
      unitCost: {{ unitCost }} <br>
      markup: {{ markup }} <br>
      consulId: {{ consulId }} <br>
      salePercentage: {{ salePercentage }} <br>
      videolink:{{ videoLink }}  <br>
      title: {{ title }} <br>
      subCategoryId: {{ subCategoryId }}  <br>
      unit id: {{ unitId }} <br>
      piences: {{ pieces }} <br>
      stickers {{ stickers }}  <br>
      specifications {{ specifications }}  <br>
      image  {{ images }}  <br>
      translations {{ translations }}  <br>
    </div> -->
  </b-card>
  </div>
</template>

<script>
/* eslint-disable */

import {onUnmounted, ref} from "@vue/composition-api";
import store from "@/store";
import productStoreModule from "@/views/apps/products/productStoreModule";
import router from "@/router";
import {
  BCard,
  BLink,
  BImg,
  BCardImg,
  BNavbar,
  BNavbarToggle,
  BCollapse,
  BTabs,
  BNavItem,
  BButton,
  BCol,
  BRow,
  BForm,
  BFormGroup,
  BFormInput,
  BFormRadioGroup,
  BFormCheckboxGroup,
  BFormInvalidFeedback,
  BFormCheckbox, BFormSelect,
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component'
import {ValidationObserver, ValidationProvider} from "vee-validate";
import Ripple from 'vue-ripple-directive'
import {required, alphaNum, email} from '@validations'
import UserListEdituser from "@/views/apps/user/users-list/UserListEditUser";
import useUsersList from "@/views/apps/user/users-list/useUsersList";

export default {
  name: "UserProfile",
  components: {
    UserListEdituser,
    HorizontalNavbar,
    BCard,
    BTabs,
    BButton,
    BNavItem,
    BNavbar,
    BNavbarToggle,
    BCollapse,
    BImg,
    BCardImg,
    vSelect,
    flatPickr,
    BCol,
    BRow, BForm, BFormGroup, BFormInput, BFormRadioGroup, BFormCheckboxGroup,

    BFormInvalidFeedback,
    BFormCheckbox,
    BFormSelect,
    BLink,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },

  data() {
    return {
    id: "",
    role: "",
      //extras
    margin: "",
    productId: "",
    salePrice: 0,
    profit: 0,
    farmersList: [],
    farmer: "",
    village: "",
    unit:"",
    sticker: "",
    farmerAddress: "",
    showCategoryChange: false,
    stickersList: [],
    units: "",
    category : "",
    consul: "",
    reserved: 0,

    //category
    description: "short description",
    additionalDescription: "longer descriptions",
    title:"",
    //rest
    required,
    saleEnabled: null,
    consulId: 0,
    saleStartDate: "",
    saleEndDate: "",
    published: false,
    hotSeasonal: false,
    premium: false,
    saleActive: false,
    stockCount: null,
    unitCost: null,
    markup: null,
    unitTitle: "",
    pieces: null,
    salePercentage: 0,
    views: 0,
    location: {
      villageId: 0,
      municipalityId: 0,
      regionId: 0
    },
    videoLink: "",
    subCategoryId: 0,
    farmerId: "",
    stickers: {
      10: true,
      11: false,
      12: false,
      13: false,
      14: false,
      15: false,
    },
    specifications: [],
    images:[],
    translations: [
      {
        title: "",
        languageCode: "ka",
        description: "",
        additionalDescription: ""
      }
    ],
    }
  },

  mounted() {
    this.fetchProduct();
    this.fetchStickers();
    this.role = localStorage.getItem('role');
    this.productId =  router.currentRoute.params.id;
  },

  computed:{
    stickersTrue: function () {
      if(this.stickers.length){
        return this.stickers.filter(i => i.enabled === true)
      }
    },
    fixedImages:function(){
      const envValue = process.env.VUE_APP_STATIC_RESOURCES_URL
      if(this.images.length){
        return this.images.filter(i => i.name =  envValue+"/"+i.name);
      }
    }
  },

  methods: {
    async openChangePriceModal(){
      let htmlText = "";
      if(this.saleEnabled){
        htmlText = `${this.$i18n.t('products.stock')}: x${this.pieces}${this.unitTitle } <p>${this.$i18n.t('products.inReserve')}:  ${this.reserved}</p><input id="stockCount" type="number" class="swal2-input" style="margin:1rem auto; display:block;" value="${this.stockCount}" placeholder="${this.$i18n.t('products.stock')}">` +
        `${this.$i18n.t('products.unitSaleCost')} (${this.$i18n.t('products.gel')}): <input id="unitCost" type="number" class="swal2-input" style="margin:1rem auto; display:block; background:#efefef;" value="${this.unitCost}" readonly placeholder="${this.$i18n.t('products.unitSaleCost')}">`;
      }else{
        htmlText = `${this.$i18n.t('products.stock')}: x${this.pieces}${this.unitTitle }<input id="stockCount" type="number" class="swal2-input" style="margin:1rem auto; display:block;" value="${this.stockCount}" placeholder="${this.$i18n.t('products.stock')}">` +
        `${this.$i18n.t('products.unitSaleCost')} (${this.$i18n.t('products.gel')}): <input id="unitCost" type="number" class="swal2-input" style="margin:1rem auto; display:block;" value="${this.unitCost}" placeholder="${this.$i18n.t('products.unitSaleCost')}">`;
      }

      const { value: formValues } = await this.$swal({
        title: this.$i18n.t('products.stockTitle'),
        html: htmlText,
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById('stockCount').value,
            document.getElementById('unitCost').value
          ]
        }
      })
      if (formValues) {
        this.updatePriceAndCount(formValues)
      }
    },

    updatePriceAndCount(formValues ){
      let params = {
        stock: formValues[0],
        price: this.saleActive ? this.unitCost : formValues[1],
        id: this.id,
        userId: this.farmerId
      }
      store.dispatch('app-product/updatePriceAndCount', params)
      .then((response)=>{
        this.fetchProduct();
      })
    },


    fetchProduct() {
      store.dispatch('app-product/fetchProductByCode', {id: router.currentRoute.params.id})
        .then(response => {
          this.updateProductInfo(response.data);
          console.log('product by code', response.data);
        })
        .catch(error => {
          console.log(error)
          // if (error.response.status === 404) {
          //   this.userData = undefined
          // }
        })
    },

    updateProductInfo(newVal) {
      this.id = newVal.id;
      this.title = newVal.title;
      this.description = newVal.description;
      this.additionalDescription = newVal.additionalDescription

      this.markup = newVal.markup;
      this.unitCost = newVal.unitCost;
      this.category = newVal.subCategory;
      const address = newVal.farmerData.address;
      this.farmerAddress = address.address ? address.address : "" + " " + address.municipality +  " " + address.region + " " + address.village;
      const farmerData = newVal.farmerData;
      this.farmer = farmerData.farmerFullName + " - " + farmerData.farmerCode;
      this.consul = farmerData.consulFullName + " - " + farmerData.consulCode;
      this.reserved = newVal.reserved;
      this.farmerId = newVal.farmerId;
      this.hotSeasonal = newVal.hotSeasonal;
      this.images = newVal.images;
      this.location = newVal.location;
      this.unitCost = newVal.unitCost;
      this.pieces = newVal.pieces;
      this.premium = newVal.premium;
      this.published = newVal.published;
      this.saleActive = newVal.saleActive;
      this.saleEndDate = newVal.saleEndDate;
      this.salePercentage = newVal.salePercentage;
      this.saleStartDate = newVal.saleStartDate;
      this.specifications = newVal.specifications;
      this.stickers = newVal.stickers;
      this.stockCount = newVal.stockCount + this.reserved;
      this.translations = newVal.translations;
      this.unitTitle =  newVal.unit.title,
      this.videoLink = newVal.videoLink;
      this.saleEnabled = newVal.saleEnabled;
      this.views = newVal.views;
    },

    fetchStickers() {
      store.dispatch('app-product/fetchStickers')
        .then((response) => {
          this.stickersList = response.data;
        })
    },

    handleAddProduct() {
      console.log("handle add product")
    },

    isInvalid(errors) {
      for (const [key, value] of Object.entries(errors)) {
        if (value.length > 0) return true
      }
      return !(this.validate_username && this.validate_license_number && this.validate_bank_account_number);
    },

    goBack() {
      router.push({ name: 'products-list'})
    }
  },

  setup(props) {
    const PRODUCT_APP_STORE_MODULE_NAME = 'app-product';

    // Register module
    if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME)
    });


    const {
      editFieldsDict,
      requestUrls
    } = useUsersList(props)

    return {
      editFieldsDict,
      requestUrls
    }

  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-profile.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';

.descriptions img{
  max-width: 100%;
}

.heading{
  font-size: 0.9rem;
  margin-bottom: 0;
  opacity: 0.8;
}
.value{
  margin-left: 0.5rem;
}

.stickers-container{
  margin-left: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  p{
    margin-right: 0.5rem;
    padding: 0.2rem 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
}
.options {
  margin-bottom: 1rem;

  div{
    display: flex;

    p{
      margin-bottom: 0.125rem;
      min-width: 140px
    }
  }
}

.images{
  display: flex;
  flex-wrap: wrap;
  align-items: start;

  img{
    width: 150px;
    height: auto;
    margin: 0.125rem;
    border-radius: 0.125rem;
  }
}

.card-header{
  background: #7366F0 !important;
  color: white;
  font-size: 1.25rem;
}


</style>
