import { useEffect, useState } from 'react';
import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';

interface UseAuthReturnType {
  user: FirebaseAuthTypes.User | null;
  isLoggedIn: boolean;
}

export const useAuth = (): UseAuthReturnType => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { user, isLoggedIn: !!user };
};
