

"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

// Step 1: Define TypeScript structures for User and Auth State
export interface User {
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithEmail: (email: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with an undefined default to enforce hook usage
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Step 2: Read persistent session on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem("jira_linear_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("jira_linear_session");
      }
    }
    setIsLoading(false);
  }, []);

  // Step 3: Simulate asynchronous Magic Link/Password authentication
  const loginWithEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API round-trip delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simple pattern matching validation
    if (!email.includes("@")) {
      setIsLoading(false);
      return false;
    }

    const mockUser: User = {
      email: email,
      name: email.split("@")[0],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
    };

    setUser(mockUser);
    localStorage.setItem("jira_linear_session", JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  // Step 4: Clear session on logout
  const logout = () => {
    localStorage.removeItem("jira_linear_session");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}