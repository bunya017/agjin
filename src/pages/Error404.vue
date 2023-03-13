<template>
  <div class="row jutify-center text-center" style="padding-top: 25vh;">
    <div class="col-12 q-px-md">
      <div class="text-h1 q-pb-lg">404</div>
      <p class="text-subtitle">We can't seem to find the page you're looking for.</p>
      <div class="q-gutter-md">
        <q-btn
          no-caps
          unelevated
          color="primary"
          label="Go Home"
          class="q-px-md"
          @click="goHome"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getMetaData } from 'boot/utils'

export default defineComponent({
  name: 'Error404',
  mixins: [getMetaData('Page Not Found')],
  methods: {
    goHome () {
      return window.location.replace('/')
    }
  }
})
</script>
