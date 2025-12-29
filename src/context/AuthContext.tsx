import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  handleProviderCallback: (jwt: string, strapiUser: any) => void;
  logout: () => void;
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Base URL for Strapi
const STRAPI_URL = "http://localhost:1337";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("stockflow_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("stockflow_jwt");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user && !!token);
  
  const login = async (identifier: string, password: string) => {
    try {
      const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
        identifier,
        password,
      });

      const { jwt,Kpuser: strapiUser } = response.data;
      
      const mappedUser: User = {
        id: strapiUser.id,
        email: strapiUser.email,
        name: strapiUser.username,
      };

      setToken(jwt);
      setUser(mappedUser);
      setIsAuthenticated(true);
      
      localStorage.setItem("stockflow_jwt", jwt);
      localStorage.setItem("stockflow_user", JSON.stringify(mappedUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const handleProviderCallback = async (jwt: string, strapiUser: any) => {
      const mappedUser: User = {
        id: strapiUser.id,
        email: strapiUser.email,
        name: strapiUser.username,
      };

      setToken(jwt);
      setUser(mappedUser);
      setIsAuthenticated(true);
      
      localStorage.setItem("stockflow_jwt", jwt);
      localStorage.setItem("stockflow_user", JSON.stringify(mappedUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("stockflow_user");
    localStorage.removeItem("stockflow_jwt");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, token, handleProviderCallback }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
