<template>
  <div>
    <div v-if="isEmpty">
      <div v-if="isAdding" class="d-flex justify-content-between align-items-center">
        <b-form-input v-model="newCategory_ka"></b-form-input>
        <div class="d-flex align-items-center justify-content-between">
          <b-button
              @click="addNewCategory"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="btn-icon ml-1"
          >
            <feather-icon icon="SaveIcon"/>
          </b-button>
          <b-button
              @click="isAdding = false"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="danger"
              class="btn-icon ml-1"
          >
            <feather-icon icon="DeleteIcon"/>
          </b-button>
        </div>
      </div>
      <div v-else class="d-flex justify-content-end">
        <b-button
            @click="openModal(false)"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="secondary"
            class="btn-icon"
        >
          <feather-icon icon="PlusIcon"/>
        </b-button>
      </div>

    </div>
    <div v-else>
      <div class="d-flex justify-content-between align-items-center">
        <p class="mb-0"><span v-if="category.prefix">{{ category.prefix }} - </span>{{ categoryCopy.title }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <!-- Edit Button-->
          <b-button
              @click="getCategoryAndOpenModal"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="warning"
              class="btn-icon ml-1"
          >
            <feather-icon icon="EditIcon"/>
          </b-button>
          <!-- Add Specification Button-->
          <b-button v-if="specification"
                    :disabled="category.isParent"
                    @click="$emit('openModal',{category: category, isSubCategory: isSubCategory})"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="btn-icon ml-1"
          >
            <feather-icon icon="PlusIcon"/>
          </b-button>
          <!-- Open SubCategories Button-->
          <b-button v-if="nextVisible"
                    :disabled="category.specificationCategories && category.specificationCategories.length > 0"
                    @click="$emit('openChildren', {category: category, isSubCategory: isSubCategory})"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    :variant="category.specificationCategories && category.specificationCategories.length > 0 ? 'outline-success' : 'success'"
                    class="btn-icon ml-1"
          >
            <feather-icon icon="ChevronRightIcon"/>
          </b-button>
        </div>
      </div>
      <div v-if="false" class="d-flex justify-content-between align-items-center">
        <b-form-input v-model="categoryCopy.title"></b-form-input>
        <div class="d-flex align-items-center justify-content-between">
          <!-- Update Button -->
          <b-button :disabled="!isValid"
              @click="updateCategory"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="btn-icon ml-1"
          >
            <feather-icon icon="SaveIcon"/>
          </b-button>
          <!-- Delete Button -->
          <b-button
              @click="openSwal()"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="danger"
              class="btn-icon ml-1"
          >
            <feather-icon icon="DeleteIcon"/>
          </b-button>
        </div>
      </div>
    </div>

    <b-modal id="modal-add-category"
             ref="category-modal"
             size="lg"
             class="p-3"
             hide-header
             hide-footer
             centered>

      <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
        <h4>{{ isEditing ? title + ' ' + $t('global.edit') : title + ' ' + $t('global.add') }}</h4>

        <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
          <feather-icon icon="XIcon"/>
        </b-button>
      </div>

      <b-form autocomplete="off" class="edit-institution d-flex flex-column justify-content-between">
        <b-tabs>
          <b-tab :title="$t('global.geo')" :active="$i18n.locale === 'ka'">
            <!-- Form: Description -->
            <b-form-group :label="$t('global.title') + '*'"
                          label-for="newCategory_ka">
              <b-form-input id="newCategory_ka" v-model="newCategory_ka"
                            placeholder=""/>
            </b-form-group>

            <b-form-group v-if="isCategory" :label="$t('global.description')"
                          label-for="description_ka">
              <b-form-textarea id="description_ka" v-model="description_ka"
                               placeholder=""/>
            </b-form-group>
          </b-tab>
          <b-tab :title="$t('global.eng')" :active="$i18n.locale === 'en'">
            <!-- Form: Description -->
            <b-form-group :label="$t('global.title')"
                          label-for="newCategory_en">
              <b-form-input id="newCategory_en" v-model="newCategory_en"
                            placeholder=""/>
            </b-form-group>
            <b-form-group v-if="isCategory" :label="$t('global.description')"
                          label-for="description_en">
              <b-form-textarea id="description_en" v-model="description_en"
                               placeholder=""/>
            </b-form-group>
          </b-tab>
        </b-tabs>
      </b-form>

      <div v-if="isCategory" class="border rounded p-2">
        <template v-if="image.name">
          <p class="mt-1 mb-1">
            {{ $t('uploadImage.uploadedPicture') }}
          </p>
          <div class="image-wrapper">
            <div class="">
              <img class="mw-100" :src="staticEnvValue + `/` + image.name"/>
            </div>
          </div>
        </template>
        <image-upload id="image"
                      key="image"
                      ref="image"
                      store="app-content"
                      url="cropImage"
                      module="contentStoreModule"
                      :on-crop="addImage" :x="1200" :y="628"/>
      </div>

      <div class="mt-1 d-flex justify-content-between align-items-center mb-2 mt-1">

        <b-button v-if="!isEditing" :disabled="!isValid" variant="primary" class="save-changes" @click="addNewCategory">
          <feather-icon icon="SaveIcon"
                        class="mr-50"/>
          <span class="align-middle">{{ $t('global.add') }}</span>
        </b-button>

        <b-button v-else variant="primary" :disabled="!isValid" class="save-changes" @click="updateCategory">
          <feather-icon icon="SaveIcon"
                        class="mr-50"/>
          <span class="align-middle">{{ $t('global.edit') }}</span>
        </b-button>
        <!-- Delete Button -->
        <b-button
            @click="openSwal()"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="danger"
            class="btn-icon ml-1"
        >
          <feather-icon icon="DeleteIcon"/>
        </b-button>
      </div>
    </b-modal>

  </div>
</template>

<script>
/* eslint-disable */

import {
  BButton,
  BFormInput,
  BFormGroup,
  BForm,
  BRow,
  BCol,
  BTab,
  BTabs,
  BFormTextarea
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import store from "@/store";
import ImageUpload from "@/views/apps/products/components/ImageUpload";

export default {
  name: "Category",
  components: {
    ImageUpload,
    BButton,
    BFormInput,
    BFormGroup,
    BForm,
    BRow,
    BCol,
    BTab,
    BTabs,
    BFormTextarea
  },
  directives: {
    Ripple,
  },
  props: ['category', 'isSubCategory', 'isEmpty', 'parentCategory', 'parentSubCategory', 'specification', 'nextVisible', 'title', 'type'],
  data() {
    return {
      isEditing: false,
      isAdding: false,
      categoryCopy: {},
      newCategory_ka: '',
      newCategory_en: '',
      description_ka: '',
      description_en: '',
      fullCategory: {},
      image: {},
      staticEnvValue: '',
      urls: {
        category: 'app-category/getCategory',
        subCategory: 'app-category/getSubCategory',
        specificationCategory: 'app-category/getSpecificationCategory',
        specification: 'app-category/getSpecification',
      },
    }
  },

  mounted() {
    this.$root.$on('bv::modal::hide', (bvEvent, modalId) => {
      this.clearModal()
    })
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
    if (this.isEmpty) this.categoryCopy = {}
    else {
      this.categoryCopy = this.category
      this.image.name = this.category?.image
    }
  },

  computed: {
    isCategory: function () {
      return this.type === 'category' || this.type === 'subCategory' || this.type === 'parentCategory'
    },

    isValid: function() {
      return this.newCategory_ka !== ''
    }
  },

  methods: {

    addImage(name) {
      this.image = {
        name: name
      }
    },

    updateCategory() {
      // if (this.category.title === this.categoryCopy) this.isEditing = false;
      // else {
      this.isEditing = false;
      this.categoryCopy['translations'] = [
        {
          "title": this.newCategory_ka,
          "description": this.description_ka,
          "languageCode": "ka"
        },
        {
          "title": this.newCategory_en,
          "description": this.description_en,
          "languageCode": "en"
        },
      ]
      this.categoryCopy['image'] = this.image.name
      this.$emit('update', {category: this.categoryCopy, parent_category: this.parentCategory});
      this.clearModal()
      // }
    },

    addNewCategory() {
      this.isAdding = false

      let translations = [
        {
          "title": this.newCategory_ka,
          "description": this.description_ka,
          "languageCode": "ka"
        },
        {
          "title": this.newCategory_en,
          "description": this.description_en,
          "languageCode": "en"
        },
      ]
      let payload = {
        value: translations,
        image: this.image.name,
        category: this.category
      }
      // if (this.isSubCategory) payload['parentCategoryId'] = this.category.parentSubCategoryId
      // else payload['categoryId'] = this.category.id
      this.$emit('add', payload)
      this.clearModal();
    },

    getCategoryAndOpenModal() {
      this.getCategory().then(() => {
        this.openModal(true);
      })
    },

    getCategory() {
      return store.dispatch(this.urls[this.type], {id: this.category.id})
          .then((response) => {
            this.fullCategory = response
          })
    },

    clearModal() {
      this.newCategory_ka = ''
      this.newCategory_en = ''
      this.description_ka = ''
      this.description_en = ''
      this.image.name = ''
      this.hideModal();
    },

    hideModal() {
      this.$refs['category-modal'].hide()
    },

    openModal(isEditing) {
      this.$refs['category-modal'].show()
      this.isEditing = isEditing
      if (isEditing) {
        let category_ka = this.fullCategory.translations?.find(a => a.languageCode === 'ka')
        let category_en = this.fullCategory.translations?.find(a => a.languageCode === 'en')
        this.newCategory_ka = category_ka?.title
        this.newCategory_en = category_en?.title
        this.description_ka = category_ka?.description
        this.description_en = category_en?.description
        this.image.name = this.fullCategory?.image
      }
    },

    openSwal() {
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
      }).then(result => {
        if (result.value) {
          this.isEditing = false;
          this.$emit('delete', {
            delete_id: this.category.id,
            parent_category: this.parentCategory,
            parent_sub_category: this.parentSubCategory
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/quill.scss';
</style>
