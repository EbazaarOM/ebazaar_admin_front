<template>
  <Editor
    v-model="model"
    api-key="y8f79mt17hzyt173g5axta2ro7f9r2wacbcnutvnhrs4mxjr"
    :init="{
      height: 150,
      menubar: false,
      themes: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar:
        'undo redo | formatselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | removeformat | help'
    }"
  />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  components: {
    Editor,
  },
  props: ['editor'],
  data() {
    return {
      model: '',
    }
  },
  watch: {
    model(newVal) {
      this.$emit('update', newVal)
    }
  },
  created() {
    this.model = this.editor;
  },
}
</script>

<style scoped>
.tox-tinymce{
  border-radius: 5px;
}
</style>
