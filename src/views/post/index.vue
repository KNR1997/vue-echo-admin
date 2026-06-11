<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { usePostsQuery } from '@/data/post'
// components
import TheIcon from '@/components/icon/TheIcon.vue'
import PostList from '@/components/post/PostList.vue'
import PostModal from '@/components/post/PostModal.vue'
import CommonPage from '@/components/page/CommonPage.vue'

const page = ref(1)
const pageSize = ref(10)

// query
const { posts, paginationInfo, loading } = usePostsQuery({
  page,
  page_size: pageSize,
})
// store hooks
const modal = useModalStore()

function openCreateModal() {
  modal.open(PostModal, {
    title: 'Create Post',
  })
}
</script>

<template>
  <CommonPage show-footer title="Post List">
    <template #action>
      <div>
        <NButton class="float-right mr-15" type="primary" @click="openCreateModal">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create new
        </NButton>
      </div>
    </template>
    <PostList
      :loading="loading"
      :table-data="posts"
      :paginator-info="paginationInfo"
      :page="page"
      :page-size="pageSize"
      @update:page="page = $event"
      @update:page-size="pageSize = $event"
    />
  </CommonPage>
</template>
