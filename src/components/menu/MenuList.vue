<script setup lang="ts">
import { computed, h, KeepAlive, ref } from 'vue'
import { NButton, NPopconfirm, NSwitch, NTag } from 'naive-ui'
// hooks
import { useDeleteMenuMutation, usePatchMenuMutation } from '@/data/menu.ts'
// utils
import { formatDate, renderIcon } from '@/utils'
// types
import type { Menu } from '@/types'
// hooks
import { useModalStore } from '@/store/modal'
import MenuModal from './MenuModal.vue'
import TheIcon from '../icon/TheIcon.vue'
// components

// Define props
const props = defineProps<{
  loading: boolean
  tableData: Menu[]
  paginatorInfo: any
  page: number
  pageSize: number
}>()
const modal = useModalStore()

// mutation
const { mutateAsync: deleteMenu } = useDeleteMenuMutation()
const { mutateAsync: patchMenu } = usePatchMenuMutation()

function onEdit(menu: Menu) {
  modal.open(MenuModal, {
    title: 'Edit Menu',
    props: {
      menu,
    },
  })
}

function handleAdd(menu: Menu) {
  modal.open(MenuModal, {
    title: 'Add Menu',
    props: {
      menu: {
        menu_type: 'menu',
        parent_id: menu.id,
        keepalive: true,
      }
    },
  })
}

async function deleteRow(row: Menu) {
  await deleteMenu({ id: row.id })
}

async function handleUpdateKeepalive(row: Menu) {
  patchMenu({
    id: row.id,
    keepalive: !row.keepalive,
  })
}

async function handleUpdateHidden(row: Menu) {
  patchMenu({
    id: row.id,
    is_hidden: !row.is_hidden,
  })
}

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}>()

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
  { title: 'ID', key: 'id', width: 50, ellipsis: { tooltip: true }, align: 'center' },
  { title: 'Name', key: 'name', width: 80, ellipsis: { tooltip: true }, align: 'center' },
  {
    title: 'Menu type',
    key: 'menu_type',
    width: 80,
    align: 'center',
    ellipsis: { tooltip: true },
    render(row) {
      let round = false
      let bordered = false
      if (row.menu_type === 'catalog') {
        bordered = true
        round = false
      } else if (row.menu_type === 'menu') {
        bordered = false
        round = true
      }
      return h(
        NTag,
        { type: 'primary', round: round, bordered: bordered },
        { default: () => (row.menu_type === 'catalog' ? 'catalog' : 'menu') },
      )
    },
  },
  {
    title: 'Icon',
    key: 'icon',
    width: 40,
    align: 'center',
    render(row) {
      return h(TheIcon, { icon: row.icon, size: 20 })
    },
  },
  { title: 'Order', key: 'order', width: 40, ellipsis: { tooltip: true }, align: 'center' },
  { title: 'Path', key: 'path', width: 80, ellipsis: { tooltip: true }, align: 'center' },
  { title: 'Redirect', key: 'redirect', width: 80, ellipsis: { tooltip: true }, align: 'center' },
  { title: 'Component', key: 'component', width: 80, ellipsis: { tooltip: true }, align: 'center' },
  {
    title: 'Keep Alive',
    key: 'keepalive',
    width: 40,
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.keepalive,
        onUpdateValue: () => handleUpdateKeepalive(row),
      })
    },
  },
  {
    title: 'Is hidden',
    key: 'is_hidden',
    width: 40,
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: row.is_hidden,
        onUpdateValue: () => handleUpdateHidden(row),
      })
    },
  },
  {
    title: 'Creation',
    key: 'created_at',
    width: 80,
    align: 'center',
    render(row) {
      return h('span', formatDate(row.created_at))
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center',
    fixed: 'right',
    render(row: any) {
      return [
        h(
          NButton,
          {
            size: 'tiny',
            quaternary: true,
            type: 'primary',
            style: `display: ${row.children && row.menu_type !== 'menu' ? '' : 'none'};`,
            onClick: () => handleAdd(row),
          },
          { default: () => 'submenu', icon: renderIcon('material-symbols:add', { size: 16 }) },
        ),
        h(
          NButton,
          {
            size: 'tiny',
            quaternary: true,
            type: 'info',
            onClick: () => onEdit(row),
          },
          {
            default: () => 'Edit',
            icon: renderIcon('material-symbols:edit-outline', { size: 16 }),
          },
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
                  size: 'tiny',
                  quaternary: true,
                  type: 'error',
                  style: `display: ${row.children && row.children.length > 0 ? 'none' : ''};`, //有子菜单不允许删除
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
  <n-data-table
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginatorInfo ? pagination : true"
    remote
  />
</template>
