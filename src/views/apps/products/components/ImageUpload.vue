<!-- eslint-disable no-tabs -->
<template>
  <div class="mb-1">
    <validation-observer ref="refFormObserver">
      <validation-provider v-slot="{ errors, valid, dirty }"
                           name="Image Upload"
                           :rules="required ? 'required' : ''">
        <b-form-group>
          <label :for="id">
            <span> {{ $t('uploadImage.browsePicture') }} {{ x }}x{{ y }} </span>
            <p v-if="required">
              <small class="text-danger">{{ $t('global.mandatoryField') }}</small>
            </p>
          </label>
          <b-form-file :id="id" v-model="imageInput" :placeholder="$t('uploadImage.uploadPictureHere')"
                       :state="dirty ? (errors[0] ? false : (valid ? true : null)) : null"
                       accept="image/*" @change="readFile"/>
          <template v-if="src !== '' && cropped === ''">

            <vue-cropper
                ref="cropper"
                class="m-1"
                :aspect-ratio="x / y"
                :src="src"
                alt="Source Image"
                drag-mode="none"
                scalable
                :zoomable="false"
                :view-mode="2"
                :ready="
                () => {
                  const contData = $refs.cropper.getContainerData();
                  $refs.cropper.setCropBoxData({
                    height: contData.height,
                    width: contData.width,
                  });
                }"
            />
            <div @click="cropImage">
              <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="outline-primary" size="sm" :disabled="disabledBtn">
                {{ $t('uploadImage.crop') }}
              </b-button>
            </div>

          </template>
        </b-form-group>
      </validation-provider>
    </validation-observer>
  </div>
</template>

<script>
/* eslint-disable */
import {BFormGroup, BFormFile, BButton} from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import store from '@/store';
import {onUnmounted} from '@vue/composition-api';
import productStoreModule from '../productStoreModule';
// new
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {ValidationObserver, ValidationProvider} from "vee-validate";

export default {
  name: 'ImageUpload',
  components: {
    VueCropper,
    BFormGroup,
    BButton,
    BFormFile,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  props: {
    onCrop: {
      type: Function,
      default: () => {
      },
    },
    store: {
      type: String,
      default: 'app-products',
    },
    url: {
      type: String,
      default: 'crop_image',
    },
    id: {
      type: String,
      default: 'image-input',
    },
    x: {
      type: Number,
      default: 1,
    },
    y: {
      type: Number,
      default: 1,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageInput: [],
      src: '',
      cropped: '',
      upImage: '',
      staticEnvValue: '',
      disabledBtn: false,
      
    };
  },
  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  methods: {
    async cropImage() {
      this.disabledBtn = true;
      const data = this.$refs.cropper.getData(true);
      const formData = new FormData();
      formData.append('Image', this.upImage);
      formData.append('X', data.x < 0 ? 0 : data.x);
      formData.append('Y', data.y < 0 ? 0 : data.y);
      formData.append('width', data.width);
      formData.append('height', data.height);
      formData.append('ResizeHeight', this.y.toString());
      formData.append('ResizeWidth', this.x.toString());
      formData.append('MaxSize', this.x < this.y ? this.y.toString() : this.x.toString());
      try {
        const result = await this.$store.dispatch(`${this.store}/${this.url}`, formData);
        this.cropped = result.data.name;
        this.onCrop(this.cropped);
        this.disabledBtn = false;
      } catch (e) {
        console.log(e);
      }
    },
    readFile(e) {
      this.upImage = e.target.files[0];
      this.cropped = '';
      this.src = '';
      if (e.target.files[0] && e.target.files[0]) {
        const FR = new FileReader();
        FR.addEventListener('load', (e) => {
          this.src = e.target.result;
        });

        FR.readAsDataURL(e.target.files[0]);
      }
    },
  },
  setup() {
    const PRODUCT_APP_STORE_MODULE_NAME = 'app-products';
    if (!store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.registerModule(PRODUCT_APP_STORE_MODULE_NAME, productStoreModule);
    onUnmounted(() => {
      if (store.hasModule(PRODUCT_APP_STORE_MODULE_NAME)) store.unregisterModule(PRODUCT_APP_STORE_MODULE_NAME);
    });

    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';
    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)
    // UnRegister on leave
    // onUnmounted(() => {
    //   if (store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.unregisterModule(CONTENT_APP_STORE_MODULE_NAME)
    // });
  },
};
</script>
