<template>
  <div
    class="v-file-grid__uploader"
    @dragover.prevent
    @dragenter="overAction($event, true)"
    @dragleave="overAction($event, false)"
    @drop="emitFiles($event)"
  >
    <div v-show="showDropUploadBoard" class="v-file-grid__uploader-board">
      <slot name="board"></slot>
    </div>

    <div
      class="v-file-grid__uploader-content"
      :class="{ hide: showDropUploadBoard }"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VFgFileUploaderProvides } from '@/types/types'
import { provide, ref } from 'vue'

const emits = defineEmits<{
  droppedFiles: [{ files: DataTransferItem[]; folders: DataTransferItem[] }]
}>()

const showDropUploadBoard = ref(false)
const isInternalDragging = ref(false)
let ableToClose = false

function setUploadBoard(status: boolean) {
  showDropUploadBoard.value = status
}

function setInternalDragStatus(bool: boolean) {
  isInternalDragging.value = bool
}

function overAction(event: Event, bool: boolean) {
  event.preventDefault()
  event.stopImmediatePropagation()
  if (isInternalDragging.value) return

  if (bool) {
    ableToClose = false
    setUploadBoard(true)
  } else {
    if (!ableToClose) return (ableToClose = true)
    setUploadBoard(false)
  }
}

provide<VFgFileUploaderProvides>('uploader', {
  isInternalDragging,
  setInternalDragStatus,
})

function emitFiles(event: DragEvent) {
  event.preventDefault()
  event.stopImmediatePropagation()

  if (!event.dataTransfer?.items) return

  const files: DataTransferItem[] = []
  const folders: DataTransferItem[] = []

  Array.from(event.dataTransfer.items).forEach(item => {
    if (item.webkitGetAsEntry()?.isFile) {
      files.push(item)
    } else if (item.webkitGetAsEntry()?.isDirectory) {
      folders.push(item)
    }
  })

  // TODO: Emit {files: File[], entries: File[]}
  emits('droppedFiles', { files, folders })

  setUploadBoard(false)
}
</script>

<style lang="scss" scoped>
.v-file-grid__uploader {
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
