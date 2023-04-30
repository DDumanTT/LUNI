import { vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useLocalStorage } from '@vueuse/core';

// vi.mock('../src/store.ts', () => ({

// }));

const createWrapper = (component) => {
  return mount(component, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          fakeApp: true,
        }),
      ],
    },
  });
};

export default createWrapper;
