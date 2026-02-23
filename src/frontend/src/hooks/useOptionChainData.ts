import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/contexts/SettingsContext';
import { useActor } from './useActor';

export interface OptionStrike {
  strike: number;
  ltp: number;
  callOI: number;
  callOIChange: number;
  putOI: number;
  putOIChange: number;
  volume: number;
  isHighestCallOI: boolean;
  isHighestPutOI: boolean;
  hasOISpike: boolean;
}

export interface OptionChainData {
  symbol: string;
  atmStrike: number;
  strikes: OptionStrike[];
  lastUpdate: Date;
}

// Simulated data for demonstration
function generateMockOptionChain(symbol: string): OptionChainData {
  const baseStrike = symbol === 'NIFTY' ? 23000 : 50000;
  const strikeInterval = symbol === 'NIFTY' ? 50 : 100;
  const atmStrike = baseStrike;
  
  const strikes: OptionStrike[] = [];
  let maxCallOI = 0;
  let maxPutOI = 0;
  let maxCallOIStrike = 0;
  let maxPutOIStrike = 0;

  // Generate ±5 strikes around ATM
  for (let i = -5; i <= 5; i++) {
    const strike = atmStrike + (i * strikeInterval);
    const callOI = Math.random() * 100000 + 50000;
    const putOI = Math.random() * 100000 + 50000;
    
    if (callOI > maxCallOI) {
      maxCallOI = callOI;
      maxCallOIStrike = strike;
    }
    if (putOI > maxPutOI) {
      maxPutOI = putOI;
      maxPutOIStrike = strike;
    }

    strikes.push({
      strike,
      ltp: Math.random() * 200 + 50,
      callOI,
      callOIChange: (Math.random() - 0.5) * 10000,
      putOI,
      putOIChange: (Math.random() - 0.5) * 10000,
      volume: Math.random() * 50000 + 10000,
      isHighestCallOI: false,
      isHighestPutOI: false,
      hasOISpike: Math.random() > 0.85, // 15% chance of spike
    });
  }

  // Mark highest OI strikes
  strikes.forEach(s => {
    s.isHighestCallOI = s.strike === maxCallOIStrike;
    s.isHighestPutOI = s.strike === maxPutOIStrike;
  });

  return {
    symbol,
    atmStrike,
    strikes,
    lastUpdate: new Date(),
  };
}

export function useOptionChainData(symbol: 'NIFTY' | 'BANKNIFTY') {
  const { isCredentialsValid } = useSettings();
  const { actor, isFetching } = useActor();

  return useQuery<OptionChainData>({
    queryKey: ['option-chain', symbol],
    queryFn: async (): Promise<OptionChainData> => {
      // In real implementation, this would call Shoonya API via backend
      // For now, return mock data
      return generateMockOptionChain(symbol);
    },
    enabled: isCredentialsValid && !!actor && !isFetching,
    refetchInterval: 60000, // 1 minute
    retry: 1,
    staleTime: 55000,
  });
}
