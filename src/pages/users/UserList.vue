<template>
  <q-page padding>
    <div class="row q-pb-xl justify-center q-gutter-sm-md">
      <!-- Title -->
      <div :class="['col-12 col-sm-10 col-lg-7 q-mx-xl-xl', $q.dark.isActive ? 'text-white' : 'text-dark']">
        <back-btn />
        <div class="row">
          <div class="col-12 col-sm-6 text-h4 q-pb-md">Users List</div>
        </div>
        <div class="q-pb-md">
          <div class="row full-width">
            <q-btn
              outline
              square
              label="Filter"
              padding="xs lg"
              icon="filter_list"
              @click="showFilter = !showFilter"
            />
          </div>
          <q-card flat v-if="showFilter" class="full-width q-px-sm">
            <q-card-section class="row full-width q-col-gutter-x-sm q-pl-none q-pr-sm text-body1">
              <div class="col-12">
                <div class="q-pb-xs">Email</div>
                <q-input
                  dense
                  outlined
                  lazy-rules
                  type="email"
                  hide-bottom-space
                  v-model="filter.email"
                  :rules="[val => emailIsValid(val)]"
                />
              </div>
              <div class="col-12 q-pt-sm">
                <div class="q-pb-xs">Firstname</div>
                <q-input
                  dense
                  outlined
                  hide-bottom-space
                  v-model="filter.firstname"
                  hint="Field is case sensitve"
                />
              </div>
              <div class="col-12 q-pt-sm">
                <div class="q-pb-xs">Lastname</div>
                <q-input
                  dense
                  outlined
                  hide-bottom-space
                  v-model="filter.lastname"
                  hint="Field is case sensitve"
                />
              </div>
              <div class="col-12 q-pt-sm">
                <div class="q-pb-xs">Middlename</div>
                <q-input
                  dense
                  outlined
                  hide-bottom-space
                  v-model="filter.middlename"
                  hint="Field is case sensitve"
                />
              </div>
              <div class="col-12 q-pt-sm">
                <div class="q-pb-xs">Status</div>
                <q-select
                  dense
                  outlined
                  v-model="filter.is_active"
                  :options="[
                    { label: 'Active', value: true },
                    { label: 'Deactivated', value: false }
                  ]"
                />
              </div>
              <div class="col-12 q-pt-sm">
                <div class="q-pb-xs">User Group</div>
                <q-select
                  dense
                  outlined
                  :options="groupOptions"
                  v-model="filter.user_group_name"
                />
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat padding="xs lg" :color="$q.dark.isActive ? 'white' : 'dark'" label="Reset" @click="resetFilter" />
              <q-btn
                unelevated
                label="Apply"
                padding="xs lg"
                @click="filterUsersList"
                :loading="tableIsLoading"
                :disable="emptyFilter || tableIsLoading"
                :color="$q.dark.isActive ? 'white' : 'dark'"
                :text-color="$q.dark.isActive ? 'dark': 'white'"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- Users Table -->
      <div class="col-12 col-sm-10 col-lg-7">
        <q-table
          class="col-12"
          hide-pagination
          :columns="columns"
          :loading="tableIsLoading"
          :row-key="row => row.uuid"
          :pagination="pagination"
          :rows-per-page-options="[10, 25, 50, 0]"
          table-header-class="text-grey-10 bg-grey-4"
          title-class="text-body1 text-grey-8 q-py-xs"
          :rows="!!filteredPayload.result ? filteredPayload.result : userListPayload.result"
          :title="tableIsLoading ? '' : !!filteredPayload.result ? `${filteredPayload.count} filtered entries` : `${userListPayload.count} total entries`"
        >
          <template v-slot:body-cell-firstname="props">
            <q-td
              :props="props"
              :class="[$q.dark.isActive ? 'text-white' : 'text-dark']"
              @click="$router.push({
                name: 'user-detail',
                params: { uuid: props.row.uuid }
              })"
            >
              {{ props.row.firstname }}
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat color="grey-7" round icon="more_vert" />
              <q-menu :offset="[0, -10]" class="shadow-12" auto-close>
                <q-list style="width: 200px;">
                  <q-item clickable @click="makePassChangePayload(props.row)">
                    <q-item-section>
                      Change Password
                    </q-item-section>
                  </q-item>
                  <q-item clickable @click="makeDeletePayload(props.row)">
                    <q-item-section>
                      Delete User
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-td>
          </template>

          <template v-slot:loading>
            <q-inner-loading showing :color="$q.dark.isActive ? 'white' : 'dark'" />
          </template>
        </q-table>
        <!-- Pagination -->
        <div class="q-table__bottom row items-center justify-end q-py-sm">
          <div class="q-table__separator col"></div>
          <div class="q-table__control">
            <span :class="['q-table__bottom-item', $q.dark.isActive ? 'white' : 'text-dark']">Records per page:</span>
            <q-select
              dense
              size="sm"
              borderless
              options-cover
              options-dense
              :options="[10, 25, 50]"
              class="q-table__select inline"
              v-model="pagination.rowsPerPage"
              @update:model-value="rowsPerPageUpdate"
            />
          </div>
          <q-pagination
            size="sm"
            :max-pages="3"
            padding="xs xs"
            direction-links
            boundary-numbers
            :max="maxPageNumber"
            v-model="pagination.page"
            @update:model-value="pageUpdate"
            :color="$q.dark.isActive ? 'white' : 'dark'"
            :active-text-color="$q.dark.isActive ? 'dark' : 'white'"
          />
        </div>
      </div>
    </div>

    <!-- Change password modal/dialog -->
    <q-dialog persistent v-model="passwordChangeDialog" @hide="closeChangeDialog">
      <q-card class="q-pa-sm text-body1">
        <q-card-section v-if="passwordChanged" class="q-px-sm">
          <div class="text-negative q-pb-md">
            Warning! This password will only be shown once. Please save and store it in a safe place.
          </div>
          <q-card class="q-px-sm q-py-lg bg-grey-3 text-center">
            <div class="text-h3">
              <strong>{{ changedPasswordText }}</strong>
            </div>
          </q-card>
        </q-card-section>
        <q-card-section v-else class="q-px-sm">
          Are you sure you want to change <span class="text-weight-bold">{{ passwordChangePayload.email }}'s ({{ passwordChangePayload.firstname }} {{ passwordChangePayload.lastname }})</span> password? They'll not be able to use the current password to log in after you change it.
        </q-card-section>
        <q-card-actions v-if="passwordChanged" align="right" class="q-gutter-sm">
          <q-btn
            outline
            no-caps
            label="Close"
            v-close-popup
            color="primary"
            padding="xs lg"
          />
        </q-card-actions>
        <q-card-actions v-else align="right" class="q-gutter-sm">
          <q-btn
            outline
            no-caps
            v-close-popup
            label="Cancel"
            color="grey-8"
            padding="xs lg"
          />
          <q-btn
            no-caps
            unelevated
            padding="xs lg"
            color="negative"
            @click="changePassword"
            label="Change User Password"
            :loading="changePasswordBtnLoading"
            :disabled="changePasswordBtnLoading"
          />
        </q-card-actions>
        <q-inner-loading :showing="changePasswordBtnLoading">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <!-- Delete Wallet Dialog -->
    <q-dialog persistent v-model="deleteDialog">
      <q-card class="q-pa-sm text-body1">
        <q-card-section class="q-px-sm">
          Are you sure you want to delete <span class="text-weight-bold">{{ deletePayload.firstname }} {{ `${deletePayload.lastname}${!!deletePayload.middlename ? ' '+deletePayload.middlename : ''}` }}</span>'s account with email: <span class="text-weight-bold">{{ deletePayload.email }}</span>? You will not be able to make restore it after deleting it.
        </q-card-section>
        <q-card-actions align="right" class="q-gutter-sm">
          <q-btn
            outline
            no-caps
            label="Cancel"
            color="grey-8"
            padding="xs lg"
            v-close-popup
          />
          <q-btn
            no-caps
            unelevated
            padding="xs lg"
            color="negative"
            label="Delete User"
            @click="deleteUser"
            :loading="deleteBtnIsLoading"
            :disabled="deleteBtnIsLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { getMetaData, validateEmail } from 'boot/utils'
