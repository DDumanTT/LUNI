import { describe, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import { useLocalStorage } from '@vueuse/core';

describe('Component', () => {
  it('renders the TitleBar component', () => {
    const wrapper = mount(App);
    const authStore = vi.fn().mockReturnValue();
    authStore.isUserLoaded = true;
    expect(wrapper.findComponent({ name: 'TitleBar' })).toBeTruthy();
  });

  it('renders the FirstStartPage component when firstStart is true', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [useLocalStorage],
        mocks: {
          $store: {
            state: {
              firstStart: true,
            },
          },
        },
      },
    });
    expect(wrapper.findComponent({ name: 'FirstStartPage' })).toBeTruthy();
  });

  it('renders the MenuBar and router-view components when firstStart is false and authStore.isUserLoaded is true', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [useLocalStorage],
        mocks: {
          $store: {
            state: {
              firstStart: false,
            },
            getters: {
              'authStore/isUserLoaded': true,
            },
          },
        },
      },
    });
    expect(wrapper.findComponent({ name: 'MenuBar' })).toBeTruthy();
    expect(wrapper.findComponent({ name: 'router-view' })).toBeTruthy();
  });

  it('renders the Toast and ConfirmPopup components', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [useLocalStorage],
        mocks: {
          $store: {
            state: {},
            getters: {
              'authStore/isUserLoaded': false,
            },
          },
        },
      },
    });
    expect(wrapper.findComponent({ name: 'Toast' })).toBeTruthy();
    expect(wrapper.findComponent({ name: 'ConfirmPopup' })).toBeTruthy();
  });

  it('calls gamesStore.cancelLaunch when the Toast component emits the close event', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [useLocalStorage],
        mocks: {
          $store: {
            state: {},
            getters: {
              'authStore/isUserLoaded': false,
            },
          },
        },
      },
    });
    await wrapper.findComponent({ name: 'Toast' }).vm.$emit('close');
    expect(gamesStore.cancelLaunch).toHaveBeenCalled();
  });
});
