<template>
  <div class="flex w-full flex-col items-start px-2">
    <label
      v-if="label"
      :class="['mb-1', { 'after:text-error-11 after:content-[*]': props.required }]"
    >
      {{ label }}
    </label>
    <div class="flex w-full flex-1 items-center justify-center gap-2">
      <component :is="before" />
      <div class="relative w-full">
        <component
          :is="icon"
          class="absolute left-4 top-1/2 aspect-square h-full -translate-x-1/2 -translate-y-1/2"
        />
        <input
          v-bind="restProps"
          :class="[
            'w-full rounded-lg border-primary-6 bg-blackA-5 text-primary-12 shadow focus:border-primary-7 focus:ring-primary-7',
            { 'border-error-6 focus:border-error-7 focus:ring-error-7': error },
            { 'pr-8': clearable },
            { 'pl-8': icon },
            props.class,
          ]"
        />
        <button
          v-if="clearable"
          class="top-1/2 absolute right-0 -translate-x-1/2 -translate-y-1/2 hover:text-neutral-12"
          @click="emit('clear')"
        >
          <IconClose />
        </button>
      </div>
      <component :is="after" />
    </div>
    <div v-if="error" class="text-base text-error-11">{{ error }}</div>
  </div>
</template>

<script lang="ts">
interface InputProps extends InputHTMLAttributes {
  clearable: boolean;
  error?: string;
  label?: string;
  before?: string | object;
  after?: string | object;
  icon?: SvgComponent;
}
</script>

<script setup lang="ts">
import { toRefs, InputHTMLAttributes } from 'vue';
import { IconClose } from '@iconify-prerendered/vue-pixelarticons';

const emit = defineEmits['clear'];

const props = withDefaults(defineProps<InputProps>(), {
  clearable: false,
  type: 'text',
});
const { clearable, error, label, before, after, icon, ...restProps } = toRefs(props);
</script>

<style lang=""></style>
