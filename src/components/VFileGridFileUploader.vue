<template>
  <div
    class="v-file-system__uploader"
    @dragenter="overAction($event, true)"
    @dragleave="overAction($event, false)"
  >
    <input
      ref="fileInput"
      type="file"
      multiple
      :accept="props.acceptFiles"
      @change="emitFiles"
    />

    <div v-show="showDropUploadBoard" class="v-file-system__uploader-board">
      <slot name="board"></slot>
    </div>

    <div
      class="v-file-system__uploader-content"
      :class="{ hide: showDropUploadBoard }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VFgFileUploaderProvides } from '@/types/types'
import { provide, ref } from 'vue'

const props = defineProps<{
  acceptFiles: string
}>()
const emits = defineEmits(['droppedFiles'])

const fileInput = ref<HTMLInputElement | null>(null)
function emitFiles(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  const files = Array.from(input.files)
  emits('droppedFiles', files)

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const showDropUploadBoard = ref(false)
const isInternalDragging = ref(false)
let ableToClose = false

function setInternalDragStatus(bool: boolean) {
  isInternalDragging.value = bool
}

function overAction(event: Event, bool: boolean) {
  event.preventDefault()
  event.stopImmediatePropagation()
  if (isInternalDragging.value) return

  if (bool) {
    ableToClose = false
    showDropUploadBoard.value = true
  } else {
    if (!ableToClose) return (ableToClose = true)
    showDropUploadBoard.value = false
  }
}

provide<VFgFileUploaderProvides>('uploader', {
  isInternalDragging,
  setInternalDragStatus,
})
</script>

<style lang="scss" scoped>
.v-file-system__uploader {
  position: relative;

  input[type='file'] {
    display: none;
  }

  &-board {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10;
  }

  &-content {
    &.hide {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
