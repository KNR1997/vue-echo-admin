<script setup lang="ts">
import { ref, watch } from 'vue'
import { NForm, NFormItem, NInput, NButton, NSelect } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { useCreateApiMutation, useUpdateApiMutation } from '@/data/api'
// types
import type { Api } from '@/types'

const props = defineProps<{
  api?: Api | null
}>()

const modal = useModalStore()

// mutations
const { mutateAsync: createApi, isPending: creating } = useCreateApiMutation()
const { mutateAsync: updateApi, isPending: updating } = useUpdateApiMutation()

const modalFormRef = ref()
const modalForm = ref({
  path: '',
  method: '',
  summary: '',
  tags: '',
})

// HTTP method options for the select dropdown
const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
]

watch(
  () => props.api,
  (api) => {
    if (!api) {
      // create mode
      modalForm.value = {
        path: '',
        method: '',
        summary: '',
        tags: '',
      }
      return
    }

    // edit mode
    modalForm.value = {
      path: api.path,
      method: api.method,
      summary: api.summary,
      tags: api.tags,
    }
  },
  { immediate: true },
)

const validationRules = {
  path: [{ required: true, message: 'API path is required', trigger: ['blur'] }],
  method: [{ required: true, message: 'Request method is required', trigger: ['blur', 'change'] }],
  summary: [{ required: true, message: 'API description is required', trigger: ['blur'] }],
  tags: [{ required: true, message: 'Tags are required', trigger: ['blur'] }],
}

async function handleSave() {
  modalFormRef.value?.validate(async (errors: Error) => {
    if (errors) return
    if (props.api) {
      await updateApi({
        id: props.api.id,
        path: modalForm.value.path,
        method: modalForm.value.method,
        summary: modalForm.value.summary,
        tags: modalForm.value.tags,
      })
    } else {
      await createApi({
        path: modalForm.value.path,
        method: modalForm.value.method,
        summary: modalForm.value.summary,
        tags: modalForm.value.tags,
      })
    }
    modal.close()
  })
}
</script>

<template>
  <div>
    <!-- FORM -->
    <NForm
      ref="modalFormRef"
      label-placement="left"
      label-align="left"
      :label-width="80"
      :model="modalForm"
      :rules="validationRules"
    >
      <NFormItem label="API Name" path="path">
        <NInput v-model:value="modalForm.path" clearable placeholder="Please enter API path" />
      </NFormItem>

      <NFormItem label="Request Method" path="method">
        <NSelect
          v-model:value="modalForm.method"
          :options="methodOptions"
          placeholder="Please select request method"
          clearable
        />
      </NFormItem>

      <NFormItem label="API Description" path="summary">
        <NInput
          v-model:value="modalForm.summary"
          clearable
          placeholder="Please enter API description"
        />
      </NFormItem>

      <NFormItem label="Tags" path="tags">
        <NInput v-model:value="modalForm.tags" clearable placeholder="Please enter tags" />
      </NFormItem>
    </NForm>

    <div flex justify-end>
      <NButton @click="modal.close">Cancel</NButton>
      <NButton type="primary" class="ml-16" :loading="creating || updating" @click="handleSave">
        Save
      </NButton>
    </div>
  </div>
</template>
