import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";
import { decodeToken } from "../utils/jwt";

export function AuthProvider({ children }) {
  // Hydrate auth state from localStorage so refreshes do not kick users out.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? decodeToken(storedToken) : null;
  });

  const login = async (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Store the JWT and derive the current user from its payload instead of calling /auth/me.
    const newToken = res.data.access_token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const parsedUser = decodeToken(newToken);
    setUser(parsedUser);
    return parsedUser;
  };

  const logout = () => {
    // Clear both the token and derived user state so protected routes redirect cleanly.
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
