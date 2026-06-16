<script setup lang="ts">
import { ref, watch } from 'vue'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { useCreateRoleMutation, useUpdateRoleMutation } from '@/data/role'
// types
import type { Role } from '@/types'

const props = defineProps<{
  role?: Role | null
}>()

const modal = useModalStore()

// mutations
const { mutateAsync: createRole, isPending: creating } = useCreateRoleMutation()
const { mutateAsync: updateRole, isPending: updating } = useUpdateRoleMutation()

const modalFormRef = ref()
const modalForm = ref({
  name: '',
  description: '',
})

watch(
  () => props.role,
  (role) => {
    if (!role) {
      // create mode
      modalForm.value = {
        name: '',
        description: '',
      }
      return
    }

    // edit mode
    modalForm.value = {
      name: role.name,
      description: role.description,
    }
  },
  { immediate: true },
)

const validationRules = {
  name: [{ required: true, message: 'ROLE name is required', trigger: ['blur'] }],
}

async function handleSave() {
  modalFormRef.value?.validate(async (errors: Error) => {
    if (errors) return
    if (props.role) {
      await updateRole({
        id: props.role.id,
        name: modalForm.value.name,
        description: modalForm.value.description,
      })
    } else {
      await createRole({
        name: modalForm.value.name,
        description: modalForm.value.description,

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
      :label-width="100"
      :model="modalForm"
      :rules="validationRules"
    >
      <NFormItem label="Name" path="name">
        <NInput v-model:value="modalForm.name" clearable placeholder="Please enter ROLE name" />
      </NFormItem>
      <NFormItem label="description" path="description">
        <NInput
          v-model:value="modalForm.description"
          clearable
          placeholder="Please enter ROLE descriptionription"
        />
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
