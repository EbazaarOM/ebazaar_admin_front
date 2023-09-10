<template>
  <div>
  <horizontal-navbar />
    <div class="bg-white rounded-lg shadow sticker-container" :lang="$i18n.locale">
      <!-- Header -->
      <div class="px-2 py-1 d-flex justify-content-between align-items-center content-sidebar-header">
        <h5 class="mb-0">
          {{ $t('sticker.title') }}
        </h5>
      </div>
      <!-- Body -->
      <div class="px-1">
        <b-container>
          <b-row>
            <b-col cols="3">
              <b-form-group
                :label="$t('global.title') + ' ' + $t('global.geo')"
                label-for="title"
              >
                <b-form-input
                  id="sticker-title_ka"
                  v-model="title"
                  trim
                  :placeholder="$t('global.title') + ' ' + $t('global.geo')"
                />
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group
                :label="$t('global.title') + ' ' + $t('global.eng')"
                label-for="title"
              >
                <b-form-input
                  id="sticker-title_en"
                  v-model="titleEn"
                  trim
                  :placeholder="$t('global.title') + ' ' + $t('global.eng')"
                />
              </b-form-group>
            </b-col>
            <b-col cols="3" class="d-flex align-items-center">
              <b-form-group
                :label="$t('uploadImage.uploadPicture')"
                label-for="image-input"
                style="width: 100%; "
              >
              <b-form-file
                id="image-input"
                :placeholder="$t('uploadImage.uploadPictureHere')"
                :drop-placeholder="$t('uploadImage.uploadPictureHere')"
                accept="image/*"
                @change="uploadImage($event)"
              />
              </b-form-group>
              <div id="preview-img" class="ml-1" style="margin-top:8px" @click="image =''">
                <img v-if="image" :src="staticEnvValue + `/` + image" alt="Sticker Image" style="width: 35px; height: 35px;" class="rounded">
              </div>
            </b-col>
            <b-col class="d-flex align-items-center">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mr-2"
                type="submit"
                :disabled="image == '' || title == '' "
                @click.prevent="addSticker"
              >
                {{ $t('global.add') }}
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="p-2">
        <div>
          <b-row class="p-1 table-head rounded">
            <b-col cols="1">
              ID
            </b-col>
            <b-col cols="3">
              {{ $t('global.title') + ' ' + $t('global.geo') }}
            </b-col>
            <b-col cols="3">
              {{ $t('global.title') + ' ' + $t('global.eng') }}
            </b-col>
            <b-col cols="3">
              {{ $t('uploadImage.picture') }}
            </b-col>
            <b-col cols="1">
              {{ $t('global.actions') }}
            </b-col>
          </b-row>
          <b-row v-for="(sticker, index) in stickersList" :key="index" class="p-1 tables rounded">
            <b-col cols="1">
              {{ sticker.id }}
            </b-col>
            <b-col cols="3" class="d-flex align-items-center">
              <b-form-input v-model="sticker.title" style="max-width: 300px"/>
              <a class="ml-1 save-changes" @click="updateSticker(sticker)">
                <feather-icon icon="SaveIcon" style="width:20px; height:20px"/>
              </a>
            </b-col>
            <b-col cols="3" class="d-flex align-items-center">
              <b-form-input v-model="sticker.titleEn" style="max-width: 300px"/>
              <a class="ml-1 save-changes" @click="updateSticker(sticker)">
                <feather-icon icon="SaveIcon" style="width:20px; height:20px"/>
              </a>
            </b-col>
            <b-col cols="3">
              <img :src="staticEnvValue + `/` + sticker.image" alt="Sticker Image" style="width: 35px; height: 35px;" class="rounded">
              <b-form-file
                accept="image/*"
                class="ml-2"
                style="max-width: 150px"
                size="sm"
                placeholder=""
                drop-placeholder=""
                @change="updateImage($event, sticker)"
              />
            </b-col>
            <b-col cols="2">
              <div class="d-flex align-items-center">
                <b-button v-if="sticker.id != disabledStickerId" class="btn-icon" variant="flat-danger" @click="confirmText(sticker.id)">
                  <feather-icon size="16" icon="TrashIcon"/>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
    <input v-model="show" type="text" class="hidden">
    </div>
</template>

<script>
/* eslint-disable */
import {
  BForm, BFormGroup, BFormInput, BFormCheckboxGroup, BFormInvalidFeedback, BButton, BFormCheckbox, BFormSelect, BFormTextarea, BFormFile, BRow, BCol, BContainer,
} from 'bootstrap-vue'
import {ValidationProvider, ValidationObserver} from 'vee-validate'
import formValidation from '@core/comp-functions/forms/form-validation'
import {ref, watch, onUnmounted} from '@vue/composition-api'
import Ripple from 'vue-ripple-directive'
import productStoreModule from './productStoreModule';
import HorizontalNavbar from "@/views/navbar/HorizontalNavbar";
import vSelect from 'vue-select'
import store from '@/store'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import axios from '@axios'

