<template>
  <div class="wrapper">
    <div class="welcome-wrapper">
      <div class="welcome">Create account</div>
    </div>
    <form @submit.prevent="handleRegister">
      <div class="input">
        <label for="username" class="">Username</label>
        <InputText
          id="username"
          v-model="form.username"
          type="text"
          :class="{ 'p-invalid': error.username }"
        />
        <small v-if="error.username" class="p-error">{{ error.username }}</small>
      </div>
      <div class="input">
        <label for="email" class="">Email</label>
        <InputText
          id="email"
          v-model="form.email"
          type="text"
          :class="{ 'p-invalid': error.email }"
        />
        <small v-if="error.email" class="p-error">{{ error.email }}</small>
      </div>
      <div class="input">
        <label for="password">Password</label>
        <Password
          id="password"
          v-model="form.password"
          type="password"
          :feedback="false"
          toggle-mask
          :class="{ 'p-invalid': error.password }"
        />
        <small v-if="error.password" class="p-error">{{ error.password }}</small>
      </div>
      <Button
        label="Create"
        icon="pi pi-user"
        class="!mt-4 w-full"
        :loading="loading"
        type="submit"
      />
      <small v-if="registerError" class="p-error inline-block w-full text-center">{{
        registerError
      }}</small>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

import { validateEmail } from '@renderer/utils';
import { useAuthStore } from '@renderer/store';

const emit = defineEmits(['success']);

const authStore = useAuthStore();

const form = ref({
  username: '',
  email: '',
  password: '',
});
const error = ref({
  username: '',
  email: '',
  password: '',
});
const registerError = ref('');
const loading = ref(false);

const validate = () => {
  error.value = {
    username: '',
    email: '',
    password: '',
  };
  if (!form.value.username.length) error.value.username = 'Username is required';
  else if (form.value.username.length < 3)
    error.value.username = 'Username has to be at least 3 characters long';
  if (!form.value.email.length) error.value.email = 'Email is required';
  else if (!validateEmail(form.value.email)) error.value.email = 'Email is invalid';
  if (!form.value.password.length) error.value.password = 'Password is required';
  else if (form.value.password.length < 6)
    error.value.password = 'Password has to be at least 6 characters long';
  return !(error.value.username || error.value.email || error.value.password);
};

const handleRegister = () => {
  if (!validate()) return;
  loading.value = true;
  return authStore
    .createAccount(form.value.username, form.value.email, form.value.password)
    .then(() => emit('success'))
    .catch((error) => (registerError.value = error.message))
    .finally(() => (loading.value = false));
};
</script>

<style scoped lang="postcss">
.wrapper {
  width: 100%;
  padding: 1rem;
  padding-top: 0;
}
.welcome-wrapper {
  margin-bottom: 1.25rem;
  text-align: center;
}
.welcome {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  font-weight: bold;
}
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
