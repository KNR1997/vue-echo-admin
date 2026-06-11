<script setup lang="ts">
import { ref } from 'vue'
import { NButton } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
// components
import TheIcon from '@/components/icon/TheIcon.vue'
import CommonPage from '@/components/page/CommonPage.vue'
import { useMenusQuery } from '@/data/menu'
import MenuList from '@/components/menu/MenuList.vue'
import MenuModal from '@/components/menu/MenuModal.vue'

const page = ref(1)
const pageSize = ref(10)

// query
const { menus, paginationInfo, loading } = useMenusQuery({
  page,
  page_size: pageSize,
})

// store hooks
const modal = useModalStore()

function openCreateModal() {
  modal.open(MenuModal, {
    title: 'Create Menu',
  })
}
</script>

<template>
  <CommonPage show-footer title="Menu List">
    <template #action>
      <div>
        <NButton class="float-right mr-15" type="primary" @click="openCreateModal">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create new
        </NButton>
      </div>
    </template>
    <MenuList
      :loading="loading"
      :table-data="menus"
      :paginatorInfo="paginationInfo"
      :page="page"
      :page-size="pageSize"
      @update:page="page = $event"
      @update:page-size="pageSize = $event"
    />
  </CommonPage>
</template>
