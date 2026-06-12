components
<script setup lang="ts">
import { computed, h, ref } from "vue";
import { NButton, NPopconfirm, NTag } from "naive-ui";
// hooks
import { useMenusQuery } from "@/data/menu.ts";
// utils
import { formatDate, renderIcon } from "@/utils";
// types
import type { Role, Category, Api } from "@/types";
// hooks
import { useApisQuery } from "@/data/api.ts";
import { useModalStore } from "@/store/modal";
import {
  useAuthorizeRoleMutation,
  useDeleteRoleMutation,
} from "@/data/role.ts";
// components
import RoleModal from "./RoleModal.vue";
import QueryBarItem from "../query-bar/QueryBarItem.vue";
import QueryBar from "../query-bar/QueryBar.vue";

// Define props
const props = defineProps<{
  loading: boolean;
  tableData: Role[];
  paginatorInfo: any;
  page: number;
  pageSize: number;
}>();
const modal = useModalStore();

const searchValue = ref("");
const active = ref(false);
const pattern = ref("");
const apiTree = ref([])

// Store selected role ID and menu IDs
const selectedRole = ref<Role | null>(null);
const selectedMenuIds = ref<number[]>([]);
const selectedApiIds = ref<string[]>([]);

// query
const {
  menus: menuOption,
  paginationInfo,
  loading,
} = useMenusQuery({
  page: 1,
  page_size: 20,
});
const { apis: apiOption } = useApisQuery({
  page: 1,
  page_size: 20,
});

// mutation
const { mutateAsync: deleteRole } = useDeleteRoleMutation();
const { mutateAsync: authorizeRole } = useAuthorizeRoleMutation();

// Computed tree data
const apiTreeData = computed(() => {
  if (!apiOption.value || apiOption.value.length === 0) return [];
  return buildApiTree(apiOption.value);
});

function onEdit(role: Role) {
  modal.open(RoleModal, {
    title: "Edit Role",
    props: {
      role,
    },
  });
}

async function deleteRow(row: Category) {
  await deleteRole({ id: row.id });
}

const emit = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "update:pageSize", pageSize: number): void;
  (e: "search", value: string): void;
  (e: "reset"): void;
}>();

function handleSearch() {
  emit("search", searchValue.value);
}

function handleReset() {
  searchValue.value = "";
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

function openPermissionsDrawer(role: Role) {
  selectedRole.value = role;
  // Extract menu IDs from the role's menus (if they exist)
  selectedMenuIds.value = role.menu_ids?.map((menu) => menu) ?? [];
  selectedApiIds.value = role.apis?.map(
    (v) => v.method.toLowerCase() + v.path) ?? [];
  active.value = true;
}

function buildApiTree(data) {
  // role.api_ids like [1, 3, 5]
  const processedData = []
  const groupedData = {}

  data.forEach((item) => {
    const tags = item['tags']
    const pathParts = item['path'].split('/')
    const path = pathParts.slice(0, -1).join('/')
    const summary = tags.charAt(0).toUpperCase() + tags.slice(1)
    const unique_id = item['method'].toLowerCase() + item['path']
    if (!(path in groupedData)) {
      groupedData[path] = { unique_id: path, path: path, summary: summary, children: [] }
    }

    groupedData[path].children.push({
      id: item['id'],
      path: item['path'],
      method: item['method'],
      summary: item['summary'],
      unique_id: unique_id,
    })
  })
  processedData.push(...Object.values(groupedData))
  return processedData
}

const columns = [
  {
    title: "Name",
    key: "name",
    width: 80,
    align: "center",
    ellipsis: { tooltip: true },
    render(row: Role) {
      return h(NTag, { type: "info" }, { default: () => row.name });
    },
  },
  {
    title: "Description ",
    key: "desc",
    width: 80,
    align: "center",
  },
  {
    title: "CreatedAt",
    key: "created_at",
    width: 60,
    align: "center",
    render(row: Role) {
      return h("span", formatDate(row.created_at));
    },
  },
  {
    title: "Actions",
    key: "actions",
    width: 80,
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
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            style: "margin-left: 8px;",
            onClick: () => openPermissionsDrawer(row),
          },
          {
            default: () => "Set permissions",
            icon: renderIcon("material-symbols:edit-outline", { size: 16 }),
          },
        ),
      ];
    },
  },
];

async function updateRoleAuthorized() {
  if (!selectedRole.value) return;
  const checkData = apiTree.value.getCheckedData()
  const apiInfos = []
  checkData &&
    checkData.options.forEach((item) => {
      if (!item.children) {
        apiInfos.push(item.id)
      }
    })

  try {
    await authorizeRole({
      id: selectedRole.value.id,
      menu_ids: selectedMenuIds.value,
      api_ids: apiInfos,
    });
    active.value = false;
    // Optionally show success message
  } catch (error) {
    console.error("Error updating permissions:", error);
  }
}

// You'll need to add apiOption if you're using API permissions
// const apiOption = ref([]); // Add this if you're implementing API permissions
</script>

<template>
  <QueryBar mb-30 @search="handleSearch" @reset="handleReset">
    <slot name="queryBar" />
    <QueryBarItem label="Name" :label-width="80">
      <NInput
        v-model:value="searchValue"
        clearable
        type="text"
        placeholder="Please enter a role name"
        @keypress.enter="handleSearch"
      />
    </QueryBarItem>
  </QueryBar>

  <n-data-table
    :loading="loading"
    :columns="columns"
    :data="tableData"
    :pagination="paginatorInfo ? pagination : true"
    remote
  />
  <NDrawer v-model:show="active" placement="right" :width="500"
    ><NDrawerContent>
      <NGrid x-gap="24" cols="12">
        <NGi span="8">
          <NInput
            v-model:value="pattern"
            type="text"
            placeholder="filter"
            style="flex-grow: 1"
          ></NInput>
        </NGi>
        <NGi offset="2">
          <NButton
            v-permission="'post/api/v1/role/authorized'"
            type="info"
            @click="updateRoleAuthorized"
            >Sure</NButton
          >
        </NGi>
      </NGrid>
      <NTabs>
        <NTabPane name="menu" tab="Menu permissions" display-directive="show">
          <!-- TODO：级联 -->
          <NTree
            :data="menuOption"
            :checked-keys="selectedMenuIds"
            :pattern="pattern"
            :show-irrelevant-nodes="false"
            key-field="id"
            label-field="name"
            checkable
            :default-expand-all="true"
            :block-line="true"
            :selectable="false"
            @update:checked-keys="(v) => (selectedMenuIds = v)"
          />
        </NTabPane>
        <NTabPane
          name="resource"
          tab="Api permissions"
          display-directive="show"
        >
          <NTree
            ref="apiTree"
            :data="apiTreeData"
            :checked-keys="selectedApiIds"
            :pattern="pattern"
            :show-irrelevant-nodes="false"
            key-field="unique_id"
            label-field="summary"
            checkable
            :default-expand-all="true"
            :block-line="true"
            :selectable="false"
            cascade
            @update:checked-keys="(v) => (selectedApiIds = v)"
          />
        </NTabPane>
      </NTabs>
      <template #header> Set permissions </template>
    </NDrawerContent>
  </NDrawer>
</template>
