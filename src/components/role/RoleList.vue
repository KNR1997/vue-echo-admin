components
<script setup lang="ts">
import { computed, h, ref, withDirectives } from 'vue'
import { NButton, NPopconfirm, NTag } from 'naive-ui'
// hooks
import { useDeleteDepartmentMutation } from '@/data/department'
// utils
import { formatDate, renderIcon } from '@/utils'
// types
import type { Role, Category, Department } from '@/types'
// hooks
import { useModalStore } from '@/store/modal'
import { useDeleteRoleMutation } from '@/data/role.ts'
// components
import RoleModal from './RoleModal.vue'
import QueryBarItem from '../query-bar/QueryBarItem.vue'
import QueryBar from '../query-bar/QueryBar.vue'

// Define props
const props = defineProps<{
  loading: boolean
  tableData: Role[]
  paginatorInfo: any
  page: number
  pageSize: number
}>()
const modal = useModalStore()

const searchValue = ref('')
const active = ref(false)

// mutation
const { mutateAsync: deleteRole } = useDeleteRoleMutation()

function onEdit(role: Role) {
  modal.open(RoleModal, {
    title: 'Edit Role',
    props: {
      role,
    },
  })
}

async function deleteRow(row: Category) {
  await deleteRole({ id: row.id })
}

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
  (e: 'search', value: string): void
  (e: 'reset'): void
}>()

function handleSearch() {
  emit('search', searchValue.value)
}

function handleReset() {
  searchValue.value = ''
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
    title: 'Name',
    key: 'name',
    width: 80,
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {
      return h(NTag, { type: 'info' }, { default: () => row.name })
    },
  },
  {
    title: 'Description ',
    key: 'desc',
    width: 80,
    align: 'center',
  },
  {
    title: 'CreatedAt',
    key: 'created_at',
    width: 60,
    align: 'center',
    render(row) {
      return h('span', formatDate(row.created_at))
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
            style: 'margin-left: 8px;',
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
                  style: 'margin-left: 8px;',
                },
                {
                  default: () => 'Delete',
                  icon: renderIcon('material-symbols:delete-outline', { size: 16 }),
                },
              ),
            default: () => 'Are you sure?',
          },
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 8px;',
            onClick: async () => {
              try {
                // 使用 Promise.all 来同时发送所有请求
                // const [menusResponse, apisResponse, roleAuthorizedResponse] = await Promise.all([
                //   api.getMenus({ page: 1, page_size: 9999 }),
                //   api.getApis({ page: 1, page_size: 9999 }),
                //   api.getRoleAuthorized({ id: row.id }),
                // ])
                // // 处理每个请求的响应
                // menuOption.value = menusResponse.data
                // apiOption.value = buildApiTree(apisResponse.data)
                // menu_ids.value = roleAuthorizedResponse.data.menus.map((v) => v.id)
                // api_ids.value = roleAuthorizedResponse.data.apis.map(
                //   (v) => v.method.toLowerCase() + v.path
                // )
                active.value = true
                // role_id.value = row.id
              } catch (error) {
                // 错误处理
                console.error('Error loading data:', error)
              }
            },
          },
          {
            default: () => 'Set permissions',
            icon: renderIcon('material-symbols:edit-outline', { size: 16 }),
          },
        ),
      ]
    },
  },
]
</script>

<template>
  <QueryBar mb-30 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
    <QueryBarItem label="Name" :label-width="80">
      <NInput
        v-model:value="searchValue"
        clearable
        type="text"
        placeholder="Please enter a role name"
        @keypress.enter="handleSearch"
      />
    </QueryBarItem>
  </QueryBar>

  <n-data-table
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginatorInfo ? pagination : true"
    remote
  />
  <NDrawer v-model:show="active" placement="right" :width="500"
    ><NDrawerContent>
      <NGrid x-gap="24" cols="12">
        <NGi span="8">
          <NInput
            v-model:value="pattern"
            type="text"
            placeholder="filter"
            style="flex-grow: 1"
          ></NInput>
        </NGi>
        <NGi offset="2">
          <NButton
            v-permission="'post/api/v1/role/authorized'"
            type="info"
            @click="updateRoleAuthorized"
            >Sure</NButton
          >
        </NGi>
      </NGrid>
      <NTabs>
        <NTabPane name="menu" tab="Menu permissions" display-directive="show">
          <!-- TODO：级联 -->
          <NTree
            :data="menuOption"
            :checked-keys="menu_ids"
            :pattern="pattern"
            :show-irrelevant-nodes="false"
            key-field="id"
            label-field="name"
            checkable
            :default-expand-all="true"
            :block-line="true"
            :selectable="false"
            @update:checked-keys="(v) => (menu_ids = v)"
          />
        </NTabPane>
        <NTabPane name="resource" tab="Interface permissions" display-directive="show">
          <NTree
            ref="apiTree"
            :data="apiOption"
            :checked-keys="api_ids"
            :pattern="pattern"
            :show-irrelevant-nodes="false"
            key-field="unique_id"
            label-field="summary"
            checkable
            :default-expand-all="true"
            :block-line="true"
            :selectable="false"
            cascade
            @update:checked-keys="(v) => (api_ids = v)"
          />
        </NTabPane>
      </NTabs>
      <template #header> Set permissions </template>
    </NDrawerContent>
  </NDrawer>
</template>
