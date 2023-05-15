import { useChatStore } from '../src/store';

describe('useChatStore', () => {
  let store;

  beforeEach(() => {
    store = useChatStore();
  });

  test('getMessagesCollection returns the correct collection', () => {
    const uid = '123';
    const expectedCollectionPath = `chats/${store.user.value.uid}-${uid}/messages`;

    const collection = store.getMessagesCollection(uid);

    expect(collection.path).toBe(expectedCollectionPath);
  });

  test('sendMessage creates a chat and sends a message', async () => {
    const recipientUid = '456';
    const message = 'Hello';
    const user = {
      uid: '789',
      displayName: 'John Doe',
      photoURL: 'https://example.com/avatar.jpg',
    };
    const recipient = {
      uid: recipientUid,
      displayName: 'Jane Smith',
      photoURL: 'https://example.com/avatar.jpg',
    };

    store.user.value = user;
    store.users.value = [recipient];
    store.chats = {
      addDoc: vi.fn(),
      setDoc: vi.fn(),
    };

    await store.sendMessage(recipientUid, message);

    expect(store.users.value.find((user) => user.uid === recipientUid)).toBe(recipient);
    expect(store.chats.setDoc).toHaveBeenCalledWith(expect.anything(), {
      user1: {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      user2: {
        uid: recipient.uid,
        displayName: recipient.displayName,
        photoURL: recipient.photoURL,
      },
    });
    expect(store.chats.addDoc).toHaveBeenCalledWith(expect.anything(), {
      sender: user.uid,
      createdAt: expect.anything(),
      text: message,
    });
  });
});
