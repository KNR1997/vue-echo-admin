<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { isExternal, renderCustomIcon, renderIcon } from "@/utils";
import { useRoute, useRouter } from "vue-router";
import { usePermissionStore } from "@/store/modules/permission";
import { useAppStore } from "@/store";

// type MenuOption = {
//   key: string
//   path?: string
//   children?: MenuOption[]
// }

const router = useRouter();
const curRoute = useRoute();
const permissionStore = usePermissionStore();
const appStore = useAppStore();

// const activeKey = computed(() => findActiveKey(menuOptions, curRoute.path))
const activeKey = computed(() => curRoute.meta?.activeMenu || curRoute.name);

const menuOptions = computed(() => {
  return permissionStore.menus
    .map((item) => getMenuItem(item))
    .sort((a, b) => a.order - b.order);
});

const menu = ref(null);
watch(curRoute, async () => {
  await nextTick();
  menu.value?.showOption();
});

function resolvePath(basePath, path) {
  if (isExternal(path)) return path;
  return (
    "/" +
    [basePath, path]
      .filter((path) => !!path && path !== "/")
      .map((path) => path.replace(/(^\/)|(\/$)/g, ""))
      .join("/")
  );
}

function getMenuItem(route, basePath = "") {
  let menuItem = {
    label: (route.meta && route.meta.title) || route.name,
    key: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(route.meta),
    order: route.meta?.order || 0,
  };

  const visibleChildren = route.children
    ? route.children.filter((item) => item.name && !item.isHidden)
    : [];

  if (!visibleChildren.length) return menuItem;

  if (visibleChildren.length === 1) {
    // 单个子路由处理
    const singleRoute = visibleChildren[0];
    menuItem = {
      ...menuItem,
      label: singleRoute.meta?.title || singleRoute.name,
      key: singleRoute.name,
      path: resolvePath(menuItem.path, singleRoute.path),
      icon: getIcon(singleRoute.meta),
    };
    const visibleItems = singleRoute.children
      ? singleRoute.children.filter((item) => item.name && !item.isHidden)
      : [];

    if (visibleItems.length === 1) {
      menuItem = getMenuItem(visibleItems[0], menuItem.path);
    } else if (visibleItems.length > 1) {
      menuItem.children = visibleItems
        .map((item) => getMenuItem(item, menuItem.path))
        .sort((a, b) => a.order - b.order);
    }
  } else {
    menuItem.children = visibleChildren
      .map((item) => getMenuItem(item, menuItem.path))
      .sort((a, b) => a.order - b.order);
  }
  return menuItem;
}

function getIcon(meta) {
  if (meta?.customIcon) return renderCustomIcon(meta.customIcon, { size: 18 });
  if (meta?.icon) return renderIcon(meta.icon, { size: 18 });
  return null;
}

function handleMenuSelect(key, item) {
  console.log('item.path----------------: ', item.path)
      console.log('curRoute.path-----------: ', curRoute.path)

  if (isExternal(item.path)) {
    window.open(item.path);
  } else {
    if (item.path === curRoute.path) {
      console.log('appStore.reloadPage();')
      appStore.reloadPage();
    } else {
      console.log('appStore.reloadPage();')
      router.push(item.path);
    }
  }
}
// function findActiveKey(options: MenuOption[], path: string): string | undefined {
//   for (const item of options) {
//     // 1️⃣ check children first (deepest match wins)
//     if (item.children) {
//       const childKey = findActiveKey(item.children, path)
//       if (childKey) return childKey
//     }

//     // 2️⃣ check self
//     if (item.path && path.startsWith(item.path)) {
//       return item.key
//     }
//   }
// }

// const menuOptions = [
//   {
//     label: 'Workbench',
//     key: 'workbench',
//     icon: renderIcon('icon-park-outline:workbench', { size: 18 }),
//     path: '/workbench',
//   },
//   {
//     label: 'Post',
//     key: 'post',
//     icon: renderIcon('qlementine-icons:items-tree-16', { size: 18 }),
//     path: '/posts',
//   },
//   {
//     label: 'System',
//     key: 'system',
//     icon: renderIcon('ic:baseline-settings', { size: 18 }),
//     children: [
//       { label: 'Users', key: 'users', path: '/settings/users' },
//       { label: 'Roles', key: 'roles', path: '/settings/roles' },
//       { label: 'Menus', key: 'menus', path: '/settings/menus' },
//       { label: 'Apis', key: 'apis', path: '/settings/apis' },
//       { label: 'Departments', key: 'departments', path: '/settings/departments' },
//     ],
//   },
// ]

// function handleMenuSelect(key: string, item: any) {
//   if (item.path) {
//     router.push(item.path)
//   }
// }
</script>

<style lang="scss">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 5px;
      right: 5px;
    }
    &.n-menu-item-content--selected,
    &:hover {
      &::before {
        border-left: 4px solid var(--primary-color);
      }
    }
  }
}
</style>

<template>
  <n-menu
    ref="menu"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :options="menuOptions"
    :value="activeKey"
    @update:value="handleMenuSelect"
  />
</template>
