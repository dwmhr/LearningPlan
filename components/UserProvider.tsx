"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

// Field user yang bisa diubah dari halaman Profile dan harus sinkron ke Sidebar.
interface UserOverrides {
  name?: string;
  avatarUrl?: string;
}

interface UserProfileContextValue extends UserOverrides {
  updateUser: (changes: UserOverrides) => void;
}

const STORAGE_KEY = "user-profile-overrides";

const UserProfileContext = createContext<UserProfileContextValue>({
  updateUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<UserOverrides>({});

  // TODO(backend): hapus localStorage ini, ganti dengan data dari API/session.
  // Dibaca di useEffect (bukan di useState) supaya tidak hydration mismatch.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setOverrides(JSON.parse(saved));
    } catch {
      // abaikan kalau storage tidak tersedia
    }
  }, []);

  const updateUser = useCallback((changes: UserOverrides) => {
    setOverrides((prev) => {
      const next = { ...prev, ...changes };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage penuh (foto besar), state tetap terupdate untuk sesi ini
      }
      return next;
    });
  }, []);

  return (
    <UserProfileContext.Provider value={{ ...overrides, updateUser }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}