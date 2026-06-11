<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { NButton, NPopconfirm, NSwitch, NTag } from 'naive-ui'
// hooks
import { useDeleteUserMutation } from '@/data/user.ts'
// utils
import { renderIcon, formatDate } from '@/utils'
// types
import type { Category, User } from '@/types'
// hooks
import { useModalStore } from '@/store/modal'
// components
import UserCreateUpdateModal from './UserCreateUpdateModal.vue'
import QueryBarItem from '../query-bar/QueryBarItem.vue'
import QueryBar from '../query-bar/QueryBar.vue'

// Define props
const props = defineProps<{
  loading: boolean
  tableData: User[]
  paginatorInfo: any
  page: number
  pageSize: number
}>()
const modal = useModalStore()

const searchValue = ref('')
const emailValue = ref('')

// mutation
const { mutateAsync: deleteUser } = useDeleteUserMutation()

function onEdit(user: User) {
  modal.open(UserCreateUpdateModal, {
    title: 'Edit User',
    props: {
      user,
    },
  })
}

async function deleteRow(row: Category) {
  await deleteUser({ id: row.id })
}

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'search', value: { username: string; email: string }): void
  (e: 'reset'): void
}>()

// Update handleSearch to emit both values
function handleSearch() {
  emit('search', { username: searchValue.value, email: emailValue.value })
}

function handleReset() {
  searchValue.value = ''
  emailValue.value = ''
  emit('reset')
}

const pagination = computed(() => ({
  page: props.page,
  pageSize: props.pageSize,
  itemCount: props.paginatorInfo?.total ?? 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onUpdatePage: (page: number) => {
    emit('update:page', page)
  },
  onUpdatePageSize: (pageSize: number) => {
    emit('update:pageSize', pageSize)
  },
}))

const columns = [
  {
    title: 'Username',
    key: 'username',
    width: 60,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Email',
    key: 'email',
    width: 60,
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: 'Role',
    key: 'role',
    width: 60,
    align: 'center',
    render(row: User) {
      const roles = row.roles ?? []
      const group = []
      for (let i = 0; i < roles.length; i++)
        group.push(
          h(NTag, { type: 'info', style: { margin: '2px 3px' } }, { default: () => roles[i].name }),
        )
      return h('span', group)
    },
  },
  {
    title: 'Super user',
    key: 'is_superuser',
    align: 'center',
    width: 40,
    render(row: User) {
      return h(
        NTag,
        { type: 'info', style: { margin: '2px 3px' } },
        { default: () => (row.is_superuser ? 'yes' : 'no') },
      )
    },
  },
  {
    title: 'Last login time',
    key: 'last_login',
    align: 'center',
    width: 80,
    ellipsis: { tooltip: true },
    render(row: User) {
      return h(
        NButton,
        { size: 'small', type: 'text', ghost: true },
        {
          default: () => (row.last_login !== null ? formatDate(row.last_login) : null),
          icon: renderIcon('mdi:update', { size: 16 }),
        },
      )
    },
  },
  {
    title: 'Is active',
    key: 'is_active',
    width: 50,
    align: 'center',
    render(row: User) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.is_active,
        // loading: !!row.publishing,
        checkedValue: false,
        uncheckedValue: true,
        // onUpdateValue: () => handleUpdateDisable(row),
      })
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    align: 'center',
    fixed: 'right',
    render(row: any) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-right: 8px;',
            onClick: () => onEdit(row),
          },
          { default: () => 'Edit', icon: renderIcon('material-symbols:edit', { size: 16 }) },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => deleteRow(row),
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  style: 'margin-right: 8px;',
                },
                {
                  default: () => 'Delete',
                  icon: renderIcon('material-symbols:delete-outline', { size: 16 }),
                },
              ),
            default: () => 'Are you sure?',
          },
        ),
      ]
    },
  },
]
</script>

<template>
  <query-bar mb-30 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
    <query-bar-item label="Username" :label-width="100">
      <n-input
        v-model:value="searchValue"
        clearable
        type="text"
        placeholder="Please enter your username"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <query-bar-item label="Email" :label-width="40">
      <NInput
        v-model:value="emailValue"
        clearable
        type="text"
        placeholder="Please enter your email"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
  </query-bar>

  <n-data-table
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginatorInfo ? pagination : true"
    remote
  />
</template>
