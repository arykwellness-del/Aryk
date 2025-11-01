import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const resp = await fetch('/api/auth/me', { credentials: 'include' });
      if (!resp.ok) {
        setUser(null);
        return;
      }
      const data = await resp.json();
      if (data.loggedIn && data.customer) {
        setUser({
          id: data.customer.id,
          email: data.customer.email,
          name: `${data.customer.firstName || ''} ${data.customer.lastName || ''}`.trim() || data.customer.email,
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      // Never block rendering on errors
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, refresh: fetchMe, logout }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      refresh: async () => {},
      logout: async () => {},
    } as AuthContextType;
  }
  return ctx;
};


