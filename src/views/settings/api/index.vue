<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
// hooks
import { useApisQuery } from "@/data/api";
import { useModalStore } from "@/store/modal";
// components
import ApiList from "@/components/api/ApiList.vue";
import TheIcon from "@/components/icon/TheIcon.vue";
import ApiModal from "@/components/api/ApiModal.vue";
import CommonPage from "@/components/page/CommonPage.vue";

const page = ref(1);
const pageSize = ref(10);
const searchName = ref("");
const searchTags = ref("");

// query
const { apis, paginationInfo, loading } = useApisQuery({
  page,
  page_size: pageSize,
  path: searchName,
  tags: searchTags,
});

// store hooks
const modal = useModalStore();

// open modal for create new
function openCreateModal() {
  modal.open(ApiModal, {
    title: "Create Api",
  });
}

// Add debounce to prevent too many API calls
let searchTimeout: ReturnType<typeof setTimeout>;

// Handle search from child component
function handleSearch(filters: { path: string; tags: string }) {
  // Clear previous timeout
  if (searchTimeout) clearTimeout(searchTimeout);

  // Debounce search
  searchTimeout = setTimeout(() => {
    searchName.value = filters.path;
    searchTags.value = filters.tags;
    page.value = 1; // Reset to first page on search
  }, 500);
}

// Handle reset
function handleReset() {
  searchName.value = "";
  searchTags.value = "";
  page.value = 1;
}
</script>

<template>
  <CommonPage show-footer title="Api List">
    <template #action>
      <div>
        <NButton
          class="float-right mr-15"
          type="primary"
          @click="openCreateModal"
        >
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" />Create
          new
        </NButton>
      </div>
    </template>
    <ApiList
      :loading="loading"
      :table-data="apis"
      :paginatorInfo="paginationInfo"
      :page="page"
      :page-size="pageSize"
      @update:page="page = $event"
      @update:page-size="pageSize = $event"
      @search="handleSearch"
      @reset="handleReset"
    />
  </CommonPage>
</template>
