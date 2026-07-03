// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get username from cookies
    const user = Cookies.get('username');
    setUsername(user || null);
    setIsLoading(false);
  }, []);

  return {
    username,
    isLoading,
    isAuthenticated: !!username,
  };
}