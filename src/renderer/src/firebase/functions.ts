import { firebaseApp } from '.';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(firebaseApp);
functions.region = 'europe-west1';
// functions.customDomain = 'http://127.0.0.1:5001/luni-3c7aa/europe-west1';

export const getGameData = httpsCallable(functions, 'getGameData');
