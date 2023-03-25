<template>
  <div class="h-full w-full flex justify-center items-center">
    <component :is="props.icon" class="" />
  </div>
</template>

<script lang="ts">
interface IconProps {
  icon: string | object;
}
</script>

<script setup lang="ts">
const props = defineProps<IconProps>();
</script>

<style></style>
