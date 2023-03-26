<template>
  <div class="flex w-full flex-col items-start px-2">
    <label
      v-if="props.label"
      :class="['mb-1', { 'after:text-error-11 after:content-[\'*\']': $attrs.required }]"
      :for="String($attrs.id)"
    >
      {{ props.label }}
    </label>
    <div class="flex w-full flex-1 items-center justify-center gap-2">
      <div class="relative w-full">
        <component
          :is="icon"
          class="absolute left-0 top-1/2 aspect-square h-full translate-x-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          v-bind="$attrs"
          :value="value"
          :class="[
            'w-full rounded-lg border-primary-6 bg-blackA-5 text-primary-12 shadow focus:border-primary-7 focus:ring-primary-7',
            { 'border-error-6 focus:border-error-7 focus:ring-error-7': props.error },
            { 'pr-9': props.clearable },
            { 'pl-9': props.icon },
          ]"
        />
        <button
          v-if="props.clearable"
          class="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 hover:text-neutral-12"
          @click="emit('clear')"
        >
          <IconClose />
        </button>
      </div>
    </div>
    <div v-if="props.error" class="text-base text-error-11">{{ props.error }}</div>
  </div>
</template>

<script lang="ts">
interface InputProps extends InputHTMLAttributes {
  clearable: boolean;
  value: string;
  error?: string;
  label?: string;
  icon?: SvgComponent;
}

export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { InputHTMLAttributes } from 'vue';
import { IconClose } from '@iconify-prerendered/vue-pixelarticons';

const emit = defineEmits(['clear']);

const props = withDefaults(defineProps<InputProps>(), {
  clearable: false,
});
</script>

<style lang=""></style>
