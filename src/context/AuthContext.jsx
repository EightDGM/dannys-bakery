import { useState } from 'react';
import { AuthContext } from './useAuth';
import { getSession, setSession, clearSession, puede as puedeService } from '../services/storage';

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => getSession());

  function login(user) {
    setSession(user);
    setSessionState(getSession());
  }

  function logout() {
    clearSession();
    setSessionState(null);
  }

  function puede(permiso) {
    return puedeService(session, permiso);
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, puede }}>
      {children}
    </AuthContext.Provider>
  );
}
