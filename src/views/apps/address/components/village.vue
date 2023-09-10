<template>
  <div>
    <div v-if="isEmpty">
      <div v-if="false" class="d-flex justify-content-between align-items-center">
        <b-form-input v-model="newCategory"></b-form-input>
        <div class="d-flex align-items-center justify-content-between">
          <b-button
              @click="openModal(false)"
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
      <div class="d-flex justify-content-end">
        <b-button :disabled="disabled"
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
        <p class="mb-0"><span v-if="category.prefix">{{ category.id }} - </span>{{ categoryCopy.title }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <!-- Edit Button-->
          <b-button
              @click="getVillageAndOpenModal"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="warning"
              class="btn-icon ml-1"
          >
            <feather-icon icon="EditIcon"/>
          </b-button>
        </div>
      </div>
    </div>

    <b-modal id="modal-add-village"
             ref="village-modal"
             size="lg"
             class="p-3"
             hide-header
             hide-footer
             centered>

      <div class="mb-1 modal-custom-header d-flex align-items-center justify-content-between">
        <h4>{{ isEditing ? $t('global.edit') : $t('global.add') }}</h4>

        <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="hideModal">
          <feather-icon icon="XIcon"/>
        </b-button>
      </div>

      <b-form class="edit-institution d-flex flex-column justify-content-between">
        <b-form-group :label="$t('global.geo')"
                      label-for="newVillage_ka">
          <b-form-input id="newVillage_ka" v-model="newVillage_ka"
                        placeholder=""/>
        </b-form-group>
        <b-form-group :label="$t('global.eng')"
                      label-for="newVillage_en">
          <b-form-input id="newVillage_en" v-model="newVillage_en"
                        placeholder=""/>
        </b-form-group>
      </b-form>

      <div class="mt-1 d-flex justify-content-between align-items-center">

        <b-button v-if="!isEditing" variant="primary" class="save-changes mb-3" @click="addNewCategory">
          <feather-icon icon="SaveIcon"
                        class="mr-50"/>
          <span class="align-middle">{{ $t('global.add') }}</span>
        </b-button>

        <b-button v-else variant="primary" class="save-changes mb-3" @click="updateCategory">
          <feather-icon icon="SaveIcon"
                        class="mr-50"/>
          <span class="align-middle">{{ $t('global.edit') }}</span>
        </b-button>

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
  BForm
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import store from "@/store";

export default {
  name: "Village",
  components: {
    BButton,
    BFormInput,
    BFormGroup,
    BForm
  },
  directives: {
    Ripple,
  },
  props: ['category', 'isSubCategory', 'isEmpty', 'parentCategory', 'parentSubCategory', 'specification', 'nextVisible', 'disabled'],
  data() {
    return {
      isEditing: false,
      isAdding: false,
      categoryCopy: {},
      newCategory: '',
      newVillage_ka: '',
      newVillage_en: '',
      fullVillageObj: {}
    }
  },

  mounted() {
    this.categoryCopy = this.category
  },

  methods: {
    updateCategory() {
      this.isEditing = false;
      this.categoryCopy['translations'] = [
        {
          "title": this.newVillage_ka,
          "languageCode": "ka"
        },
        {
          "title": this.newVillage_en,
          "languageCode": "en"
        },
      ]
      this.$emit('update', {category: this.categoryCopy, parent_category: this.parentCategory});
      this.closeModal()
    },

    addNewCategory() {
      this.isAdding = false

      let translations = [
        {
          "title": this.newVillage_ka,
          "languageCode": "ka"
        },
        {
          "title": this.newVillage_en,
          "languageCode": "en"
        },
      ]
      let payload = {
        translations: translations,
        category: this.category
      }
      // if (this.isSubCategory) payload['parentCategoryId'] = this.category.parentSubCategoryId
      // else payload['categoryId'] = this.category.id
      this.$emit('add', payload)
      this.closeModal();
    },

    getVillage() {
      return store.dispatch('app-user/getVillage', {id: this.category.id})
          .then((response) => {
            this.fullVillageObj = response
          })
    },

    getVillageAndOpenModal() {
      this.getVillage().then(() => {
        this.openModal(true);
      })
    },

    closeModal() {
      this.hideModal();
      this.newVillage_ka = ''
      this.newVillage_en = ''
    },

    hideModal() {
      this.$refs['village-modal'].hide()
    },

    openModal(isEditing) {
      this.$refs['village-modal'].show()
      this.isEditing = isEditing
      if (isEditing) {
        this.newVillage_ka = this.fullVillageObj.translations?.find(a => a.languageCode === 'ka').title
        this.newVillage_en = this.fullVillageObj.translations?.find(a => a.languageCode === 'en').title
        // this.newVillage_ka = this.categoryCopy.title
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

<style scoped>

</style>
