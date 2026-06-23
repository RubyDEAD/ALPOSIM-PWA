'use client'

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from "@/src/lib/api";

interface AuthContextType {
  isUnauthorized: boolean;
  clearUnauthorized: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isUnauthorized: false,
  clearUnauthorized: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    // intercept 401 responses globally
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setIsUnauthorized(true); // show modal
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, []);

  const clearUnauthorized = () => setIsUnauthorized(false);

  const logout = async () => {
    try {
      await api.post("/api/Auth/logout");
    } finally {
      Cookies.remove("username");
      Cookies.remove("role");
      setIsUnauthorized(false);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ isUnauthorized, clearUnauthorized, logout }}>
      {children}

      {/* Global Unauthorized Modal */}
      {isUnauthorized && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Session Expired</h2>
            <p className="text-[#6b7280] text-sm mb-6">
              Your session has expired or you are not authorized. Please log in again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={clearUnauthorized}
                className="flex-1 bg-[#252525] hover:bg-[#2f2f2f] text-white py-2.5 rounded-xl text-sm transition"
              >
                Dismiss
              </button>
              <button
                onClick={logout}
                className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold py-2.5 rounded-xl text-sm transition"
              >
                Log in again
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);