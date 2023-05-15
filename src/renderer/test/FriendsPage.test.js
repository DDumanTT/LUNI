import { mount } from '@vue/test-utils';
import FriendsPage from '../src/routes/FriendsPage.vue';

describe('FriendsPage', () => {
  it('displays "You have to be logged in to view socials" if user is not logged in', () => {
    const wrapper = mount(FriendsPage, {
      global: {
        mocks: {
          $t: () => '',
          $store: {
            state: {
              currentUser: null,
            },
          },
        },
      },
    });

    expect(wrapper.find('.not-logged-in').exists()).toBe(true);
  });

  it('displays all three dataviews if user is logged in', () => {
    const wrapper = mount(FriendsPage, {
      global: {
        mocks: {
          $t: () => '',
          $store: {
            state: {
              currentUser: {
                uid: 'user1',
              },
            },
          },
        },
      },
    });

    expect(wrapper.findAllComponents({ name: 'DataView' })).toHaveLength(3);
  });

  it('filters users by name or email', async () => {
    const wrapper = mount(FriendsPage, {
      global: {
        mocks: {
          $t: () => '',
          $store: {
            state: {
              currentUser: {
                uid: 'user1',
              },
              friends: [],
              users: [
                {
                  uid: 'user2',
                  displayName: 'John Doe',
                  email: 'john.doe@example.com',
                },
                {
                  uid: 'user3',
                  displayName: 'Jane Doe',
                  email: 'jane.doe@example.com',
                },
              ],
            },
          },
        },
      },
    });

    const input = wrapper.findAllComponents({ name: 'Input' })[2];
    await input.setValue('john');

    const userCards = wrapper.findAllComponents({ name: 'UserCard' });
    expect(userCards).toHaveLength(1);
    expect(userCards[0].props('user')).toEqual({
      uid: 'user2',
      displayName: 'John Doe',
      email: 'john.doe@example.com',
    });
  });

  it('filters friends by name or email', async () => {
    const wrapper = mount(FriendsPage, {
      global: {
        mocks: {
          $t: () => '',
          $store: {
            state: {
              currentUser: {
                uid: 'user1',
              },
              friends: [
                {
                  uid: 'user2',
                  displayName: 'John Doe',
                  email: 'john.doe@example.com',
                },
                {
                  uid: 'user3',
                  displayName: 'Jane Doe',
                  email: 'jane.doe@example.com',
                },
              ],
              users: [],
            },
          },
        },
      },
    });

    const input = wrapper.findAllComponents({ name: 'Input' })[1];
    await input.setValue('jane');

    const userCards = wrapper.findAllComponents({ name: 'UserCard' });
    expect(userCards).toHaveLength(1);
    expect(userCards[0].props('user')).toEqual({
      uid: 'user3',
      displayName: 'Jane Doe',
      email: 'jane.doe@example.com',
      isFriend: true,
    });
  });

  it('filters recommended users by name or email', async () => {
    const wrapper = mount(FriendsPage, {
      global: {
        mocks: {
          $t: () => '',
          $store: {
            state: {
              currentUser: {
                uid: 'user1',
              },
            },
          },
        },
      },
    });
    wrapper.setData({
      recommendedUsers: [
        {
          uid: 'user2',
          displayName: 'John Doe',
          email: 'john.doe@example.com',
        },
        {
          uid: 'user3',
          displayName: 'Jane Doe',
          email: 'jane.doe@example.com',
        },
      ],
    });

    const input = wrapper.findAllComponents({ name: 'Input' })[0];
    await input.setValue('john');

    const userCards = wrapper.findAllComponents({ name: 'UserCard' });
    expect(userCards).toHaveLength(1);
    expect(userCards[0].props('user')).toEqual({
      uid: 'user2',
      displayName: 'John Doe',
      email: 'john.doe@example.com',
    });
  });
});
