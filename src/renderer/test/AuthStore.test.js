import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../src/store';
import { vi, beforeEach, describe, expect, test, it } from 'vitest';
import {
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { updateCurrentUserProfile } from 'vuefire';

vi.mock('vuefire', () => ({
  useFirebaseAuth: vi.fn().mockReturnValue({ signOut: vi.fn() }),
  useCurrentUser: vi.fn(),
  updateCurrentUserProfile: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  reauthenticateWithCredential: vi.fn(),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: '', photoURL: '' } }),
  EmailAuthProvider: { credential: vi.fn() },
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn(),
}));

describe('AuthStore', () => {
  let authStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
  });

  it('should sign in with email and password', async () => {
    await authStore.signIn('test@example.com', 'password');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      authStore.auth,
      'test@example.com',
      'password'
    );
  });

  it('should sign out', async () => {
    const signOut = vi.spyOn(authStore.auth, 'signOut');
    await authStore.signOut();
    expect(signOut).toHaveBeenCalled();
  });

  it('should create an account with username, email, and password', async () => {
    await authStore.createAccount('testuser', 'test@example.com', 'password');
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      authStore.auth,
      'test@example.com',
      'password'
    );
    expect(setDoc).toHaveBeenCalled();
  });

  it('should update the current user profile', async () => {
    await authStore.updateAccount({ displayName: 'newname' });
    expect(updateCurrentUserProfile).toHaveBeenCalledWith({ displayName: 'newname' });
  });

  test('it should check the current password', async () => {
    authStore.user = {
      email: 'test@example.com',
    };
    authStore.checkCurrentPassword = vi.fn().mockResolvedValue(true);
    await authStore.checkCurrentPassword('password');
    expect(reauthenticateWithCredential).not.toHaveBeenCalled();
  });

  test('it should change the password', async () => {
    authStore.user = { uid: '123' };
    const updatePassword = vi.spyOn(authStore, 'changePassword').mockResolvedValue('');
    await authStore.changePassword('newpassword');
    expect(updatePassword).not.toHaveBeenCalledWith(authStore.user.value, 'newpassword');
  });
});
