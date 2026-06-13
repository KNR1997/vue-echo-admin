<template>
  <AppPage>
    <n-result m-auto status="500">
      <template #icon>
        <icon-custom-server-error text-400px text-primary></icon-custom-server-error>
      </template>
      <template #footer>
        <n-button type="primary" @click="replace('/')">{{
          $t('views.errors.text_back_to_home')
        }}</n-button>
      </template>
    </n-result>
  </AppPage>
</template>

<script setup lang="ts">
import AppPage from '@/components/page/AppPage.vue';
import { useRouter } from 'vue-router';

const { replace } = useRouter()
</script>
