<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
// hooks
import { useRolesQuery } from "@/data/role";
import { useModalStore } from "@/store/modal";
// components
import RoleList from "@/components/role/RoleList.vue";
import TheIcon from "@/components/icon/TheIcon.vue";
import RoleModal from "@/components/role/RoleModal.vue";
import CommonPage from "@/components/page/CommonPage.vue";

const page = ref(1);
const pageSize = ref(10);
const search = ref("");

// query
const { roles, paginationInfo, loading } = useRolesQuery({
  page,
  page_size: pageSize,
  name: search,
});

// store hooks
const modal = useModalStore();

// open modal for create new
function openCreateModal() {
  modal.open(RoleModal, {
    title: "Create Role",
  });
}

// Add debounce to prevent too many API calls
let searchTimeout: ReturnType<typeof setTimeout>;

// Handle search from child component
function handleSearch(value: string) {
  // Clear previous timeout
  if (searchTimeout) clearTimeout(searchTimeout);

  // Debounce search
  searchTimeout = setTimeout(() => {
    search.value = value;
    page.value = 1; // Reset to first page on search
  }, 500);
}

// Handle reset
function handleReset() {
  search.value = "";
  page.value = 1;
}
</script>

<template>
  <CommonPage show-footer title="Role List">
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
    <RoleList
      :loading="loading"
      :table-data="roles"
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
