<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { NForm, NFormItem, NInput, NButton, NSelect } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { useCreateMenuMutation, useMenusQuery, useUpdateMenuMutation } from '@/data/menu'
// types
import type { Menu } from '@/types'
// components
import IconPicker from '@/components/icon/IconPicker.vue'

const props = defineProps<{
  menu?: Menu | null
}>()

const modal = useModalStore()

// mutations
const { mutateAsync: createMenu, isPending: creating } = useCreateMenuMutation()
const { mutateAsync: updateMenu, isPending: updating } = useUpdateMenuMutation()

// query
const { menus, paginationInfo, loading } = useMenusQuery({
  page: 1,
  page_size: 20,
})

const menuOptions = ref([])
const modalFormRef = ref()
const modalForm = ref({
  menu_type: '',
  parent_id: 0,
  name: '',
  path: '',
  component: '',
  redirect: '',
  icon: '',
  order: '',
  is_hidden: false,
  keepalive: false,
})

onMounted(() => {
  getTreeSelect()
})

async function getTreeSelect() {
  const menu = { id: 0, name: 'root directory', children: [] }
  menu.children = menus
  menuOptions.value = [menu]
}

watch(
  () => props.menu,
  (menu) => {
    if (!menu) {
      console.log('no menu honey----------------------')
      // create mode
      modalForm.value = {
        menu_type: 'catalog',
        parent_id: 0,
        name: '',
      }
      return
    }

    // edit mode
    modalForm.value = {
      menu_type: menu.menu_type,
      parent_id: menu.parent_id,
      name: menu.name,
      path: menu.path,
      component: menu.component,
      redirect: menu.redirect,
      icon: menu.icon,
      order: menu.order,
      is_hidden: menu.is_hidden,
      keepalive: menu.keepalive,
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
    const data = {
      menu_type: modalForm.value.menu_type,
      parent_id: modalForm.value.parent_id,
      name: modalForm.value.name,
      path: modalForm.value.path,
      component: modalForm.value.component,
      redirect: modalForm.value.redirect,
      icon: modalForm.value.icon,
      order: modalForm.value.order,
      is_hidden: modalForm.value.is_hidden,
      keepalive: modalForm.value.keepalive,
    }
    if (props.menu?.id) {
      await updateMenu({
        id: props.menu.id,
        ...data,
      })
    } else {
      await createMenu({
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
      <NFormItem label="Menu Type" path="menu_type">
        <NRadioGroup v-model:value="modalForm.menu_type">
          <NRadio label="Catalog" value="catalog" />
          <NRadio label="Menu" value="menu" />
        </NRadioGroup>
      </NFormItem>
      <NFormItem label="Parent Menu" path="parent_id">
        <NTreeSelect
          v-model:value="modalForm.parent_id"
          key-field="id"
          label-field="name"
          :options="menuOptions"
          default-expand-all="true"
        />
      </NFormItem>
      <NFormItem
        label="Menu Name"
        path="name"
        :rule="{
          required: true,
          message: 'Please enter a unique menu name',
          trigger: ['input', 'blur'],
        }"
      >
        <NInput v-model:value="modalForm.name" placeholder="Please enter a unique menu name" />
      </NFormItem>
      <NFormItem
        label="Access Path"
        path="path"
        :rule="{
          required: true,
          message: 'Please enter access path',
          trigger: ['blur'],
        }"
      >
        <NInput v-model:value="modalForm.path" placeholder="Please enter access path" />
      </NFormItem>
      <NFormItem v-if="modalForm.menu_type === 'menu'" label="Component Path" path="component">
        <NInput
          v-model:value="modalForm.component"
          placeholder="Please enter component path, e.g.: /system/user"
        />
      </NFormItem>
      <NFormItem label="Redirect Path" path="redirect">
        <NInput
          v-model:value="modalForm.redirect"
          :disabled="modalForm.parent_id !== 0"
          :placeholder="
            modalForm.parent_id !== 0
              ? 'Only top-level menus can set redirect path'
              : 'Please enter redirect path'
          "
        />
      </NFormItem>
      <NFormItem label="Menu Icon" path="icon">
        <IconPicker v-model:value="modalForm.icon" />
      </NFormItem>
      <NFormItem label="Display Order" path="order">
        <NInputNumber v-model:value="modalForm.order" :min="1" />
      </NFormItem>
      <NFormItem label="Hidden" path="is_hidden">
        <NSwitch v-model:value="modalForm.is_hidden" />
      </NFormItem>
      <NFormItem label="KeepAlive" path="keepalive">
        <NSwitch v-model:value="modalForm.keepalive" />
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
