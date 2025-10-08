// components/auth/AuthWrapper.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthResponse {
  sub: string;
  user_name: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: AuthResponse | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthWrapper');
  }
  return context;
}

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/auth/verify`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }

        if (response.ok) {
          const data: AuthResponse = await response.json();
          setUser(data);
          setIsLoading(false);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.push('/auth/login');
      }
    };

    verifyAuth();
  }, [router]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}