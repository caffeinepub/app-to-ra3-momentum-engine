import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/contexts/SettingsContext';
import { useActor } from './useActor';

export type PCRStrength = 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strong Bearish';

export interface PCRData {
  symbol: string;
  pcr: number;
  strength: PCRStrength;
}

function calculatePCRStrength(pcr: number): PCRStrength {
  if (pcr >= 1.5) return 'Strong Bullish';
  if (pcr >= 1.2) return 'Bullish';
  if (pcr >= 0.8) return 'Neutral';
  if (pcr >= 0.5) return 'Bearish';
  return 'Strong Bearish';
}

export function usePCR(symbol: 'NIFTY' | 'BANKNIFTY') {
  const { isCredentialsValid } = useSettings();
  const { actor, isFetching } = useActor();

  return useQuery<PCRData>({
    queryKey: ['pcr', symbol],
    queryFn: async (): Promise<PCRData> => {
      if (!actor) throw new Error('Actor not initialized');

      const pcr = await actor.fetchPCR(symbol, 'WEEKLY_EXPIRY');
      const strength = calculatePCRStrength(pcr);

      return {
        symbol,
        pcr,
        strength,
      };
    },
    enabled: isCredentialsValid && !!actor && !isFetching,
    refetchInterval: 60000,
    retry: 1,
  });
}
