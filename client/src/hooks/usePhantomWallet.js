import { useState, useEffect } from 'react';

export const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const phantom = window.solana;
    if (phantom?.isPhantom) {
      setWallet(phantom);
      // Check if already connected
      phantom.connect({ onlyIfTrusted: true }).catch(() => {});
    }
  }, []);

  const connect = async () => {
    if (!wallet) return;
    
    try {
      setConnecting(true);
      const response = await wallet.connect();
      setConnected(true);
      return response.publicKey.toString();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (wallet) {
      await wallet.disconnect();
      setConnected(false);
    }
  };

  return {
    wallet,
    connected,
    connecting,
    connect,
    disconnect,
    publicKey: wallet?.publicKey?.toString()
  };
};