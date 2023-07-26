import { createContext, useContext, useState } from "react";

interface AuthContextType {
  authKey: string | null;
  setAuthKey: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authKey, setAuthKey] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ authKey, setAuthKey }}>
      {children}
    </AuthContext.Provider>
  );
}
