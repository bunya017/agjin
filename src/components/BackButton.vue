<template>
  <q-btn
    flat
    padding="sm"
    class="q-mr-md"
    @click="goBack"
    :color="$q.dark.isActive ? 'white' : 'dark'"
  >
    <q-icon
      left name="arrow_back"
      class="q-mr-xs"
    />
    <div>Back</div>
  </q-btn>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BackButton',
  methods: {
    goBack () {
      return this.$router.back()
    }
  }
})
</script>
