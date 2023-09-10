<template>
  <div>
    <quill-editor v-model="content"
                  :options="editorOption"
                  class="blog-editor"
    />
  </div>
</template>

<script>
/* eslint-disable */
import store from "@/store";
import contentStoreModule from "@/views/pages/content-pages/contentStoreModule";
import {onUnmounted} from "@vue/composition-api";
import {quillEditor} from 'vue-quill-editor'

export default {
  name: "TextEditor",
  props: ["editor"],
  components: {
    quillEditor
  },
  data() {
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],         //bold, italic, underline, strikethrough
              [{'list': 'ordered'}, {'list': 'bullet'}],      //ordered list, unordered list
              [{'header': [4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
              [{'align': []}],
              ['clean'],
              ['link', 'image', 'video'],
            ],
            handlers: {
              image: function() {
                let fileInput = this.container.querySelector('input.ql-image[type=file]');
                if (fileInput == null) {
                  fileInput = document.createElement('input');
                  fileInput.setAttribute('type', 'file');
                  fileInput.setAttribute(
                      'accept',
                      'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
                  );
                  fileInput.classList.add('ql-image');
                  fileInput.addEventListener('change', () => {
                    if (fileInput.files != null && fileInput.files[0] != null) {
                      // Do your own stuff here
                      const formData = new FormData();
                      formData.append('File', fileInput.files[0]);
                      store.dispatch(`app-content/uploadImage`, formData).then((response) => {
                        const range = this.quill.selection;
                        this.quill.insertEmbed(range.lastRange.index, 'image', response.data.fullPath);
                      });
                    }
                  });
                  this.container.appendChild(fileInput);
                }
                fileInput.click();
              }
            }
          }
        }
      },
    }
  },
  created() {
    this.content = this.editor
  },
  watch: {
    content: function (newVal) {
      this.$emit('update', newVal)
    }
  },
  setup(props) {
    const CONTENT_APP_STORE_MODULE_NAME = 'app-content';

    // Register module
    if (!store.hasModule(CONTENT_APP_STORE_MODULE_NAME)) store.registerModule(CONTENT_APP_STORE_MODULE_NAME, contentStoreModule)
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/quill.scss';
</style>
