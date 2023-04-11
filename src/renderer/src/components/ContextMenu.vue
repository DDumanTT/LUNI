<template>
  <div>
    <slot v-bind="dropdown ? api.triggerProps : api.contextTriggerProps" />
    <div v-bind="api.positionerProps">
      <ul v-bind="api.contentProps" class="min-w-[8rem] rounded bg-primary-4 p-1 text-base">
        <li
          v-for="item in items"
          :key="item.id"
          v-bind="api.getItemProps(item)"
          class="flex w-full cursor-pointer items-center justify-start gap-1 rounded px-2 py-1 hover:bg-primary-7"
        >
          <component :is="item.icon" class="aspect-square h-6 w-6" />{{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export interface MenuItems extends ItemProps {
  label: string;
  icon?: SvgComponent;
}

interface ContextMenuProps {
  id: string;
  items: MenuItems[];
  dropdown?: boolean;
}
</script>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { normalizeProps, useMachine } from '@zag-js/vue';
import * as menu from '@zag-js/menu';
import { ItemProps } from '@zag-js/menu/dist/menu.types';
import { useMouse } from '@vueuse/core';

const props = withDefaults(defineProps<ContextMenuProps>(), { dropdown: false });
const mouse = useMouse();

const [state, send] = useMachine(
  menu.machine({
    id: props.id,
  })
);
const api = computed(() => menu.connect(state.value, send, normalizeProps));
// watch(
//   () => api.value.isOpen,
//   (isOpen) => {
//     if (!isOpen) return;
//     console.log(state.value);
//     // api.value.positionerProps.style.position = 'fixed';
//     console.log(`translate3d(${mouse.x.value}px, ${mouse.y.value}px, 0px)`);
//   }
// );

// watch(api.value.isOpen, (isOpen) => {
//   console.log('first');
//   if (!isOpen) return;
//   api.value.positionerProps.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0px)`;
// });
</script>

<style lang="scss" scoped></style>