export default {
  name: 'Stickers',
  components: {
    BFormCheckboxGroup,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    HorizontalNavbar,
    BButton,
    vSelect,
    BFormCheckbox,
    BFormSelect,
    ValidationProvider,
    ValidationObserver,
    BFormTextarea,
    BFormFile,
    BRow,
    BCol,
    BContainer,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      show : " ",
      staticEnvValue: "",
      stickersList: [],
      disabledStickerId: 0,
      //tobusubmit
      title: "",
      image: "",
      titleEn: "",

    }
  },
  mounted(){
    this.fetchStickers();
    // setTimeout(() => this.show = "", 1000);
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
    this.disabledStickerId = process.env.VUE_APP_DISABLED_STICKER_ID;
  },
  //
  // watchers
  //
  watch: {
    //
  },

  methods: {
    toast(title, toaster = 'b-toaster-bottom-right', append = false, variant = 'success') {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: `${title} წარმატებით დაემატა`,
          icon: 'EditIcon',
          variant: 'success',
        },
      })
    },
    confirmText(sticker) {
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
          this.deleteSticker(sticker);
        }
      })
    },
    //
    //
    //
    uploadImage(event) {
      return store.dispatch('app-product/uploadImage', {file:  event.target.files[0]})
        .then(response => {
          this.image = response.data.name.key;
        })
        .catch(error => {
          alert('Image Upload Error.')
        })
    },
    //
    //
    //
    updateImage(event, sticker) {
      return store.dispatch('app-product/uploadImage', {file:  event.target.files[0]})
        .then(response => {
          let payload = {
          image: response.data.name.key,
          translations: [
            {
              title: sticker.title,
              languageCode: "ka"
            },
            {
              title: sticker.titleEn,
              languageCode: "en"
            }
          ],
          id: sticker.id
          };
          store.dispatch('app-product/updateSticker', payload)
            .then((response) => {
              this.fetchStickers();
              this.$swal(
                {
                  icon: "success",
                  text: "Sticker successfully updated"
                }
              )
            })
        })
        .catch(error => {
          alert('Image Upload Error.')
        })
    },
    //
    //
    //
    removeImage(img){
      let index = this.image.indexOf(img);
      this.image.splice(index, 1)
    },

    fetchStickers() {
      store.dispatch('app-product/fetchStickers')
        .then((response) => {
          let data = response.data;
          data.map(e=>{
           store.dispatch('app-product/fetchSticker', e.id)
            .then((response) => {
              if(response.translations[1]){
                e.titleEn = response.translations[1].title;
              }
              if(response.translations[0]){
                e.title = response.translations[0].title;
              }
              this.stickersList.push(e);
            })
          })
        })
    },
    addSticker() {
      let self = this;
      let payload = {
        image: self.image,
        translations:[
          {
            title: self.title,
            languageCode: "ka"
          },
          {
            title: self.titleEn,
            languageCode: "en"
          }
        ]
      };
      store.dispatch('app-product/addSticker', payload)
        .then(() => {
          this.image = "";
          this.title = "";
          this.titleEn ="";
          this.fetchStickers();
        })
        .catch((err) => {
          console.log("error adding sticker", err.response);
          alert(err.response.data)
        })
    },
    deleteSticker(id){
      store.dispatch('app-product/deleteSticker', id)
      .then((response) => {
        this.fetchStickers();
      })
    },
    updateSticker(sticker){
      let payload = {
        image: sticker.image,
        translations:[
          {
            title: sticker.title,
            languageCode:  "ka"
          },
          {
            title: sticker.titleEn,
            languageCode:  "en"
          },

        ],
        id :sticker.id
      };
      store.dispatch('app-product/updateSticker', payload)
      .then((response) => {
        this.fetchStickers();
        this.$swal(
          {
            icon: "success",
            text: "Sticker successfully updated"
          }
        )
      })
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
    const USER_APP_STORE_MODULE_NAME = 'app-user'
  }

}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#preview-img{
  position: relative;
  cursor: pointer;
}

#preview-img:hover::before{
  opacity: 1;
}

#preview-img::before{
  content: "X";
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 0, 0.712);
  color: white;
  position: absolute;
  z-index: 99;
  border-radius: 10px;
  opacity: 0;
  display: flex;
  transition: opacity 0.3s ease;
}


.table-head {
  background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
  color: white;
}

.tables:nth-child(even) {background: rgb(247, 247, 247)}


.sticker-container:lang(en) .custom-file-label::after {
  content: 'Browse';
}

.sticker-container:lang(ka) .custom-file-label::after {
  content: 'აირჩიეთ';
}

</style>
