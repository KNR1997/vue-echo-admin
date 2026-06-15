<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
// hooks
import { useModalStore } from "@/store/modal";
import { useDepartmentsQuery } from "@/data/department";
// components
import TheIcon from "@/components/icon/TheIcon.vue";
import CommonPage from "@/components/page/CommonPage.vue";
import DepartmentList from "@/components/department/DepartmentList.vue";
import DepartmentModal from "@/components/department/DepartmentModal.vue";

const page = ref(1);
const pageSize = ref(10);
const search = ref("");

// query
const { departments, paginationInfo, loading } = useDepartmentsQuery({
  page,
  page_size: pageSize,
  name: search,
});

// store hooks
const modal = useModalStore();

// open modal for create new
function openCreateModal() {
  modal.open(DepartmentModal, {
    title: "Create Department",
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
  <CommonPage show-footer title="Department List">
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
    <DepartmentList
      :loading="loading"
      :table-data="departments"
      :paginator-info="paginationInfo"
      :page="page"
      :page-size="pageSize"
      @update:page="page = $event"
      @update:page-size="pageSize = $event"
      @search="handleSearch"
      @reset="handleReset"
    />
  </CommonPage>
</template>
