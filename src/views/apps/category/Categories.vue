<template>
  <div>
    <horizontal-navbar/>
    <div class="categories-wrapper d-flex align-content-lg-start">
      <b-col md="4">
        <b-list-group v-if="categories.length">
          <b-list-group-item class="empty-category">
            <category :is-empty="true"
                      type="category"
                      :title="$t('category.categories')"
                      @add="addCategory"/>
          </b-list-group-item>
          <b-list-group-item v-for="(category) in categories" :key="category.id + category.title"
                             :active="selectedCategory && selectedCategory.id === category.id">
            <category :category="category"
                      :title="$t('category.categories')"
                      :next-visible="true"
                      type="category"
                      @update="updateCategory"
                      @delete="deleteCategory"
                      @openChildren="openChildCategories"/>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col v-if="subCategoriesVisible" md="4">
        <b-list-group>
          <b-list-group-item class="">
            <category :is-empty="true"
                      :title="$t('category.subcategories')"
                      type="subCategory"
                      :category="selectedSubCategory"
                      @add="addSubCategory"/>
          </b-list-group-item>
          <b-list-group-item v-for="(category) in subCategories"
                             :key="category.id + category.title"
                             :active="selectedProductCategory && selectedProductCategory.id === category.id">
            <category :category="category"
                      :is-sub-category="true"
                      :parent-category="selectedCategory"
                      :specification="true"
                      :next-visible="true"
                      :title="$t('category.subcategories')"
                      type="subCategory"
                      @update="updateSubCategory"
                      @delete="deleteSubCategory"
                      @openChildren="openChildCategories"
                      @openModal="openSpecificationsModal"
            />
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col v-if="productCategoriesVisible" md="4">
        <b-list-group>
          <b-list-group-item class="">
            <category :is-empty="true"
                      :title="$t('category.productCategories')"
                      type="subCategory"
                      :category="selectedProductCategory"
                      @add="addProductCategory"/>
          </b-list-group-item>
          <b-list-group-item v-for="(category) in productCategories" :key="category.id + category.title">
            <category :category="category"
                      :parent-sub-category="selectedProductCategory"
                      :specification="true"
                      :next-visible="false"
                      type="subCategory"
                      :title="$t('category.productCategories')"
                      @update="updateProductCategory"
                      @delete="deleteProductCategory"
                      @openModal="openSpecificationsModal"
                      @openChildren="openSpecificationsModal"/>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </div>

    <b-modal id="specifications"
             ref="specifications"
             :visible="isSpecificationsModalVisible"
             size="lg"
             class="p-3"
             @hide="clearModalInfo"
             hide-header
             hide-footer
             centered>
      <div class="modal-custom-header mb-1 d-flex align-items-center justify-content-between">
        <h4>{{ $t('category.specifications') }} - {{ product.title }}</h4>

        <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal('specifications')">
          <feather-icon icon="XIcon"/>
        </b-button>
      </div>
      <div class="specifications pb-2">
        <div class="categories-wrapper d-flex align-content-lg-start">
          <!-- Specification Categories-->
          <b-col md="6">
            <b-list-group v-if="specificationCategoriesVisible">
              <!-- Add Specification Category -->
              <b-list-group-item class="">
                <category :is-empty="true"
                          type="specificationCategory"
                          :title="$t('category.specificationCategories')"
                          @add="addSpecificationCategory"/>
              </b-list-group-item>
              <b-list-group-item v-for="(category) in specificationCategories" :key="category.id + category.title"
                                 :active="selectedSpecificationCategory && selectedSpecificationCategory.id === category.id">
                <category :category="category"
                          :next-visible="true"
                          type="specificationCategory"
                          :title="$t('category.specificationCategories')"
                          @update="updateSpecificationCategory"
                          @delete="deleteSpecificationCategory"
                          @openChildren="openSpecification"/>
              </b-list-group-item>
            </b-list-group>
          </b-col>
          <!-- Specifications -->
          <b-col v-if="specificationsVisible" md="6">
            <b-list-group>
              <!-- Add Specification -->
              <b-list-group-item class="">
                <category :is-empty="true"
                          type="specification"
                          :title="$t('category.specification')"
                          @add="addSpecification"/>
              </b-list-group-item>
              <b-list-group-item v-for="(category) in specifications" :key="category.id + category.title" :variant="''">
                <category :category="category"
                          :next-visible="false"
                          :title="$t('category.specification')"
                          type="specification"
                          @update="updateSpecification"
                          @delete="deleteSpecification"
                          @openChildren="openSpecification"/>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable */
