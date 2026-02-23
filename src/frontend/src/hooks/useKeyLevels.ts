import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/contexts/SettingsContext';
import { useActor } from './useActor';

export interface KeyLevelsData {
  symbol: string;
  resistance: number;
  support: number;
  atmStrike: number;
  breakoutLevels: number[];
}

export function useKeyLevels(symbol: 'NIFTY' | 'BANKNIFTY') {
  const { isCredentialsValid } = useSettings();
  const { actor, isFetching } = useActor();

  return useQuery<KeyLevelsData>({
    queryKey: ['key-levels', symbol],
    queryFn: async (): Promise<KeyLevelsData> => {
      if (!actor) throw new Error('Actor not initialized');

      const keyLevels = await actor.fetchKeyLevels(symbol, 'WEEKLY_EXPIRY');
      const atmStrikes = await actor.fetchATMStrikes(symbol, 'WEEKLY_EXPIRY');

      return {
        symbol,
        resistance: keyLevels.length > 0 ? Number(keyLevels[0]) : 0,
        support: keyLevels.length > 1 ? Number(keyLevels[1]) : 0,
        atmStrike: atmStrikes.length > 0 ? Number(atmStrikes[0]) : 0,
        breakoutLevels: keyLevels.slice(2, 4).map(Number),
      };
    },
    enabled: isCredentialsValid && !!actor && !isFetching,
    refetchInterval: 60000,
    retry: 1,
  });
}
