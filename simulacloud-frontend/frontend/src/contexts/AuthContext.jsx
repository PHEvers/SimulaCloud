import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchAuthSession, fetchUserAttributes, getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth";
import { cognitoConfigured } from "../services/cognito.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(cognitoConfigured);

  const refreshUser = useCallback(async () => {
    if (!cognitoConfigured) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken.payload["cognito:groups"] ?? [];
      const sessionUser = {
        username: currentUser.username,
        role: groups.includes("Admin") ? "admin" : groups.includes("Colaborador") ? "colaborador" : "basico",
        userId: currentUser.userId,
        email: attributes.email ?? currentUser.signInDetails?.loginId ?? "",
      };
      setUser(sessionUser);
      return sessionUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signOut = useCallback(async () => {
    await amplifySignOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signOut, refreshUser, cognitoConfigured }),
    [user, loading, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  }
  return context;
}
