<script setup lang="ts">
import type { Message } from '@/types'

const { user } = storeToRefs(useAuthStore())

const { message } = defineProps<{
  message: Message
}>()

const isCurrentUser = computed(() => {
  return !!user.value && message.sender.id === user.value.id
})

const userName = computed(() => {
  return message.sender.name.split('')[0] || ''
})

const color = computed(() => {
  return message.sender.color
})
</script>

<template>
  <div
    :class="[
      'wrapper',
      {
        '-is-current-user': isCurrentUser
      }
    ]"
  >
    <div class="date">
      {{ formatDate(message.createdAt) }}
    </div>
    <div class="message">
      <div
        class="user"
        :style="{ backgroundColor: color }"
      >
        {{ userName }}
      </div>
      <div
        class="content"
        :style="{ backgroundColor: color }"
      >
        {{ message.content }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  > .date {
    font-size: 0.75rem;
    color: theme-color('gray');
    text-align: center;
  }
  &.-is-current-user > .message {
    justify-content: flex-end;
  }
  &.-is-current-user > .message > .user {
    order: 1;
    display: none;
  }
  &.-is-current-user > .message > .content {
    order: 0;
  }
  > .message {
    display: flex;
    align-items: flex-end;
    gap: 5px;
  }
  > .message > .user {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    text-transform: uppercase;
    color: theme-color('on-primary');
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  > .message > .content {
    padding: 10px;
    border-radius: 10px;
    font-size: 0.75rem;
    color: theme-color('on-primary');
    flex-shrink: 1;
    max-width: 70%;
  }
}
</style>
