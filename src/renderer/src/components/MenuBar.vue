<template>
  <nav
    className="z-10 sticky top-0 flex h-16 items-center border-b border-solid border-primary-3 bg-blackA-9 px-4 backdrop-blur"
  >
    <div className="flex-1">search</div>
    <div className="h-full">
      <div className="flex h-full">
        <MenuButton to="/home">
          <IconHome class="h-8 w-8" />
        </MenuButton>
        <MenuButton to="/games">
          <IconGamepad class="h-8 w-8" />
        </MenuButton>
        <MenuButton to="/friends">
          <IconUsers class="h-8 w-8" />
        </MenuButton>
      </div>
    </div>
    <div className="flex flex-1 justify-end">user</div>
  </nav>
</template>

<script setup lang="ts">
import { IconHome, IconGamepad, IconUsers } from '@iconify-prerendered/vue-pixelarticons';

import MenuButton from './MenuButton.vue';
</script>

<style lang=""></style>
