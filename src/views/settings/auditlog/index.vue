<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
// hooks
import { useModalStore } from "@/store/modal";
import { useAuditLogsQuery } from "@/data/auditlog";
// components
import TheIcon from "@/components/icon/TheIcon.vue";
import PostModal from "@/components/post/PostModal.vue";
import CommonPage from "@/components/page/CommonPage.vue";
import AuditLogList from "@/components/auditLog/AuditLogList.vue";

const page = ref(1);
const pageSize = ref(10);
const searchUsername = ref("");
const searchModule = ref("");
const searchSummaryValue = ref("");
const searchPathValue = ref("");
const searchStatusValue = ref("");
const searchMethodValue = ref(null);

// query
const { auditLogs, paginationInfo, loading } = useAuditLogsQuery({
  page,
  page_size: pageSize,
  username: searchUsername,
  module: searchModule,
  summary: searchSummaryValue,
  path: searchPathValue,
  status: searchStatusValue,
  method: searchMethodValue,
});
// store hooks
const modal = useModalStore();

function openCreateModal() {
  modal.open(PostModal, {
    title: "Create Post",
  });
}

// Add debounce to prevent too many API calls
let searchTimeout: ReturnType<typeof setTimeout>;

// Handle search from child component
function handleSearch(filters: {
  username: string;
  module: string;
  summary: string;
  path: string;
  status: string;
  method: string;
}) {
  // Clear previous timeout
  if (searchTimeout) clearTimeout(searchTimeout);

  // Debounce search
  searchTimeout = setTimeout(() => {
    searchUsername.value = filters.username;
    searchModule.value = filters.module;
    searchSummaryValue.value = filters.summary;
    searchPathValue.value = filters.path;
    searchStatusValue.value = filters.status;
    searchMethodValue.value = filters.method;
    page.value = 1; // Reset to first page on search
  }, 500);
}

// Handle reset
function handleReset() {
  searchUsername.value = "";
  searchModule.value = "";
  searchSummaryValue.value = "";
  searchPathValue.value = "";
  searchStatusValue.value = "";
  searchMethodValue.value = null;
  page.value = 1;
}
</script>

<template>
  <CommonPage show-footer title="AuditLog List">
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
    <AuditLogList
      :loading="loading"
      :table-data="auditLogs"
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
