import { createContext, useContext, useEffect, useState } from "react";

import { loginUser, registerUser, getCurrentUser } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // USER STATE

  const [userState, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("settle_user") || "null");
    } catch {
      return null;
    }
  });

  // TOKEN STATE

  const [token, setToken] = useState(() => {
    return localStorage.getItem("settle_token") || null;
  });

  // LOADING
  const [loading, setLoading] = useState(false);

  // SET USER

  const setUser = (value) => {
    setUserState((currentUser) => {
      const nextUser = typeof value === "function" ? value(currentUser) : value;

      if (nextUser) {
        localStorage.setItem("settle_user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("settle_user");
      }

      return nextUser;
    });
  };

  // LOAD CURRENT USER

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);

        const data = await getCurrentUser();

        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("LOAD CURRENT USER ERROR:", error);

        if (error?.status === 401 || error?.response?.status === 401) {
          setUserState(null);
          setToken(null);

          localStorage.removeItem("settle_token");
          localStorage.removeItem("settle_user");
        }
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  // LOGIN

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      setToken(data.token);

      localStorage.setItem("settle_token", data.token);

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // REGISTER

  const register = async (name, phone, email, password) => {
    setLoading(true);

    try {
      const data = await registerUser({
        name,
        phone,
        email,
        password,
      });

      setToken(data.token);

      localStorage.setItem("settle_token", data.token);

      if (data?.user) {
        setUser(data.user);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT

  const logout = () => {
    setUserState(null);
    setToken(null);

    localStorage.removeItem("settle_token");
    localStorage.removeItem("settle_user");
  };

  // CONTEXT

  return (
    <AuthContext.Provider
      value={{
        user: userState,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
