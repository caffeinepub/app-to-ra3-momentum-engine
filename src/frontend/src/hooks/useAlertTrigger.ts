import { useState, useEffect, useRef } from 'react';
import { useOptionChainData } from './useOptionChainData';
import { useSettings } from '@/contexts/SettingsContext';

export interface AlertData {
  metric: string;
  change: number;
  signal: string;
  timestamp: Date;
  symbol: string;
}

interface PreviousData {
  niftyATM: number;
  bankniftyATM: number;
  timestamp: Date;
}

export function useAlertTrigger() {
  const { data: niftyData } = useOptionChainData('NIFTY');
  const { data: bankniftyData } = useOptionChainData('BANKNIFTY');
  const { oiChangeThreshold, ltpChangeThreshold } = useSettings();
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const previousDataRef = useRef<PreviousData | null>(null);

  useEffect(() => {
    if (!niftyData && !bankniftyData) {
      return;
    }

    if (!previousDataRef.current) {
      previousDataRef.current = {
        niftyATM: niftyData?.atmStrike || 0,
        bankniftyATM: bankniftyData?.atmStrike || 0,
        timestamp: new Date(),
      };
      return;
    }

    const prev = previousDataRef.current;

    // Check NIFTY ATM change
    if (niftyData) {
      const atmChange = Math.abs(niftyData.atmStrike - prev.niftyATM);
      if (atmChange >= ltpChangeThreshold) {
        setAlertData({
          metric: 'ATM Strike',
          change: niftyData.atmStrike - prev.niftyATM,
          signal: 'ATM Shift Detected',
          timestamp: new Date(),
          symbol: 'NIFTY',
        });
      }

      // Check for OI spikes in NIFTY
      const spikeStrikes = niftyData.strikes.filter(s => s.hasOISpike);
      if (spikeStrikes.length > 0) {
        const maxOIChange = Math.max(
          ...spikeStrikes.map(s => Math.abs(s.callOIChange)),
          ...spikeStrikes.map(s => Math.abs(s.putOIChange))
        );
        setAlertData({
          metric: 'OI Spike',
          change: maxOIChange,
          signal: 'Unusual OI Activity',
          timestamp: new Date(),
          symbol: 'NIFTY',
        });
      }
    }

    // Check BANKNIFTY ATM change
    if (bankniftyData) {
      const atmChange = Math.abs(bankniftyData.atmStrike - prev.bankniftyATM);
      if (atmChange >= ltpChangeThreshold * 2) { // Higher threshold for BANKNIFTY
        setAlertData({
          metric: 'ATM Strike',
          change: bankniftyData.atmStrike - prev.bankniftyATM,
          signal: 'ATM Shift Detected',
          timestamp: new Date(),
          symbol: 'BANKNIFTY',
        });
      }

      // Check for OI spikes in BANKNIFTY
      const spikeStrikes = bankniftyData.strikes.filter(s => s.hasOISpike);
      if (spikeStrikes.length > 0) {
        const maxOIChange = Math.max(
          ...spikeStrikes.map(s => Math.abs(s.callOIChange)),
          ...spikeStrikes.map(s => Math.abs(s.putOIChange))
        );
        setAlertData({
          metric: 'OI Spike',
          change: maxOIChange,
          signal: 'Unusual OI Activity',
          timestamp: new Date(),
          symbol: 'BANKNIFTY',
        });
      }
    }

    previousDataRef.current = {
      niftyATM: niftyData?.atmStrike || prev.niftyATM,
      bankniftyATM: bankniftyData?.atmStrike || prev.bankniftyATM,
      timestamp: new Date(),
    };
  }, [niftyData, bankniftyData, oiChangeThreshold, ltpChangeThreshold]);

  const dismissAlert = () => {
    setAlertData(null);
  };

  return {
    alertData,
    dismissAlert,
  };
}