import {
  BTable,
  BListGroup,
  BListGroupItem,
  BCard,
  BCardGroup,
  BCardHeader,
  BCollapse,
  BButton,
  BCardBody,
  BCardText,
  VBToggle,
  BTabs,
  BTab,
  BNavItem,
  BFormInput,
  BCol,
  BModal,
} from 'bootstrap-vue'
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import store from "@/store";
import categoryStoreModule from "@/views/apps/category/categoriesStoreModule";
import {onUnmounted, ref} from "@vue/composition-api";
import useCategoriesList from "@/views/apps/category/useCategoriesList";
import {avatarText} from "@core/utils/filter";
import Ripple from 'vue-ripple-directive'
import Category from "@/views/apps/category/components/Category";
import ToastificationContent from "@core/components/toastification/ToastificationContent";

export default {
  name: "Categories",
  directives: {
    'b-toggle': VBToggle,
    Ripple,
  },
  components: {
    Category,
    HorizontalNavbar,
    BTable,
    BListGroup,
    BCard,
    BCardGroup,
    BCardHeader,
    BCollapse,
    BButton,
    BCardBody,
    BCardText,
    BTabs,
    BTab,
    BNavItem,
    BFormInput,
    BCol,
    BListGroupItem,
    BModal,
  },
  data() {
    return {
      isSpecificationsModalVisible: false,
      subCategoriesVisible: false,
      productCategoriesVisible: false,
      specificationCategoryVisible: false,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedProductCategory: null,
      selectedSpecificationCategory: null,
      variant: '',
      categories: [],
      subCategories: [],
      productCategories: [],
      specificationCategories: [],
      specifications: [],
      specificationsVisible: false,
      specificationCategoriesVisible: false,
      product: [],
      updated: false,
    }
  },

  mounted() {
    this.fetchCategories();
  },

  methods: {
    openChildCategories(item) {
      if (item.isSubCategory) {
        this.fetchSubCategories({subCategoryId: item.category.id}).then((response) => {
          this.productCategoriesVisible = true;
          this.productCategories = response
          this.selectedProductCategory = item.category
        })
      } else {
        this.fetchSubCategories({categoryId: item.category.id}).then((response) => {
          this.subCategoriesVisible = true
          this.subCategories = response
          this.selectedCategory = item.category
          this.productCategories = []
          this.productCategoriesVisible = false
          this.selectedProductCategory = null
        })
      }
    },

    addCategory(item) {
      let payload = {
        translations: item.value,
        image: item.image
      }
      store.dispatch('app-category/addCategory', payload)
          .then((response) => {
            this.toast('success', 'კატეგორია წარმატებით დაემატა', 'UserIcon')
            this.fetchCategories()
          })
    },
    addSubCategory(item) {
      let payload = {
        "subCategoryId": this.selectedCategory.subCategoryId,
        "categoryId": this.selectedCategory.id,
        translations: item.value,
        image: item.image
      }
      store.dispatch('app-category/addSubCategory', payload)
          .then(() => {
            this.toast('success', 'ქვეკატეგორია წარმატებით დაემატა', 'UserIcon')
            this.fetchSubCategories(payload).then((response) => {
              this.subCategories = response
            })
          })
    },
    addProductCategory(item) {
      let parentSubCategoryId = this.selectedProductCategory.parentSubCategoryId ? this.selectedProductCategory.parentSubCategoryId : item.category.id
      let payload = {
        "parentSubCategoryId": parentSubCategoryId,
        translations: item.value,
        image: item.image
      }
      console.log('this.selectedSubCategory', this.selectedCategory, this.selectedProductCategory, this.selectedSubCategory)
      store.dispatch('app-category/addSubCategory', payload)
          .then(() => {
            this.toast('success', 'პროდუქტის კატეგორია წარმატებით დაემატა', 'UserIcon')
            this.fetchSubCategories({categoryId: this.selectedCategory.id}).then((response) => {
              this.subCategories = response
              this.fetchSubCategories({subCategoryId: parentSubCategoryId}).then((response) => {
                this.productCategories = response
              })
            })
          })
    },

    updateCategory(item) {
      let payload = {
        id: item.category.id,
        image: item.category.image,
        translations: item.category.translations
      }
      store.dispatch('app-category/updateCategory', payload)
          .then((response) => {
            this.toast('success', 'კატეგორია წარმატებით შეიცვალა', 'UserIcon')
            this.fetchCategories()
          })
    },
    updateSubCategory(item) {
      let payload = {
        id: item.category.id,
        image: item.category.image,
        categoryId: this.selectedCategory.id,
        translations: item.category.translations
      }
      store.dispatch('app-category/updateSubCategory', payload)
          .then((response) => {
            this.toast('success', 'ქვეკატეგორია წარმატებით შეიცვალა', 'UserIcon')
            this.fetchSubCategories({categoryId: this.selectedCategory.id}).then((response) => {
              this.subCategories = response
            })
            // this.fetchCategoriesTree()
          })
    },
    updateProductCategory(item) {
      let payload = {
        id: item.category.id,
        image: item.category.image,
        parentSubCategoryId: item.category.parentSubCategoryId,
        translations: item.category.translations
      }
      store.dispatch('app-category/updateSubCategory', payload)
          .then((response) => {
            this.toast('success', 'პროდუქტის კატეგორია წარმატებით შეიცვალა', 'UserIcon')
            this.fetchSubCategories({subCategoryId: item.category.parentSubCategoryId}).then((response) => {
              this.productCategories = response
            })
          })
    },

    deleteCategory(item) {
      store.dispatch('app-category/deleteCategory', {id: item.delete_id})
          .then((response) => {
            this.toast('danger', 'კატეგორია წარმატებით წაიშალა', 'UserIcon')
            this.fetchCategories()
          })
    },
    deleteSubCategory(item) {
      store.dispatch('app-category/deleteSubCategory', {id: item.delete_id})
          .then(() => {
            this.toast('danger', 'ქვეკატეგორია წარმატებით წაიშალა', 'UserIcon')
            this.fetchSubCategories({categoryId: item.parent_category.id}).then((response) => {
              this.subCategories = response
            })
          })
    },
    deleteProductCategory(item) {
      store.dispatch('app-category/deleteSubCategory', {id: item.delete_id})
          .then(() => {
            this.toast('danger', 'პროდუქტის კატეგორია წარმატებით წაიშალა', 'UserIcon')
            this.fetchSubCategories({categoryId: this.selectedCategory.id}).then((response) => {
              this.subCategories = response
              this.fetchSubCategories({subCategoryId: item.parent_sub_category.id}).then((response) => {
                this.productCategories = response
              })
            })
          })
    },

    fetchCategories() {
      store.dispatch('app-category/fetchCategories')
          .then((response) => {
            this.categories = response
          })
    },
    fetchSubCategories(payload) {
      return store.dispatch('app-category/fetchSubCategories', payload)
          .then((response) => {
            return response
          })
    },

    openSpecificationsModal({category, isSubCategory}) {
      this.isSpecificationsModalVisible = true;
      this.specificationCategoriesVisible = true;
      this.showModal('specifications');
      this.product = category
      this.product['isSubCategory'] = isSubCategory
      if (isSubCategory) {
        this.selectedSubCategory = category
        this.clearProductCategoryColumn()
      } else {
        this.selectedProductCategory = category
      }
      this.specificationCategories = category.specificationCategories
    },
    openSpecification({category}) {
      this.specifications = category.specifications
      this.specificationsVisible = true
      this.selectedSpecificationCategory = category
    },

    addSpecificationCategory(item) {
      let payload = {
        subCategoryIds: [this.product.id],
        published: true,
        translations: item.value
      }
      store.dispatch('app-category/addSpecificationCategory', payload)
          .then(() => {
            this.toast('success', 'სპეციფიკაციის კატეგორია წარმატებით დაემატა', 'UserIcon')
            let subCategoryId = this.product.isSubCategory ? this.selectedCategory.id : this.product.parentSubCategoryId
            let idKey = this.product.isSubCategory ? 'categoryId' : 'subCategoryId'
            let params = {};
            params[idKey] = subCategoryId
            this.fetchSubCategories(params).then((response) => {
              this.subCategories = !this.product.isSubCategory ? this.subCategories : response
              this.productCategories = this.product.isSubCategory ? response : this.productCategories
              this.specificationCategories = response.find(a => a.id === this.product.id).specificationCategories;
            })
          })
    },
    updateSpecificationCategory(item) {
      let payload = {
        id: item.category.id,
        subCategoryIds: [this.product.id],
        published: true,
        translations: item.category.translations
      }
      store.dispatch('app-category/updateSpecificationCategory', payload)
          .then(() => {
            this.toast('success', 'სპეციფიკაციის კატეგორია წარმატებით შეიცვალა', 'UserIcon')
            this.fetchSubCategories({subCategoryId: this.product.parentSubCategoryId}).then((response) => {
              this.productCategories = response
              this.specificationCategories = response.find(a => a.id === this.product.id).specificationCategories;
            })
          })
    },
    deleteSpecificationCategory(item) {
      store.dispatch('app-category/deleteSpecificationCategory', {id: item.delete_id})
          .then(() => {
            this.toast('danger', 'სპეციფიკაციის კატეგორია წარმატებით წაიშალა', 'UserIcon')
            this.fetchSubCategories({subCategoryId: this.product.parentSubCategoryId}).then((response) => {
              this.productCategories = response
              this.specificationCategories = response.find(a => a.id === this.product.id).specificationCategories;
            })
          })
    },

    addSpecification(item) {
      let payload = {
        specificationCategoryId: this.selectedSpecificationCategory.id,
        published: true,
        translations: item.value
      }
      store.dispatch('app-category/addSpecification', payload)
          .then(() => {
            this.toast('success', 'სპეციფიკაცია წარმატებით დაემატა', 'UserIcon')
            let subCategoryId = this.product.isSubCategory ? this.selectedCategory.id : this.product.parentSubCategoryId
            let idKey = this.product.isSubCategory ? 'categoryId' : 'subCategoryId'
            let params = {};
            params[idKey] = subCategoryId
            this.fetchSubCategories(params).then((response) => {
              this.productCategories = this.product.isSubCategory ? this.productCategories : response
              this.subCategories = this.product.isSubCategory ? response : this.subCategories
              this.specificationCategories = response.find(a => a.id === this.product.id).specificationCategories;
              this.specifications = this.specificationCategories.find(a => a.id === this.selectedSpecificationCategory.id).specifications;
            })
          })
    },
    updateSpecification(item) {
      let payload = {
        specificationCategoryId: this.selectedSpecificationCategory.id,
        id: item.category.id,
        published: true,
        translations: item.category.translations
      }
      store.dispatch('app-category/updateSpecification', payload)
          .then(() => {
            this.toast('success', 'სპეციფიკაცია წარმატებით შეიცვალა', 'UserIcon')
            this.fetchSubCategories({subCategoryId: this.product.parentSubCategoryId}).then((response) => {
              this.productCategories = response
              this.specificationCategories = response.find(a => a.id === this.product.id).specificationCategories;
              this.specifications = this.specificationCategories.find(a => a.id === this.selectedSpecificationCategory.id).specifications;
            })
          })
    },
    deleteSpecification(item) {
      store.dispatch('app-category/deleteSpecification', {id: item.delete_id})
          .then(() => {
            this.toast('danger', 'სპეციფიკაცია წარმატებით წაიშალა', 'UserIcon')
            this.fetchSubCategories({subCategoryId: this.product.parentSubCategoryId}).then((response) => {
              this.productCategories = response
              this.specificationCategories = response.find(a => a.id === this.product.id).specificationCategories;
              this.specifications = this.specificationCategories.find(a => a.id === this.selectedSpecificationCategory.id).specifications;
            })
          })
    },

    clearModalInfo() {
      this.specifications = []
      this.specificationCategories = []
      this.specificationCategoryVisible = false
      this.specificationsVisible = false
    },
    showModal(value) {
      this.$refs[`${value}`].show()
    },
    hideModal(value) {
      this.$refs[value].hide()
    },

    clearProductCategoryColumn() {
      this.selectedProductCategory = null
      this.productCategories = []
      this.productCategoriesVisible = false
    },

    fetchSpecificationCategories(payload) {
      return store.dispatch('app-category/fetchSpecificationCategories', payload)
          .then((response) => {
            return response
          })
    },

    toast(variant, title, icon) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: title,
          icon: icon,
          variant: variant,
        },
      })
    },
  },

  setup(props) {
    const CATEGORY_APP_STORE_MODULE_NAME = 'app-category';

    // Register module
    if (!store.hasModule(CATEGORY_APP_STORE_MODULE_NAME)) store.registerModule(CATEGORY_APP_STORE_MODULE_NAME, categoryStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CATEGORY_APP_STORE_MODULE_NAME)) store.unregisterModule(CATEGORY_APP_STORE_MODULE_NAME)
    });

    const {
      fetchUsers,
      // fetchCategories,
      // fetchCategoriesTree,
      // categoriesTree,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      dateFilter,
      sortBy,
      refUserListTable,
      refetchData,
      // regions,
      // fetchRegions,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,

    } = useCategoriesList(props)

    return {

      fetchUsers,
      // fetchCategories,
      // fetchCategoriesTree,
      // categoriesTree,
      tableColumns,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      dateFilter,
      sortBy,
      refUserListTable,
      refetchData,

      // Filter
      avatarText,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    }


  },
}
</script>

<style lang="scss">
.categories-tree.card {
  .card-header {
    background-color: rgba(34, 41, 47, 0.04);
  }
}

.list-group-item.active {
  color: #956639;
}

.list-group-item.active {
  background-color: #ffe4ca;
  border: 1px solid rgba(34, 41, 47, 0.125);
}

.list-group .list-group-item.active:hover {
  background-color: #ffe4ca;
  border-color: #956639;
}
</style>
