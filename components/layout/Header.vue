<script setup lang="ts">
const { $auth } = useNuxtApp();

const { user } = storeToRefs(useAuthStore());

const logout = () => {
  $auth.logout();
};
</script>

<template>
  <v-app-bar class="layout-header">
    <template #title>
      <nuxt-link
        to="/"
        class="title"
      >
        Training App
      </nuxt-link>
    </template>
    <v-spacer />
    <v-menu v-if="user">
      <template #activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          <v-icon icon="fas fa-user" />
          <span class="ml-1">{{ user.name }}</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title
            class="action"
            @click="logout"
          >
            <v-icon icon="fas fa-sign-out-alt" />
            <span class="ml-2">Logout</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style lang="scss" scoped>
.layout-header :deep(.v-toolbar__content) {
  > .v-toolbar-title > .v-toolbar-title__placeholder > .title {
    color: theme-color(primary);
    text-decoration: none;
    font-size: 25px;
    font-weight: bold;
    line-height: 1.3;
  }
}
</style>

<style lang="scss">
.v-list-item-title.action {
  cursor: pointer;
}
</style>
