<template>
  <div class="q-pa-sm q-pa-sm-md row justify-center">
    <div class="col-12 col-sm-7 col-md-4">
      <q-card flat bordered class="q-mt-xl q-pa-sm q-pb-lg w500">
        <form v-on:submit.prevent="loginUser">
          <q-card-section class="q-gutter-y-md">
            <q-input
              outlined
              auto-focus
              lazy-rules
              type="email"
              label="Email"
              v-model="email"
              hide-bottom-space
              :rules="[
                val => !!val || 'Field is required',
                val => validateEmail(val)
              ]"
            />
            <q-input
              outlined
              lazy-rules
              label="Password"
              hide-bottom-space
              v-model="password"
              :type="isPwd ? 'password' : 'text'"
              :rules="[val => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loginBtnLoading"
              :disabled="loginBtnLoading || !email || !password"
            />
          </q-card-section>
        </form>
      </q-card>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { getMetaData } from 'src/utils/seo'

export default defineComponent({
  name: 'Login',
  mixins: [getMetaData('Login')],
  data () {
    return {
      email: '',
      isPwd: true,
      password: '',
      loginBtnLoading: false
    }
  },
  computed: {
  },
  methods: {
    validateEmail (val) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return (re.test(val) || 'Please enter a valid email.')
    },
    triggerNotification (type, message) {
      this.$q.notify({
        type: type,
        message: message,
        position: 'top',
        timeout: 5000
      })
    },
    loginUser () {
      const self = this
      self.loginBtnLoading = true
      self.$api.post('/auth/token', { email: self.email, password: self.password })
        .then(function (response) {
          if (response.status === 200) {
            self.$q.localStorage.set('permissionList', response.data.permissions)
            self.$q.localStorage.set('authToken', response.data.access_token)
            self.$router.push({ name: 'user-list' })
          }
        })
        .catch(function (error) {
          self.loginBtnLoading = false
          if (!error.response) {
            self.$q.notify({
              type: 'negative',
              icon: 'mdi-network-strength-3-alert',
              timeout: 8000,
              position: 'top',
              message: 'Network error!',
            })
          } else if (error.response.data.detail) {
            self.triggerNotification('negative', error.response.data.detail)
          }
        })
    }
  },
  created () {
    this.$api.get('/')
  }
})
</script>

<style scoped>
.w500 {
  max-width: 500px;
}
</style>
