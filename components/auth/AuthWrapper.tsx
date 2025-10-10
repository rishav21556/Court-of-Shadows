// components/auth/AuthWrapper.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface AuthResponse {
  sub: string;
  user_name: string;
  role: string;
  total_games: number;
  total_wins: number;
  rating: number;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: AuthResponse | null;
  isLoading: boolean;
  socket: Socket | null; 
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
  const [socket, setSocket] = useState<Socket | null>(null); // Store socket in state

  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up KeepAlive socket for user:', user.user_name);

    const newSocket = io('ws://localhost:8001', {
      autoConnect: true,
      timeout: 5000,
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket(newSocket); // Store socket in state

    const interval = setInterval(() => {
      newSocket.emit('KeepAlive', {
        user_name: user.user_name
      });
    }, 5000);

    newSocket.on('connect', () => {
      console.log('Socket connected for user:', user.user_name);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      console.log('Cleaning up socket connection');
      clearInterval(interval);
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

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

        if (response.status === 201) {
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
    <AuthContext.Provider value={{ user, isLoading, socket }}> {/* Provide socket */}
      {children}
    </AuthContext.Provider>
  );
}