<template>
  <div class="p-1" :class="phoneNumberItemCopy.selected ? 'border-success' : 'border'">
    <div class="d-flex justify-content-between align-items-center">
      <p v-if="!isEditing" class="mb-0 w-100">{{ phoneNumberItemCopy.title }}</p>
      <!--      <b-form-input v-else v-model="phoneNumberItemCopy.title" :type="type"></b-form-input>-->
      <!-- Phone Number -->
      <validation-provider v-else
                           v-slot="{errors, valid, dirty }"
                           :rules="'required'">
        <b-form-group class="m-0">
          <b-form-input
              id="phone_number"
              v-model="phoneNumberItemCopy.title"
              :state="dirty ? validate_phone_number : null"
              trim/>
        </b-form-group>
      </validation-provider>
      <div class="d-flex align-items-center justify-content-between">
        <!-- Edit Button-->
        <b-button v-if="!isEditing"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  class="btn-icon ml-1"
                  variant="warning"
                  @click="isEditing = true"
        >
          <feather-icon icon="EditIcon"/>
        </b-button>
        <!-- Update Button -->
        <b-button v-if="isEditing"
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  :disabled="phoneNumberItemCopy.title === ''"
                  class="btn-icon ml-1"
                  variant="primary"
                  @click="updatePhoneNumberItem"
        >
          <feather-icon icon="SaveIcon"/>
        </b-button>
        <!-- Delete Button -->
        <div v-b-popover.hover.top="phoneNumberItemCopy.selected ? 'არჩეული ნომრის წაშლა არ შეიძლება' : ''">
          <b-button v-if="isEditing"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    :disabled="phoneNumberItemCopy.selected"
                    class="btn-icon ml-1"
                    variant="danger"
                    @click="openSwal()"
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
  BForm,
  VBPopover
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import store from "@/store";
import {ValidationProvider} from "vee-validate";


export default {
  name: "PhoneNumberCard",
  components: {
    BButton,
    BFormInput,
    BFormGroup,
    BForm,
    VBPopover,
    ValidationProvider,
  },
  directives: {
    'b-popover': VBPopover,
    Ripple,
  },
  props: ['phoneNumberItem', 'isEmpty', 'title', 'type', 'isLegalEntity'],
  data() {
    return {
      isEditing: false,
      isAdding: false,
      phoneNumberItemCopy: {},
      newPhoneNumberItem: '',
      actionActive: true,
    }
  },

  mounted() {
    this.phoneNumberItemCopy = this.phoneNumberItem
  },

  computed: {
    validate_phone_number() {
      if (this.isLegalEntity) return new RegExp('^[0-9]{9,10}$').test(this.phoneNumberItemCopy.title)
      return new RegExp('^[0-9]{9}$').test(this.phoneNumberItemCopy.title)
    },
  },

  methods: {
    updatePhoneNumberItem() {
      if (this.phoneNumberItemCopy.title !== '') {
        this.isEditing = false;
        this.$emit('update', {
          number: this.phoneNumberItemCopy.title,
          id: this.phoneNumberItem.i,
          selected: this.phoneNumberItemCopy.selected
        });
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
            id: this.phoneNumberItem.i
          })
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
