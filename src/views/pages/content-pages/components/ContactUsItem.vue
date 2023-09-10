<template>
  <div>
    <div v-if="isEmpty">
      <div v-if="isAdding" class="d-flex justify-content-between align-items-center">
        <b-form-input v-model="newContactUsItem" :type="type"></b-form-input>
        <div class="d-flex align-items-center justify-content-between">
          <b-button
              @click="addNewContactUsItem"
              :disabled="newContactUsItem === ''"
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
            @click="isAdding = true"
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
        <p v-if="!isEditing" class="mb-0">{{ contactUsItemCopy.title }}</p>
        <b-form-input v-else v-model="contactUsItemCopy.title" :type="type"></b-form-input>
        <div class="d-flex align-items-center justify-content-between">
          <!-- Edit Button-->
          <b-button v-if="!isEditing"
                    @click="isEditing = true"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="warning"
                    class="btn-icon ml-1"
          >
            <feather-icon icon="EditIcon"/>
          </b-button>
          <!-- Update Button -->
          <b-button v-if="isEditing"
                    :disabled="contactUsItemCopy.title === ''"
                    @click="updateContactUsItem"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="btn-icon ml-1"
          >
            <feather-icon icon="SaveIcon"/>
          </b-button>
          <!-- Delete Button -->
          <b-button v-if="isEditing"
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
  name: "ContactUsItem",
  components: {
    BButton,
    BFormInput,
    BFormGroup,
    BForm
  },
  directives: {
    Ripple,
  },
  props: ['contactUsItem', 'isEmpty', 'title', 'type'],
  data() {
    return {
      isEditing: false,
      isAdding: false,
      contactUsItemCopy: {},
      newContactUsItem: '',
      actionActive: true,
    }
  },

  mounted() {
    this.contactUsItemCopy = this.contactUsItem
  },

  methods: {
    updateContactUsItem() {
      if (this.contactUsItemCopy.title !== '') {
        this.isEditing = false;
        this.$emit('update', {title: this.contactUsItemCopy.title, i: this.contactUsItem.i});
      }
    },

    addNewContactUsItem() {
      if (this.newContactUsItem !== '') {
        this.actionActive = false
        this.$emit('add', this.newContactUsItem)
        this.isAdding = false
        this.newContactUsItem = ''
        this.contactUsItemCopy = {}
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
            i: this.contactUsItem.i
          })
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
