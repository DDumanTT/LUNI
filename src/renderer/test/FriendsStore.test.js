import { useFriendsStore } from '../src/store';

describe('useFriendsStore', () => {
  let store;

  beforeEach(() => {
    store = useFriendsStore();
  });

  test('sendRequest should send a friend request', async () => {
    const chatStore = {
      users: [
        { uid: 'user1', displayName: 'User 1' },
        { uid: 'user2', displayName: 'User 2' },
      ],
    };
    store.chatStore = chatStore;
    store.user.value = { uid: 'user1' };
    store.ownSentCollection.value = 'sentCollection';
    store.receivedRequests.value = [{ uid: 'user2' }];

    const batchCommitMock = vi.fn();
    const setMock = vi.fn();
    const addToastMock = vi.fn();
    store.toast = { add: addToastMock };
    store.db = {
      batch: vi.fn(() => ({
        commit: batchCommitMock,
        set: setMock,
        delete: vi.fn(),
      })),
    };

    await store.sendRequest('user2');

    expect(batchCommitMock).toHaveBeenCalledTimes(1);
    expect(setMock).toHaveBeenCalledTimes(2);
    expect(setMock).toHaveBeenCalledWith('sentCollection/user2', {
      uid: 'user2',
      displayName: 'User 2',
    });
    expect(setMock).toHaveBeenCalledWith('receivedRequests/user2/user1', {
      uid: 'user1',
    });
    expect(addToastMock).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Friend request sent',
      life: 3000,
    });
  });

  test('unfriend should remove a friend', async () => {
    const friends = [
      { uid: 'user1', displayName: 'User 1' },
      { uid: 'user2', displayName: 'User 2' },
    ];
    store.user.value = { uid: 'user1' };
    store.ownFriendsCollection.value = 'friendsCollection';
    store.friends.value = friends;

    const batchCommitMock = vi.fn();
    const deleteMock = vi.fn();
    const addToastMock = vi.fn();
    store.toast = { add: addToastMock };
    store.db = {
      batch: vi.fn(() => ({
        commit: batchCommitMock,
        delete: deleteMock,
        set: vi.fn(),
      })),
    };

    await store.unfriend('user2');

    expect(batchCommitMock).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledTimes(2);
    expect(deleteMock).toHaveBeenCalledWith('friendsCollection/user2');
    expect(deleteMock).toHaveBeenCalledWith('friendsCollection/user1');
    expect(addToastMock).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Friend removed',
      life: 3000,
    });
  });
});
