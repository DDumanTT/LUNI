import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import PrimeVue from 'primevue/config';

const createWrapper = (component) => {
  return mount(component, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          fakeApp: true,
        }),
      ],
      mocks: [PrimeVue],
    },
  });
};

export default createWrapper;
