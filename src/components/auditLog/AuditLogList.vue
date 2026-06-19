<script setup lang="ts">
import { computed, h, ref } from "vue";
import {  NDatePicker, NPopover, NSelect } from "naive-ui";
// utils
import { formatDateTime } from "@/utils";
// types
import type { AuditLog } from "@/types";
// components
import TheIcon from "@/components/icon/TheIcon.vue";

// Define props
const props = defineProps<{
  loading: boolean;
  tableData: AuditLog[];
  paginatorInfo: any;
  page: number;
  pageSize: number;
}>();

const searchValue = ref("");
const usernameValue = ref("");
const moduleValue = ref("");
const summaryValue = ref("");
const pathValue = ref("");
const statusValue = ref("");
const methodValue = ref(null);

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "update:pageSize", pageSize: number): void;
  (
    e: "search",
    value: {
      username: string;
      module: string;
      summary: string;
      path: string;
      status: string;
      method: string;
    },
  ): void;
  (e: "reset"): void;
}>();

function handleSearch() {
  emit("search", {
    username: usernameValue.value,
    module: moduleValue.value,
    summary: summaryValue.value,
    path: pathValue.value,
    status: statusValue.value,
    method: methodValue.value,
  });
}

function handleReset() {
  searchValue.value = "";
  usernameValue.value = "";
  moduleValue.value = "";
  summaryValue.value = "";
  pathValue.value = "";
  statusValue.value = "";
  methodValue.value = null;
  emit("reset");
}

const pagination = computed(() => ({
  page: props.page,
  pageSize: props.pageSize,
  itemCount: props.paginatorInfo?.total ?? 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onUpdatePage: (page: number) => {
    emit("update:page", page);
  },
  onUpdatePageSize: (pageSize: number) => {
    emit("update:pageSize", pageSize);
  },
}));

// 获取当天的开始时间的时间戳
function getStartOfDayTimestamp() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // 将小时、分钟、秒和毫秒都设置为0
  return now.getTime();
}

// 获取当天的结束时间的时间戳
function getEndOfDayTimestamp() {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // 将小时设置为23，分钟设置为59，秒设置为59，毫秒设置为999
  return now.getTime();
}

const startOfDayTimestamp = getStartOfDayTimestamp();
const endOfDayTimestamp = getEndOfDayTimestamp();

const datetimeRange = ref([startOfDayTimestamp, endOfDayTimestamp]);

const methodOptions = [
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
];

function formatJSON(data) {
  try {
    return typeof data === "string"
      ? JSON.stringify(JSON.parse(data), null, 2)
      : JSON.stringify(data, null, 2);
  } catch (e) {
    return data || "无数据";
  }
}

const columns = [
  {
    title: "Username",
    key: "username",
    width: "auto",
    align: "center",
    ellipsis: { tooltip: true },
  },
  {
    title: "Summary",
    key: "summary",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "Module",
    key: "module",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "Method",
    key: "method",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "Path",
    key: "path",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "Status",
    key: "status",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "Req.",
    key: "request_body",
    align: "center",
    width: 80,
    render: (row: AuditLog) => {
      return h(
        NPopover,
        {
          trigger: "hover",
          placement: "right",
        },
        {
          trigger: () =>
            h("div", { style: "cursor: pointer;" }, [
              h(TheIcon, { icon: "carbon:data-view" }),
            ]),
          default: () =>
            h(
              "pre",
              {
                style:
                  "max-height: 400px; overflow: auto; padding: 8px; border-radius: 4px;",
              },
              formatJSON(row.request_body),
            ),
        },
      );
    },
  },
  {
    title: "Res.",
    key: "response_body",
    align: "center",
    width: 80,
    render: (row: AuditLog) => {
      return h(
        NPopover,
        {
          trigger: "hover",
          placement: "right",
        },
        {
          trigger: () =>
            h("div", { style: "cursor: pointer;" }, [
              h(TheIcon, { icon: "carbon:data-view" }),
            ]),
          default: () =>
            h(
              "pre",
              {
                style:
                  "max-height: 400px; overflow: auto; padding: 8px; border-radius: 4px;",
              },
              formatJSON(row.response_body),
            ),
        },
      );
    },
  },
  {
    title: "Response Time(s)",
    key: "response_time",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "Creation",
    key: "created_at",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
    render(row) {
      return h("span", formatDateTime(row.created_at));
    },
  },
];
</script>

<template>
  <query-bar mb-30 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
    <query-bar-item label="Username" :label-width="70">
      <n-input
        v-model:value="usernameValue"
        clearable
        type="text"
        placeholder="Please enter username"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <query-bar-item label="Module" :label-width="70">
      <n-input
        v-model:value="moduleValue"
        clearable
        type="text"
        placeholder="Please enter the function module"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <query-bar-item label="Summary" :label-width="70">
      <n-input
        v-model:value="summaryValue"
        clearable
        type="text"
        placeholder="Please enter the interface summary"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <query-bar-item label="Method" :label-width="70">
      <n-select
        v-model:value="methodValue"
        style="width: 180px"
        :options="methodOptions"
        clearable
        placeholder="Please select a request method"
      />
    </query-bar-item>
    <query-bar-item label="Path" :label-width="70">
      <n-input
        v-model:value="pathValue"
        clearable
        type="text"
        placeholder="Please enter the request path"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <query-bar-item label="Status" :label-width="60">
      <n-input
        v-model:value="statusValue"
        clearable
        type="text"
        placeholder="Please enter status code"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <query-bar-item label="Operating time" :label-width="70">
      <n-date-picker
        v-model:value="searchValue"
        type="datetimerange"
        clearable
        placeholder="Please select a time range"
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
