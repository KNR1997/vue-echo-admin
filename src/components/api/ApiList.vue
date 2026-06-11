<script setup lang="ts">
import { computed, h, ref } from "vue";
import { NButton, NPopconfirm } from "naive-ui";
// hooks
import { useDeleteApiMutation } from "@/data/api.ts";
// utils
import { renderIcon } from "@/utils";
// types
import type { Api, Category } from "@/types";
// hooks
import { useModalStore } from "@/store/modal";
import ApiModal from "./ApiModal.vue";
// components
import QueryBarItem from "../query-bar/QueryBarItem.vue";
import QueryBar from "../query-bar/QueryBar.vue";

// Define props
const props = defineProps<{
  loading: boolean;
  tableData: Api[];
  paginatorInfo: any;
  page: number;
  pageSize: number;
}>();
const modal = useModalStore();

const pathValue = ref("");
const tagsValue = ref("");

// mutation
const { mutateAsync: deleteApi } = useDeleteApiMutation();

function onEdit(api: Api) {
  modal.open(ApiModal, {
    title: "Edit Api",
    props: {
      api,
    },
  });
}

async function deleteRow(row: Category) {
  await deleteApi({ id: row.id });
}

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "update:pageSize", pageSize: number): void;
  (e: "search", value: { path: string; tags: string }): void;
  (e: "reset"): void;
}>();

// Update handleSearch to emit both values
function handleSearch() {
  emit("search", { path: pathValue.value, tags: tagsValue.value });
}

function handleReset() {
  pathValue.value = "";
  tagsValue.value = "";
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

const columns = [
  {
    title: "API Path",
    key: "path",
    width: "auto",
    align: "center",
    ellipsis: { tooltip: true },
  },
  {
    title: "Request Method",
    key: "method",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
  {
    title: "API Description ",
    key: "summary",
    align: "center",
    width: "auto",
    ellipsis: { tooltip: true },
  },
    {
    title: 'Tags',
    key: 'tags',
    width: 'auto',
    align: 'center',
    ellipsis: { tooltip: true },
  },
  {
    title: "Actions",
    key: "actions",
    width: "auto",
    align: "center",
    fixed: "right",
    render(row: any) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            style: "margin-left: 8px;",
            onClick: () => onEdit(row),
          },
          {
            default: () => "Edit",
            icon: renderIcon("material-symbols:edit", { size: 16 }),
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
                  size: "small",
                  type: "error",
                  style: "margin-left: 8px;",
                },
                {
                  default: () => "Delete",
                  icon: renderIcon("material-symbols:delete-outline", {
                    size: 16,
                  }),
                },
              ),
            default: () => "Are you sure?",
          },
        ),
      ];
    },
  },
];
</script>

<template>
  <query-bar mb-30 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
    <query-bar-item label="Path" :label-width="40">
      <n-input
        v-model:value="pathValue"
        clearable
        type="text"
        placeholder="Please enter API path"
        @keypress.enter="handleSearch"
      />
    </query-bar-item>
    <!-- <query-bar-item label="Email" :label-width="40">
      <NInput
        v-model:value="emailValue"
        clearable
        type="text"
        placeholder="Please enter API introduction"
        @keypress.enter="handleSearch"
      />
    </query-bar-item> -->
    <query-bar-item label="Tags" :label-width="40">
      <NInput
        v-model:value="tagsValue"
        clearable
        type="text"
        placeholder="Please enter the API module"
        @keypress.enter="handleSearch"
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
