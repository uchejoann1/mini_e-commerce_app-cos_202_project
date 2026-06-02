"use client";

// AuthContext — manages Supabase authentication state (user, session) and provides signOut
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Default context values (no user, no session, loading=true until check completes)
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Current Supabase user and session objects
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  // Loading flag — true while the initial session check is in progress
  const [loading, setLoading] = useState(true);

  // On mount: fetch the existing session, then subscribe to auth state changes
  useEffect(() => {
    if (!supabase) {
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }

    // Check for an existing session (e.g. from a previous login)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to real-time auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Unsubscribe on unmount to prevent memory leaks
    return () => subscription.unsubscribe();
  }, []);

  // Sign the user out via Supabase auth
  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access auth state from any component
export const useAuth = () => useContext(AuthContext);
