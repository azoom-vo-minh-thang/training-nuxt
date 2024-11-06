<script setup lang="ts">
import type { LoadMoreProps, Message } from '@/types'

import { DEFAULT_PAGE } from '@/config'

definePageMeta({
  auth: true
})

const { $services, $socket } = useNuxtApp()
const { showLoading, hideLoading } = useAppStore()

const content = ref('')
const messages = ref([] as Message[])
const page = ref(DEFAULT_PAGE)
const totalPage = ref(0)
const scrollComponent = ref()
const loading = ref(false)

const scrollToBottom = () => {
  scrollComponent.value?.$el.scrollTo({
    top: scrollComponent.value?.$el.scrollHeight,
    behavior: 'instant'
  })
}

const fetchMessages = (page: number = DEFAULT_PAGE) => {
  return $services.message.index({ page })
}

const hasLoadMore = computed(() => {
  return page.value < totalPage.value
})

useLazyAsyncData(async () => {
  showLoading()
  const messagesResponse = await fetchMessages()

  messages.value = messagesResponse.data as Message[]
  totalPage.value = messagesResponse.pagination.totalPages

  hideLoading()

  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(() => {
  $socket.on('new_message', (message: Message) => {
    messages.value = [...messages.value, message]

    nextTick(() => {
      scrollToBottom()
    })
  })
})

const sendMessage = (async () => {
  if (!content.value || loading.value) {
    return
  }

  loading.value = true
  await createMessage({ content: content.value })

  setTimeout(() => {
    loading.value = false
  }, 500)
})

const createMessage = async (message: Partial<Message>) => {
  await $services.message.create(message)

  content.value = ''

  nextTick(() => {
    scrollToBottom()
  })
}

const loadMore = async ({ done }: LoadMoreProps) => {
  if (!hasLoadMore.value) {
    done('ok')
    return
  }

  page.value += 1

  const messagesResponse = await fetchMessages(page.value)

  if (messagesResponse.data.length === 0) {
    done('empty')
    return
  }

  messages.value = [...(messagesResponse.data as Message[]), ...messages.value]

  done('ok')

  nextTick(() => {
    if (scrollComponent.value && scrollComponent.value.$el) {
      scrollToBottom()
    }
  })
}
</script>

<template>
  <div class="group-chat">
    <v-infinite-scroll
      ref="scrollComponent"
      height="calc(100vh - 200px)"
      side="start"
      class="list"
      @load="loadMore"
    >
    <template #loading>
      <app-loading-spinner v-if="hasLoadMore" color="primary" size="40" class="loading-spinner" />
    </template>
      <app-message
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </v-infinite-scroll>

    <div class="chat">
      <textarea
        v-model="content"
        rows="3"
        placeholder="Type a message..."
        class="input"
        @keydown.enter.prevent="sendMessage"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-chat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  > .list {
    gap: 10px;
    margin-right: -1rem;
    padding-right: 1rem;
  }
  > .chat {
    margin: auto auto 0;
    width: 80%;
  }
  > .chat > .input {
    width: 100%;
    padding: 15px;
    font-size: 0.75rem;
    border: 1px solid theme-color('gray5');
    border-radius: 1rem;
    resize: none;
    &:focus {
      outline: none;
      border-color: theme-color('primary');
    }
  }
}
</style>
