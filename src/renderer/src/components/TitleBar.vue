<template>
  <div class="title-bar">
    <span class="logo">LUNI</span>
    <div class="window-controls">
      <button class="control-button pi pi-minus" @click="handleClick('min')" />
      <button class="control-button pi pi-clone" @click="handleClick('max')" />
      <button class="control-button close-button pi pi-times" @click="handleClick('close')" />
    </div>
  </div>
</template>

<script setup lang="ts">
function handleClick(command: 'min' | 'max' | 'close'): void {
  window.electron.ipcRenderer.send('win:invoke', command);
}
</script>

<style scoped lang="postcss">
.title-bar {
  -webkit-app-region: drag;
  display: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  height: 1.5rem;
  background-color: var(--surface-card);
}
.logo {
  margin-left: 0.125rem;
  font-family: PressStart2P, sans-serif;
  color: var(--primary-color);
}
.window-controls {
  -webkit-app-region: no-drag;
  display: flex;
}
.control-button {
  display: flex;
  width: 2rem;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: var(--surface-border);
  }
  &:active {
    background-color: var(--bluegray-800);
  }
}
.close-button {
  &:hover {
    background-color: var(--red-600);
    color: var(--text-color);
  }
  &:active {
    background-color: var(--red-700);
    color: var(--text-color);
  }
}
</style>
