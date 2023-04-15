<template>
  <h1 class="title">LUNI</h1>
  <p class="subtext">A unified game launcher</p>
  <hr class="divider" />
  <p class="mt-8">First step is to import your video games.</p>
</template>

<script setup lang="ts"></script>

<style lang="postcss" scoped>
.title {
  background-image: linear-gradient(to right, var(--indigo-500), var(--red-500));
  background-clip: text;
  font-family: PressStart2P, sans-serif;
  font-size: 6rem;
  line-height: 1;
  color: transparent;
}
.subtext {
  margin-bottom: 1rem;
  font-weight: 700;
}
.divider {
  border-width: 1px;
  border-color: var(--highlight-bg);
}
</style>
