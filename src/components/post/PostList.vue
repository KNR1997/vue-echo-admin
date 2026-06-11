<script setup lang="ts">
import { computed, h } from 'vue'
import { NButton, NPopconfirm } from 'naive-ui'
// hooks
import { useDeletePostMutation } from '@/data/post'
// utils
import { renderIcon } from '@/utils'
// types
import type { Post } from '@/types'
// hooks
import { useModalStore } from '@/store/modal'
// components
import PostModal from './PostModal.vue'

// Define props
const props = defineProps<{
  loading: boolean
  tableData: Post[]
  paginatorInfo: any
  page: number
  pageSize: number
}>()
const modal = useModalStore()

// mutation
const { mutateAsync: deletePost } = useDeletePostMutation()

function onEdit(post: Post) {
  modal.open(PostModal, {
    title: 'Edit Post',
    props: {
      post,
    },
  })
}

async function deleteRow(row: any) {
  await deletePost({ id: row.id })
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
  {
    title: 'Title',
    key: 'title',
    width: 150,
  },
  {
    title: 'Content',
    key: 'content',
    ellipsis: true,
    width: 250,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    render(row: any) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            class: 'mr-5',
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
