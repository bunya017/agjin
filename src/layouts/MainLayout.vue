<template>
  <q-layout view="hHh lpR fFf">

    <q-header bordered :class="[$q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-dark']">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          SecureNG
        </q-toolbar-title>
        <q-space />
        <q-btn
          flat
          round
          dense
          @click="$q.dark.set(!$q.dark.isActive)"
          :icon="$q.dark.isActive ? ionSunnyOutline : ionMoonOutline"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list class="q-pt-md q-px-sm">
        <q-item
          dense
          exact
          v-ripple
          clickable
          :to="link.to"
          :key="link.title"
          v-for="link in singleLinks"
          :active-class="`q-mx-md rounded-borders ${$q.dark.isActive ? 'bg-white text-dark' : 'bg-dark text-white'}`"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>{{ link.title }}</q-item-section>
        </q-item>
        <q-expansion-item
          dense
          :key="link.title"
          :icon="link.icon"
          :label="link.title"
          expand-icon="mdi-plus"
          expanded-icon="mdi-minus"
          v-for="link in nestedLinks"
          :default-opened="isExpanded[link.title]"
        >
          <q-item
            exact
            dense
            v-ripple
            clickable
            :to="child.to"
            :inset-level="0.3"
            :key="child.title"
            v-for="child in link.children"
            class="q-mx-md rounded-borders"
            :active-class="`${$q.dark.isActive ? 'bg-white text-dark' : 'bg-dark text-white'}`"
          >
            <q-item-section avatar>
              <q-icon :name="child.icon" />
            </q-item-section>

            <q-item-section>{{ child.title }}</q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item
          dense
          v-ripple
          clickable
          @click="logout"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'
import { ionMoonOutline, ionSunnyOutline } from '@quasar/extras/ionicons-v6'

import packageInfo from '../../package.json'

const SINGLELINKS = [
]
const NESTEDLINKS = [
  {
    title: 'Manage Access Control',
    icon: 'mdi-account-key',
    children: [
      {
        title: 'User Permissions',
        icon: 'mdi-account-lock-outline',
        permission: 'can_view_permission',
        to: { name: 'permission-list' }
      },
      {
        title: 'User Roles',
        icon: 'mdi-redhat',
        permission: 'can_view_role',
        to: { name: 'role-list' }
      },
      {
        title: 'User Groups',
        icon: 'mdi-account-group-outline',
        permission: 'can_view_group',
        to: { name: 'group-list' }
      }
    ]
  },
  {
    title: 'Manage Users',
    icon: 'people',
    showOpenExpansionStr: 'admin/users',
    children: [
      {
        title: 'Add New User',
        icon: 'mdi-account-plus-outline',
        permission: 'can_create_system_user',
        to: { name: 'new-user' }
      },
      {
        title: 'Users List',
        icon: 'people_outline',
        permission: 'can_list_system_users',
        to: { name: 'user-list' }
      }
    ]
  }
]

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed: {
    permissionList () {
      return LocalStorage.getItem('permissionList')
    },
    singleLinks () {
      return SINGLELINKS.filter(link => this.permissionList.indexOf(link.permission) > -1)
    },
    nestedLinks () {
      const links = []
      for (let i = 0; i < NESTEDLINKS.length; i++) {
        const LINK = NESTEDLINKS[i]
        LINK.children =  LINK.children.filter(child => this.permissionList.indexOf(child.permission) > -1)
        links.push(LINK)
      }
      return links.filter(link => link.children.length > 0)
    },
    isExpanded () {
      const model = {}
      for (let i = 0; i < this.nestedLinks.length; i++) {
        const routeNames = this.nestedLinks[i].children.map(c => c.to.name)
        model[this.nestedLinks[i].title] = routeNames.indexOf(this.$route.name) > -1
      }
      return model
    },
    packageInfoObj () {
      return packageInfo
    }
  },
  methods: {
    logout () {
      this.$q.localStorage.remove('authToken')
      this.$q.localStorage.remove('permissionList')
      this.$router.push('/login')
    }
  },
  created () {
    this.ionMoonOutline = ionMoonOutline
    this.ionSunnyOutline = ionSunnyOutline
  }
}
</script>
