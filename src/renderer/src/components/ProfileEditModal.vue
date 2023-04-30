<template>
  <Dialog
    :min-y="24"
    modal
    style="min-width: 32rem"
    dismissable-mask
    append-to="#main"
    header="Edit profile"
  >
    <div class="wrapper">
      <Divider align="center" class="!m-0 !mb-2">Change password</Divider>
      <form @submit.prevent="handleSubmit">
        <div class="input">
          <label for="currentPassword">Current password</label>
          <Password
            id="currentPassword"
            v-model="form.currentPassword"
            type="password"
            :feedback="false"
            toggle-mask
            :class="{ 'p-invalid': error.currentPassword }"
          />
          <small v-if="error.currentPassword" class="p-error">{{ error.currentPassword }}</small>
        </div>
        <div class="input">
          <label for="newPassword">New password</label>
          <Password
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            :feedback="false"
            toggle-mask
            :class="{ 'p-invalid': error.newPassword }"
          />
          <small v-if="error.newPassword" class="p-error">{{ error.newPassword }}</small>
        </div>
        <div class="input">
          <label for="newPassword">Confirm password</label>
          <Password
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            :feedback="false"
            toggle-mask
            :class="{ 'p-invalid': error.confirmPassword }"
          />
          <small v-if="error.confirmPassword" class="p-error">{{ error.confirmPassword }}</small>
        </div>
        <Button
          label="Update profile"
          icon="pi pi-edit"
          class="!mt-4 w-full"
          :loading="loading"
          type="submit"
        />
        <small v-if="updateError" class="p-error inline-block w-full text-center">
          {{ updateError }}
        </small>
      </form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

import { useAuthStore } from '@renderer/store';
import Password from 'primevue/password';

const emit = defineEmits(['close']);

const authStore = useAuthStore();

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const error = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const updateError = ref('');
const loading = ref(false);

const validate = async () => {
  error.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  if (!form.value.currentPassword.length)
    error.value.currentPassword = 'Current password is required';
  else if (!(await authStore.checkCurrentPassword(form.value.currentPassword)))
    error.value.currentPassword = 'Current password is invalid';
  if (!form.value.newPassword.length) error.value.newPassword = 'Password is required';
  else if (form.value.newPassword.length < 6)
    error.value.newPassword = 'Password has to be at least 6 characters long';
  if (!form.value.confirmPassword.length)
    error.value.confirmPassword = 'Password confirmation is required';
  else if (form.value.confirmPassword !== form.value.newPassword)
    error.value.confirmPassword = 'Passwords do not match';
  return !(error.value.currentPassword || error.value.newPassword || error.value.confirmPassword);
};
const handleSubmit = async () => {
  const valid = await validate();
  if (!valid) return;
  loading.value = true;
  return authStore
    .changePassword(form.value.newPassword)
    .then(() => emit('close'))
    .catch((error) => (updateError.value = error.message))
    .finally(() => (loading.value = false));
};
</script>

<style scoped lang="postcss">
.wrapper {
  width: 100%;
  padding: 1rem;
  padding-top: 0;
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
