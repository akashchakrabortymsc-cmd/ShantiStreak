import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  nftsMinted: number;
  lastPracticeDate: string | null;
}

interface AppContextType {
  user: User | null;
  todayCompleted: boolean;
  loading: boolean;
  completePractice: () => void;
}

const defaultUser: User = {
  currentStreak: 0,
  longestStreak: 0,
  totalDays: 0,
  nftsMinted: 0,
  lastPracticeDate: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser({
        currentStreak: 5,
        longestStreak: 12,
        totalDays: 30,
        nftsMinted: 2,
        lastPracticeDate: new Date().toISOString(),
      });
      setLoading(false);
    }, 1000);
  }, []);

  const todayCompleted = user?.lastPracticeDate
    ? new Date(user.lastPracticeDate).toDateString() === new Date().toDateString()
    : false;

  const completePractice = () => {
    if (!user) return;

    const now = new Date();
    const lastPractice = user.lastPracticeDate ? new Date(user.lastPracticeDate) : null;

    let newStreak = user.currentStreak;
    
    if (lastPractice) {
      const daysDiff = Math.floor(
        (now.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === 0) {
        // Same day, no streak change
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newStreak += 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    setUser({
      ...user,
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      totalDays: user.totalDays + 1,
      lastPracticeDate: now.toISOString(),
    });
  };

  return (
    <AppContext.Provider value={{ user, todayCompleted, loading, completePractice }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
