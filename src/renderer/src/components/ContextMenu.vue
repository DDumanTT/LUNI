<template>
  <div>
    <slot
      v-bind="Object.assign(api.triggerProps, dropdown ? {} : { onPointerdown: handleClose })"
      @click.right="handleOpen"
    />
    <div v-bind="api.positionerProps" class="!fixed z-50">
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
  click?: () => void;
}

interface ContextMenuProps {
  id: string;
  items: MenuItems[];
  dropdown?: boolean;
}
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { normalizeProps, useMachine } from '@zag-js/vue';
import * as menu from '@zag-js/menu';
import { ItemProps } from '@zag-js/menu/dist/menu.types';

const props = withDefaults(defineProps<ContextMenuProps>(), { dropdown: false });

const [state, send] = useMachine(
  menu.machine({
    id: props.id,
    positioning: { placement: 'bottom' },
    onSelect: (value) => {
      props.items.find((item) => item.id === value.value)?.click?.();
    },
  })
);

const api = computed(() => menu.connect(state.value, send, normalizeProps));
const handleOpen = () => {
  if (props.dropdown) return;
  if (api.value.isOpen) return handleClose();
  api.value.open();
};
const handleClose = () => {
  api.value.close();
};
</script>

<style lang="scss" scoped></style>
