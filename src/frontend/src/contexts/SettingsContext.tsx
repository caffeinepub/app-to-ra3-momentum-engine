import React, { createContext, useContext, useState, useEffect } from 'react';

interface ShoonyaCredentials {
  userId: string;
  vendorCode: string;
  imei: string;
  apiKey: string;
  totpSecret: string;
}

interface SettingsContextType {
  shoonyaCredentials: ShoonyaCredentials;
  setShoonyaCredentials: (credentials: ShoonyaCredentials) => void;
  isCredentialsValid: boolean;
  setIsCredentialsValid: (valid: boolean) => void;
  oiChangeThreshold: number;
  setOIChangeThreshold: (threshold: number) => void;
  ltpChangeThreshold: number;
  setLTPChangeThreshold: (threshold: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SHOONYA_CREDENTIALS: 'shoonya_credentials',
  OI_THRESHOLD: 'oi_change_threshold',
  LTP_THRESHOLD: 'ltp_change_threshold',
};

const DEFAULT_CREDENTIALS: ShoonyaCredentials = {
  userId: '',
  vendorCode: '',
  imei: '',
  apiKey: '',
  totpSecret: '',
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [shoonyaCredentials, setShoonyaCredentialsState] = useState<ShoonyaCredentials>(DEFAULT_CREDENTIALS);
  const [isCredentialsValid, setIsCredentialsValid] = useState<boolean>(false);
  const [oiChangeThreshold, setOIChangeThresholdState] = useState<number>(15);
  const [ltpChangeThreshold, setLTPChangeThresholdState] = useState<number>(5);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem(STORAGE_KEYS.SHOONYA_CREDENTIALS);
    const savedOIThreshold = localStorage.getItem(STORAGE_KEYS.OI_THRESHOLD);
    const savedLTPThreshold = localStorage.getItem(STORAGE_KEYS.LTP_THRESHOLD);

    if (savedCredentials) {
      try {
        setShoonyaCredentialsState(JSON.parse(savedCredentials));
      } catch (error) {
        console.error('Failed to parse saved credentials:', error);
      }
    }

    if (savedOIThreshold) {
      setOIChangeThresholdState(parseFloat(savedOIThreshold));
    }

    if (savedLTPThreshold) {
      setLTPChangeThresholdState(parseFloat(savedLTPThreshold));
    }
  }, []);

  const setShoonyaCredentials = (credentials: ShoonyaCredentials) => {
    setShoonyaCredentialsState(credentials);
    localStorage.setItem(STORAGE_KEYS.SHOONYA_CREDENTIALS, JSON.stringify(credentials));
  };

  const setOIChangeThreshold = (threshold: number) => {
    setOIChangeThresholdState(threshold);
    localStorage.setItem(STORAGE_KEYS.OI_THRESHOLD, threshold.toString());
  };

  const setLTPChangeThreshold = (threshold: number) => {
    setLTPChangeThresholdState(threshold);
    localStorage.setItem(STORAGE_KEYS.LTP_THRESHOLD, threshold.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        shoonyaCredentials,
        setShoonyaCredentials,
        isCredentialsValid,
        setIsCredentialsValid,
        oiChangeThreshold,
        setOIChangeThreshold,
        ltpChangeThreshold,
        setLTPChangeThreshold,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
