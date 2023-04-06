<template>
  <button
    :class="[
      'rounded-md px-4 py-2 shadow-md',
      textColors[props.color],
      { [`border-2 ${borderColors[props.color]}`]: props.outline },
      { [importantBgColors[props.color]]: !props.outline && props.important },
      { [bgColors[props.color]]: !props.outline && !props.important },
    ]"
  >
    <slot />
  </button>
</template>

<script lang="ts">
interface ButtonProps {
  color?: ComponentColors;
  important?: boolean;
  outline?: boolean;
}
</script>

<script setup lang="ts">
import { textColors, borderColors, importantBgColors, bgColors } from '@renderer/utils/colorMaps';
const props = withDefaults(defineProps<ButtonProps>(), { color: 'primary' });
</script>

<style lang=""></style>
