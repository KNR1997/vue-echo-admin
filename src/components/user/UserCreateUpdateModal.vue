<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
// types
import type { User } from '@/types'
import { useCreateUserMutation, useUpdateUserMutation } from '@/data/user'
import { useRolesQuery } from '@/data/role'
import { useDepartmentsQuery } from '@/data/department'

const props = defineProps<{
  user?: User | null
}>()

const modal = useModalStore()

// query
const { roles, paginationInfo, loading } = useRolesQuery({
  page: 1,
  page_size: 20,
})
const { departments } = useDepartmentsQuery({
  page: 1,
  page_size: 20,
})

// mutations
const { mutateAsync: createUser, isPending: creating } = useCreateUserMutation()
const { mutateAsync: updateUser, isPending: updating } = useUpdateUserMutation()

// Check if it's edit mode
const isEditMode = computed(() => !!props.user)

const modalFormRef = ref()
const modalForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  is_superuser: false,
  is_active: false,
  role_ids: [],
  dept_id: '',
})

watch(
  () => props.user,
  (user) => {
    if (!user) {
      // create mode
      modalForm.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        is_superuser: false,
        is_active: false,
        role_ids: [],
        dept_id: '',
      }
      return
    }

    // edit mode
    modalForm.value = {
      username: user.username,
      email: user.email,
      role_ids: user.roles.map((role) => role.id),
      is_superuser: user.is_superuser,
      is_active: user.is_active,
      dept_id: user.department.id,
    }
  },
  { immediate: true },
)

const validationRules = {
  username: [{ required: true, message: 'Username is required', trigger: ['blur'] }],
  email: [{ required: true, message: 'Email is required', trigger: ['blur'] }],
}

async function handleSave() {
  modalFormRef.value?.validate(async (errors: Error) => {
    if (errors) return
    // Convert reactive proxy to raw object
    const rawForm = toRaw(modalForm.value)

    const data = {
      username: rawForm.username,
      email: rawForm.email,
      // confirmPassword: rawForm.confirmPassword,
      is_superuser: rawForm.is_superuser,
      is_active: rawForm.is_active,
      role_ids: rawForm.role_ids,
      dept_id: rawForm.dept_id,
    }
    console.log('data-------------: ', data)
    if (props.user) {
      await updateUser({
        id: props.user.id,
        ...data,
      })
    } else {
      await createUser({
        password: rawForm.password,
        ...data,
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
      <NFormItem label="Username" path="username">
        <NInput v-model:value="modalForm.username" />
      </NFormItem>
      <NFormItem label="Email" path="email">
        <NInput v-model:value="modalForm.email" />
      </NFormItem>
      <template v-if="!isEditMode">
        <NFormItem label="Password" path="password">
          <NInput
            v-model:value="modalForm.password"
            show-password-on="mousedown"
            type="password"
            clearable
            placeholder="Please enter password"
          />
        </NFormItem>
        <NFormItem label="Confirm Password" path="confirmPassword">
          <NInput
            v-model:value="modalForm.confirmPassword"
            show-password-on="mousedown"
            type="password"
            clearable
            placeholder="Please confirm password"
          />
        </NFormItem>
      </template>
      <NFormItem label="Role" path="role_ids">
        <NCheckboxGroup v-model:value="modalForm.role_ids">
          <NSpace item-style="display: flex;">
            <NCheckbox v-for="item in roles" :key="item.id" :value="item.id" :label="item.name" />
          </NSpace>
        </NCheckboxGroup>
      </NFormItem>
      <NFormItem label="Super User" path="is_superuser">
        <NSwitch
          v-model:value="modalForm.is_superuser"
          size="small"
          :checked-value="true"
          :unchecked-value="false"
        ></NSwitch>
      </NFormItem>
      <NFormItem label="Is Active" path="is_active">
        <NSwitch
          v-model:value="modalForm.is_active"
          :checked-value="false"
          :unchecked-value="true"
          :default-value="true"
        />
      </NFormItem>
      <NFormItem label="Department" path="dept_id">
        <NTreeSelect
          v-model:value="modalForm.dept_id"
          :options="departments"
          key-field="id"
          label-field="name"
          placeholder="Please select a department"
          clearable
          default-expand-all
        ></NTreeSelect>
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
