import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "../services/authService";

const TOKEN_KEY = "UserAuthToken";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const data = await authService.getCurrentUser();
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);

    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      login,
      register,
      logout,
      refreshUser: fetchCurrentUser,
    }),
    [user, isAuthLoading, fetchCurrentUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
