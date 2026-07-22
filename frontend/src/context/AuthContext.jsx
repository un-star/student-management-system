import { useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./auth-context";
import { decodeToken } from "../utils/jwt";

export function AuthProvider({ children }) {
  // Keep auth in localStorage so a refresh does not force a new login.
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? decodeToken(storedToken) : null;
  });

  const login = async (email, password) => {
    // OAuth2PasswordRequestForm expects "username", even when the app uses email.
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const newToken = res.data.access_token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const parsedUser = decodeToken(newToken);
    setUser(parsedUser);
    return parsedUser;
  };

  const logout = () => {
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
