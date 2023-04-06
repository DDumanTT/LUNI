<template>
  <div>
    <slot v-bind="api.triggerProps" />
    <div v-bind="api.positionerProps" class="rounded bg-primary-4 p-1 text-base">
      <ul v-bind="api.contentProps">
        <li
          class="cursor-pointer rounded px-2 py-1 hover:bg-primary-7"
          v-bind="api.getItemProps({ id: 'edit' })"
        >
          Edit
        </li>
        <li
          class="cursor-pointer rounded px-2 py-1 hover:bg-primary-7"
          v-bind="api.getItemProps({ id: 'duplicate' })"
        >
          Duplicate
        </li>
        <li
          class="cursor-pointer rounded px-2 py-1 hover:bg-primary-7"
          v-bind="api.getItemProps({ id: 'delete' })"
        >
          Delete
        </li>
        <li
          class="cursor-pointer rounded px-2 py-1 hover:bg-primary-7"
          v-bind="api.getItemProps({ id: 'export' })"
        >
          Export...
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
interface MenuContext extends menu.Context {
  label: string;
}

interface DropdownMenuProps {
  context?: MenuContext;
}
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import { normalizeProps, useMachine } from '@zag-js/vue';
import * as menu from '@zag-js/menu';

const props = defineProps<DropdownMenuProps>();

const [state, send] = useMachine(menu.machine({ id: 'menu', 'aria-label': 'File' }));
const api = computed(() => menu.connect(state.value, send, normalizeProps));
</script>

<style lang="scss" scoped></style>
