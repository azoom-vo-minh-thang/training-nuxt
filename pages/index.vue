<script setup lang="ts">
import { LOCAL_STORAGE_KEY } from '@/config'

const token = useCookie(LOCAL_STORAGE_KEY.TOKEN)

const { fetchUser } = useAuthStore()

definePageMeta({
  auth: true
})

watch(token, () => {
  if (token.value) {
    fetchUser()
  }
})
</script>

<template>
  <div>
    <h1>Home Page</h1>
  </div>
</template>

<style lang="scss" scoped>
</style>
