<script setup lang="ts">
import { ref, watch } from 'vue'
import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
// hooks
import { useModalStore } from '@/store/modal'
import { useCreatePostMutation, useUpdatePostMutation } from '@/data/post'
// types
import type { Post } from '@/types'

const props = defineProps<{
  post?: Post | null
}>()

const modal = useModalStore()

// mutations
const { mutateAsync: createPost, isPending: creating } = useCreatePostMutation()
const { mutateAsync: updatePost, isPending: updating } = useUpdatePostMutation()

const modalFormRef = ref()
const modalForm = ref({
  title: '',
  content: '',
})

watch(
  () => props.post,
  (post) => {
    if (!post) {
      // create mode
      modalForm.value = {
        title: '',
        content: '',
      }
      return
    }

    // edit mode
    modalForm.value = {
      title: post.title,
      content: post.content,
    }
  },
  { immediate: true },
)

const validateAddPost = {
  title: [{ required: true, message: 'Title is required', trigger: ['blur'] }],
  content: [{ required: true, message: 'Content is required', trigger: ['blur'] }],
}

async function handleSave() {
  modalFormRef.value?.validate(async (errors: Error) => {
    if (errors) return
    if (props.post) {
      await updatePost({
        id: props.post.id,
        title: modalForm.value.title,
        content: modalForm.value.content,
      })
    } else {
      await createPost({
        title: modalForm.value.title,
        content: modalForm.value.content,
      })
    }
    modal.close()
  })
}
</script>

<template>
  <div>
    <!-- FORM -->
    <NForm
      ref="modalFormRef"
      label-placement="left"
      label-align="left"
      :label-width="80"
      :model="modalForm"
      :rules="validateAddPost"
    >
      <NFormItem label="Title" path="title">
        <NInput v-model:value="modalForm.title" />
      </NFormItem>

      <NFormItem label="Content" path="content">
        <NInput v-model:value="modalForm.content" />
      </NFormItem>
    </NForm>

    <div flex justify-end>
      <NButton @click="modal.close">Cancel</NButton>
      <NButton type="primary" class="ml-16" :loading="creating || updating" @click="handleSave">
        Save
      </NButton>
    </div>
  </div>
</template>
