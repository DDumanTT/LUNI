<template>
  <div class="wrapper">
    <div class="welcome-wrapper">
      <div class="welcome">Welcome Back</div>
    </div>
    <form @submit.prevent="handleSignIn">
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
        label="Sign In"
        icon="pi pi-user"
        class="!mt-4 w-full"
        :loading="loading"
        type="submit"
      />
      <small v-if="loginError" class="p-error inline-block w-full text-center">{{
        loginError
      }}</small>
    </form>
    <Divider align="center">OR</Divider>
    <Button
      label="Sign In with Google"
      icon="pi pi-google"
      class="w-full"
      outlined
      severity="danger"
    />
    <Button
      label="Sign In with Facebook"
      icon="pi pi-facebook"
      class="!mt-4 w-full"
      outlined
      severity="info"
    />
    <Divider align="center">Don't have and account?</Divider>
    <Button
      label="Create account"
      icon="pi pi-user"
      class="w-full"
      outlined
      plain
      @click="emit('click-register')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Divider from 'primevue/divider';

import { validateEmail } from '@renderer/utils';
import { useAuthStore } from '@renderer/store';

const emit = defineEmits(['click-register', 'success']);

const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});
const error = ref({
  email: '',
  password: '',
});
const loginError = ref('');
const loading = ref(false);

const validate = () => {
  error.value = {
    email: '',
    password: '',
  };
  if (!form.value.email.length) error.value.email = 'Email is required';
  else if (!validateEmail(form.value.email)) error.value.email = 'Email is invalid';
  if (!form.value.password.length) error.value.password = 'Password is required';
  return !(error.value.email || error.value.password);
};

const handleSignIn = () => {
  if (!validate()) return;
  loading.value = true;
  return authStore
    .signIn(form.value.email, form.value.password)
    .then(() => emit('success'))
    .catch((error) => (loginError.value = error.message))
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
