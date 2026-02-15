import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  publicKey: { toBase58: () => string } | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<{ toBase58: () => string } | null>(null);

  const connect = async () => {
    try {
      // Mock wallet connection
      setPublicKey({
        toBase58: () => "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      });
      setConnected(true);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setConnected(false);
  };

  return (
    <WalletContext.Provider value={{ connected, connect, disconnect, publicKey }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
