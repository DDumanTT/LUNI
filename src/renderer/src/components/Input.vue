<template>
  <div class="wrapper" :class="wrapperClass">
    <label v-if="label" :for="id">{{ label }}</label>
    <span :class="{ 'p-input-icon-left': iconLeft, 'p-input-icon-right': iconRight }">
      <i v-if="iconLeft" :class="['pi', { [iconLeft]: iconLeft }]" @click="emit('click-left')" />
      <component
        :is="props.area ? Textarea : InputText"
        :id="id"
        auto-resize
        v-bind="$attrs"
        class="w-full"
        :model-value="value"
      />
      <i
        v-if="iconRight"
        :class="['pi', { [iconRight]: iconRight }]"
        @click="emit('click-right')"
      />
    </span>
  </div>
</template>

<script lang="ts">
interface InputProps extends InputHTMLAttributes {
  value: string;
  wrapperClass?: string;
  id?: string;
  error?: string;
  label?: string;
  iconLeft?: string;
  iconRight?: string;
  area?: boolean;
}

export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { InputHTMLAttributes } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const emit = defineEmits(['click-left', 'click-right']);

const props = defineProps<InputProps>();
</script>

<style lang="postcss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
}
</style>
