<template>
  <form @submit.prevent="handleAddGame">
    <div class="input">
      <label for="name">Name</label>
      <InputText id="name" v-model="form.name" :class="{ 'p-invalid': error.name }" />
      <small v-if="error.name" class="p-error">{{ error.name }}</small>
    </div>
    <div class="input">
      <label for="executable">Executable</label>
      <div class="flex w-full gap-2">
        <Input
          id="executable"
          :value="form.executable"
          icon-right="pi pi-times cursor-pointer"
          :class="{ 'p-invalid': error.executable }"
          @click-right="form.executable = ''"
        />
        <Button icon="pi pi-upload" outlined @click="handleSelectGame" />
      </div>
      <small v-if="error.executable" class="p-error">{{ error.executable }}</small>
    </div>
    <div class="input">
      <label for="icon">Icon</label>
      <div class="flex gap-2">
        <Input
          id="icon"
          :value="form.icon"
          icon-right="pi pi-times cursor-pointer"
          :class="{ 'p-invalid': error.icon }"
          @click-right="form.icon = ''"
        />
        <Button icon="pi pi-upload" outlined @click="handleSelectImage('icon')" />
      </div>
      <small v-if="error.icon" class="p-error">{{ error.icon }}</small>
    </div>
    <div class="input">
      <label for="logo">Logo</label>
      <div class="flex gap-2">
        <Input
          id="logo"
          :value="form.logo"
          icon-right="pi pi-times cursor-pointer"
          :class="{ 'p-invalid': error.logo }"
          @click-right="form.logo = ''"
        />
        <Button icon="pi pi-upload" outlined @click="handleSelectImage('logo')" />
      </div>
      <small v-if="error.logo" class="p-error">{{ error.logo }}</small>
    </div>
    <div class="input">
      <label for="cover">Cover</label>
      <div class="flex gap-2">
        <Input
          id="cover"
          :value="form.cover"
          icon-right="pi pi-times cursor-pointer"
          :class="{ 'p-invalid': error.cover }"
          @click-right="form.cover = ''"
        />
        <Button icon="pi pi-upload" outlined @click="handleSelectImage('cover')" />
      </div>
      <small v-if="error.cover" class="p-error">{{ error.cover }}</small>
    </div>
    <div class="input">
      <label for="hero">Hero</label>
      <div class="flex gap-2">
        <Input
          id="hero"
          :value="form.hero"
          icon-right="pi pi-times cursor-pointer"
          :class="{ 'p-invalid': error.hero }"
          @click-right="form.hero = ''"
        />
        <Button icon="pi pi-upload" outlined @click="handleSelectImage('hero')" />
      </div>
      <small v-if="error.hero" class="p-error">{{ error.hero }}</small>
    </div>
    <Button label="Add game" icon="pi pi-plus" type="submit" class="!mt-4 w-full" />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import Input from './Input.vue';
import { useGamesStore } from '@renderer/store';

const emit = defineEmits(['close']);

const gamesStore = useGamesStore();

const form = ref({
  name: '',
  executable: '',
  icon: '',
  logo: '',
  cover: '',
  hero: '',
});
const error = ref({
  name: '',
  executable: '',
  icon: '',
  logo: '',
  cover: '',
  hero: '',
});

// TODO: implement image upload
const handleSelectImage = async (field: string) => {
  console.log(field);
};
const handleSelectGame = async () => {
  const path = await window.api.dialog.openFilePicker();
  if (!path) return;
  form.value.executable = path;
};
const validate = () => {
  error.value = {
    name: '',
    executable: '',
    icon: '',
    logo: '',
    cover: '',
    hero: '',
  };
  if (!form.value.name.length) error.value.name = 'Game name is required';
  if (!form.value.executable.length) error.value.executable = 'Game executable path is required';
  return !Object.values(error.value).some((error) => error !== '');
};
const handleAddGame = () => {
  if (!validate()) return;
  gamesStore.addCustomGame(form.value);
  emit('close');
};
</script>

<style scoped lang="postcss">
:deep(.input) {
  margin-bottom: 1rem;
  label {
    display: block;
    & + * {
      width: 100%;
    }
  }
  input {
    width: 100%;
  }
}
</style>
