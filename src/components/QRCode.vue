<template>
  <figure class="qrcode">
    <vue-qrcode
      :value="$props.text"
      tag="svg"
      :options="{
        errorCorrectionLevel: 'H',
        width: 200,
        color: {
          dark: '#2251f2',
          light: '#ffffff',
        }
      }"
    ></vue-qrcode>
    <img
      class="qrcode__image"
      src="icons/favicon-128x128.png"
      alt="SecureNG"
    />
  </figure>
</template>

<script>
import { defineComponent } from 'vue'

import VueQrcode from '@chenfengyuan/vue-qrcode';

export default defineComponent({
  name: 'QRCode',
  components: { VueQrcode },
  props: {
    text: String
  },
  methods: {
  }
})
</script>

<style scoped>
  .qrcode {
    display: inline-block;
    font-size: 0;
    margin-bottom: 0;
    position: relative;
  }

  .qrcode__image {
    background-color: #fff;
    border: 0.25rem solid #fff;
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
    height: 25%;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
  }
</style>
