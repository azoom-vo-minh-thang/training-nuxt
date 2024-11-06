<script setup lang="ts">
import { z } from 'zod'

import { WORKER_FUNCTION_OPTIONS } from '@/config'

definePageMeta({
  auth: 'guest'
})

const result = ref<number | undefined>()
const loadingForm1 = ref(false)

onMounted(() => {
  window.addEventListener('message', event => {
    if (event.data?.type === WORKER_FUNCTION_OPTIONS.heavyCalculation.type) {
      result.value = event.data.data as number
      loadingForm1.value = false
    }
  })
})

const {
  useFieldModel: useFieldModelForm1,
  errors: errorsForm1,
  handleSubmit: handleSubmitForm1
} = useForm({
  initialValues: {
    number: 100000000000
  },
  validationSchema: toTypedSchema(
    z.object({
      number: z.number().min(100000000000, 'Number must be at least 100000000000')
    })
  )
})

const number = useFieldModelForm1('number')

const onHeavyCalculation = handleSubmitForm1(({ number }) => {
  const data = {
    action: WORKER_FUNCTION_OPTIONS.heavyCalculation.name,
    data: number
  }
  loadingForm1.value = true
  window.dispatchEvent(new MessageEvent('message', { data }))
})
</script>

<template>
  <div class="style-guide">
    <h1 class="title">Style Guide</h1>
    <div class="content">
      <div class="wrapper">
        <div class="header">
          <h2 class="title">Heavy calculation</h2>
          <p class="description">heavy calculation is a function that takes a long time to complete</p>
        </div>
        <div class="content">
          <v-form
            class="form"
            @submit.prevent="onHeavyCalculation"
          >
            <v-text-field
              v-model.number="number"
              label="Number"
              placeholder="Enter the minimum number as 100000000000"
              type="number"
              :error-messages="errorsForm1.number"
              clearable
            />
            <h2 class="text">Result: {{ result }}</h2>
            <v-btn
              color="primary"
              size="large"
              type="submit"
              :loading="loadingForm1"
              :disabled="loadingForm1"
              rounded
              block
            >
              submit
            </v-btn>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.style-guide {
  > .title {
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    color: theme-color('primary');
  }
  > .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  > .content > .wrapper {
    border-radius: 25px;
    padding: 30px;
    border: 2px solid theme-color('primary');
    box-shadow: $box-shadow-lg;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  > .content > .wrapper > .header {
    display: flex;
    flex-direction: column;
  }
  > .content > .wrapper > .header > .title {
    font-size: 1.5rem;
    font-weight: bold;
    color: theme-color('primary');
  }
  > .content > .wrapper > .header > .description {
    color: theme-color('gray');
  }
  > .content > .wrapper > .content > .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  > .content > .wrapper > .content > .form > .text {
    font-size: 2rem;
    font-weight: bold;
    color: theme-color('primary5');
  }
}
</style>
