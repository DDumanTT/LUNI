<template>
  <router-link :to="props.to" class="flex aspect-square items-center justify-center select-none">
    <slot />
  </router-link>
</template>

<script lang="ts">
interface MenuButtonProps {
  to: string;
}
</script>

<script setup lang="ts">
const props = defineProps<MenuButtonProps>();
</script>

<style lang="postcss">
.router-link-active {
  @apply border-solid border-b-4 border-black;
}
</style>
