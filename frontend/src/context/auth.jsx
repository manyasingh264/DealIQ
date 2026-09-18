import React, { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("dealiq_token") || null);
  const [loading, setLoading] = useState(true);

  // Check and restore session on startup
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem("dealiq_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          // Token expired or invalid
          localStorage.removeItem("dealiq_token");
          localStorage.removeItem("dealiq_user");
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn("Could not verify session with MS1:", err);
        // Fallback to cached user if offline
        const cachedUser = localStorage.getItem("dealiq_user");
        if (cachedUser) {
          try {
            setUser(JSON.parse(cachedUser));
            setToken(storedToken);
          } catch (e) {}
        }
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed. Please check your credentials.");
    }

    localStorage.setItem("dealiq_token", data.token);
    localStorage.setItem("dealiq_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async ({ companyName, name, email, password }) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Registration failed. Please try again.");
    }

    localStorage.setItem("dealiq_token", data.token);
    localStorage.setItem("dealiq_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("dealiq_token");
    localStorage.removeItem("dealiq_user");
    setToken(null);
    setUser(null);
  };

  // Helper to make authenticated requests
  const authFetch = (url, options = {}) => {
    const headers = {
      ...options.headers,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        authFetch,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
