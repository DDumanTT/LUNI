<template>
  <div class="region-drag sticky top-0 flex h-6 select-none justify-between bg-zinc-900">
    <span class="ml-1 font-pressstart2p text-indigo-800">LUNI</span>
    <div class="region-no-drag flex text-slate-500">
      <button
        class="flex w-8 items-center justify-center hover:bg-zinc-800 hover:text-slate-200 active:bg-zinc-700 active:text-slate-200"
        @click="handleClick('min')"
      >
        <IconMinus class="w-full h-full p-0.5" />
      </button>
      <button
        class="flex w-8 items-center justify-center hover:bg-zinc-800 hover:text-slate-200 active:bg-zinc-700 active:text-slate-200"
        @click="handleClick('max')"
      >
        <IconDuplicate class="w-full h-full p-0.5" />
      </button>
      <button
        class="flex w-8 items-center justify-center hover:bg-red-600 hover:text-slate-200 active:bg-red-700 active:text-slate-200"
        @click="handleClick('close')"
      >
        <IconClose class="w-full h-full p-0.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconClose, IconDuplicate, IconMinus } from '@iconify-prerendered/vue-pixelarticons';

function handleClick(command: 'min' | 'max' | 'close'): void {
  window.electron.ipcRenderer.send('win:invoke', command);
}
</script>

<style></style>
