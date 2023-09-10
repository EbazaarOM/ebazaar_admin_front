<template>
<div>
  <b-modal id="specifications"
           ref="specifications"
           :visible="isSpecificationsModalVisible"
           size="xl"
           class="p-3 pb-1"
           hide-header
           hide-footer
           centered>

    <div class="modal-custom-header d-flex align-items-center justify-content-between">
      <h4>სპეციფიკაციები</h4>

      <b-button variant="flat-secondary" class="btn-icon mr-1" size="lg" @click="$emit('hide', 'add-address')">
        <feather-icon icon="XIcon"/>
      </b-button>
    </div>
  </b-modal>
</div>
</template>

<script>
export default {
  name: "Specifications"
}
</script>

<style scoped>

</style>
