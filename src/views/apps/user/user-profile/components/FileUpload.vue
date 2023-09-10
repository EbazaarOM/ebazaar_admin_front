<!-- eslint-disable no-tabs -->
<template>
  <div class="mb-1">
    <b-form-group>
      <label :for="id">ფაილის მიბმა.</label>
      <b-form-file :id="id" v-model="fileInput" placeholder="ჩასვით ფაილი აქ..." drop-placeholder="ჩააგდეთ ფაილი აქ..." @change="readFile" />
    </b-form-group>
  </div>
</template>

<script>
/* eslint-disable */
import { BFormGroup, BFormFile, BButton } from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import store from '@/store';
import { onUnmounted } from '@vue/composition-api';
import productStoreModule from '../productStoreModule';
// new
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";

export default {
  name: 'FileUpload',
  components: {
    VueCropper,
    BFormGroup,
    BButton,
    BFormFile,
  },
  directives: {
    Ripple,
  },
  props: {
    onCrop: {
      type: Function,
      default: () => {},
    },
    store: {
      type: String,
      default: 'app-products',
    },
    url: {
      type: String,
      default: 'file_upload',
    },
    id: {
      type: String,
      default: 'file-input',
    },
    x: {
      type: Number,
      default: 1,
    },
    y: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      fileInput: [],
      src: '',
      cropped: '',
      upImage: '',
      staticEnvValue: '',
    };
  },
  mounted() {
    this.staticEnvValue = process.env.VUE_APP_STATIC_RESOURCES_URL;
  },
  methods: {
    async cropImage() {
      const data = this.$refs.cropper.getData(true);
      const formData = new FormData();
      formData.append('Image', this.upImage);
      formData.append('X', data.x < 0 ? 0 : data.x);
      formData.append('Y', data.y < 0 ? 0 : data.y);
      formData.append('width', data.width);
      formData.append('height', data.height);
      formData.append('MaxSize', this.x < this.y ? this.y : this.x);
      try {
        const result = await this.$store.dispatch(`${this.store}/${this.url}`, formData);
        this.cropped = result.data.name;
        this.onCrop(this.cropped);
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
