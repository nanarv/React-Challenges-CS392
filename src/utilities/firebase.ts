import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyD1wYGAEm_KhwzyUlGtWA4OGUDYxjNOqCM',
  authDomain: 'cs392-51c20.firebaseapp.com',
  databaseURL: 'https://cs392-51c20-default-rtdb.firebaseio.com',
  projectId: 'cs392-51c20',
  storageBucket: 'cs392-51c20.firebasestorage.app',
  messagingSenderId: '507288967783',
  appId: '1:507288967783:web:dfbe7d94efa3eb8a2712c2',
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useDataQuery = (path: string): [unknown, boolean, Error | undefined] => {
  const [data, setData] = useState<unknown>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setData(undefined);
    setLoading(true);
    setError(undefined);
    return onValue(ref(database, path), (snapshot) => {
      setData(snapshot.val());
      setLoading(false);
    }, (error) => {
      setError(error);
      setLoading(false);
    });
  }, [path]);

  return [data, loading, error];
};
