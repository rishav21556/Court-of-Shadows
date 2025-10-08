
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthResponse {
  sub: string;
  user_name: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          setIsAuthenticated(true);
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

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}