import { generateQueryObj, generateQueryString } from 'src/utils/pagination'
const tableCols = [
  { name: 'firstname', label: 'FIRST NAME', field: 'firstname', align: 'left', classes: 'cursor-pointer', sortable: true },
  { name: 'lastname', label: 'LAST NAME', field: 'lastname', align: 'left'},
  { name: 'email', label: 'Email', field: 'email', align: 'left'},
  { name: 'actions', align: 'left'}
]

export default defineComponent({
  name: 'UserList',
  mixins: [getMetaData('User List')],
  data () {
    return {
      groupOptions: [],
      deletePayload: {},
      showFilter: false,
      columns: tableCols,
      filteredPayload: {},
      userListPayload: {},
      deleteDialog: false,
      tableIsLoading: false,
      passwordChanged: false,
      changedPasswordText: '',
      passwordChangePayload: {},
      deleteBtnIsLoading: false,
      passwordChangeDialog: false,
      changePasswordBtnLoading: false,
      pagination: {
        page: 1,
        rowsNumber: 10,
        rowsPerPage: 10,
        descending: false,
        sortBy: 'firstname'
      },
      filter: {
        email: '',
        lastname: '',
        firstname: '',
        middlename: '',
        is_active: null,
        user_group_name: ''
      }
    }
  },
  computed: {
    maxPageNumber () {
      return !!this.filteredPayload.count ?
        Math.ceil(this.filteredPayload.count / this.pagination.rowsPerPage) :
        Math.ceil(this.userListPayload.count / this.pagination.rowsPerPage)
    },
    emptyFilter () {
      return !this.filter.firstname &&
        !this.filter.user_group_name &&
        !this.filter.middlename &&
        !this.filter.is_active &&
        !this.filter.lastname &&
        (validateEmail(this.filter.email) !== true)
    },
    queryString () {
      let query = '?'
      query += generateQueryString(this.filter, this.$route.query)
      const skip = Number(this.$route.query.skip) * Number(this.$route.query.limit)
      query += `&skip=${skip}&limit=${this.$route.query.limit}`
      return (query === '?') ? '' : query
    },
    query () {
      const queryObj = generateQueryObj(this.filter)
      queryObj.skip = Number(this.pagination.page) - 1
      queryObj.limit = this.pagination.rowsPerPage
      return queryObj
    }
  },
  watch: {
    '$route.query': function () {
      if (Object.keys(this.$route.query).length !== 0) {
        return this.getUsersByPgination()
      }
    }
  },
  methods: {
    getAuthToken () {
      return this.$q.localStorage.getItem('authToken')
    },
    emailIsValid (payload) {
      if (!!payload) {
        return validateEmail(payload)
      }
    },
    rowsPerPageUpdate (val) {
      this.pagination.rowsPerPage = Number(val)
      this.$router.push({
        name: this.$route.name,
        query: this.query
      })
    },
    pageUpdate (val) {
      this.pagination.page = Number(val)
      this.$router.push({
        name: this.$route.name,
        query: this.query
      })
    },
    getGroupList () {
      const self = this
      this.$api.defaults.headers.common = {
        Authorization: `Bearer ${self.getAuthToken()}`
      }
      self.$api.get('/groups')
        .then(function (response) {
          const options = []
          for (let i = 0; i < response.data.length; i++) {
            options.push(response.data[i].name)
          }
          self.groupOptions = options
        })
    },
    getUsersByPgination () {
      const self = this
      self.tableIsLoading = true
      this.$api.defaults.headers.common = {
        Authorization: `Bearer ${self.getAuthToken()}`
      }
      self.$api.get(`/users${self.queryString}`)
        .then(function (response) {
          self.userListPayload = response.data
          self.tableIsLoading = false
        })
        .catch(function (error) {
          self.tableIsLoading = false
          if (error.response.status >= 400) {
            self.$q.notify({
              timeout: 15000,
              position: 'top',
              type: 'negative',
              message: error.response.data.detail,
              actions: [{ icon: 'close', color: 'red-2' }]
            })
          }
        })
    },
    filterUsersList () {
      this.$router.push({ name: this.$route.name, query: this.query })
    },
    resetFilter () {
      this.filteredPayload = {}
      this.filter = {
        email: '',
        lastname: '',
        firstname: '',
        middlename: '',
        user_group_name: ''
      }
      if (Object.keys(this.$route.query).length > 2) {
        this.$router.push({
          name: this.$route.name,
          query: {
            skip: this.$route.query.skip,
            limit: this.$route.query.limit
          }
        })
      }
    },
    makePassChangePayload (payload) {
      this.passwordChangePayload = payload
      this.passwordChangeDialog = true
    },
    closeChangeDialog () {
      this.passwordChanged = false
      this.changedPasswordText = ''
      this.passwordChangePayload = {}
      this.passwordChangeDialog = false
    },
    changePassword () {
      const self = this
      self.changePasswordBtnLoading = true
      this.$api.defaults.headers.common = {
        Authorization: `Bearer ${self.getAuthToken()}`
      }
      self.$api.put(`/users/change_password/${self.passwordChangePayload.uuid}`)
        .then(function (response) {
          self.changedPasswordText = response.data.password
          self.changePasswordBtnLoading = false
          self.passwordChanged = true
          self.$q.notify({
            timeout: 5000,
            position: 'top',
            type: 'positive',
            message: 'Password changed successfully',
            actions: [{ icon: 'close', color: 'green-2' }]
          })
        })
        .catch(function (error) {
          self.changePasswordBtnLoading = false
          if (error.response.status === 403) {
            self.$q.notify({
              timeout: 15000,
              position: 'top',
              type: 'negative',
              message: error.response.data.detail,
              actions: [{ icon: 'close', color: 'red-2' }]
            })
          }
        })
    },
    makeDeletePayload (payload) {
      this.deletePayload = payload
      this.deleteDialog = true
    },
    deleteUser () {
      const self = this
      self.deleteBtnIsLoading = true
      this.$api.defaults.headers.common = {
        Authorization: `Bearer ${self.getAuthToken()}`
      }
      self.$api.delete(`/users/${self.deletePayload.uuid}`)
        .then(function () {
          self.deleteBtnIsLoading = false
          self.getUsersByPgination()
          self.deleteDialog = false
          self.$q.notify({
            timeout: 5000,
            position: 'top',
            type: 'positive',
            message: 'User deleted successfully',
            actions: [{ icon: 'close', color: 'green-2' }]
          })
        })
        .catch(function (error) {
          self.deleteBtnIsLoading = false
          console.log(error)
          if (error.response.status >= 400) {
            self.$q.notify({
              timeout: 15000,
              position: 'top',
              type: 'negative',
              message: error.response.data.detail,
              actions: [{ icon: 'close', color: 'red-2' }]
            })
          }
        })
    }
  },
  created () {
    if (Object.keys(this.$route.query).length === 0) {
      this.$router.replace({
        name: this.$route.name,
        query: {
          skip: 0,
          limit: 10
        }
      })
    } else {
      this.pagination.page = Number(this.$route.query.skip) + 1
      this.pagination.rowsPerPage = Number(this.$route.query.limit)
      this.getUsersByPgination()
    }
    this.getGroupList()
  }
})
</script>
<style scoped>
  .my-card {
    width: 500px;
    margin: 100%;
  }
</style>
