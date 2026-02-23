import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/contexts/SettingsContext';
import { useActor } from './useActor';
import type { Signal } from '@/backend';

export function useTradingSignals(symbol: 'NIFTY' | 'BANKNIFTY') {
  const { isCredentialsValid } = useSettings();
  const { actor, isFetching } = useActor();

  return useQuery<Signal[]>({
    queryKey: ['trading-signals', symbol],
    queryFn: async (): Promise<Signal[]> => {
      if (!actor) throw new Error('Actor not initialized');

      const dynamics = await actor.fetchMarketDynamics(symbol);
      const signals = await actor.calculateTradeSignals(dynamics);

      return signals;
    },
    enabled: isCredentialsValid && !!actor && !isFetching,
    refetchInterval: 60000,
    retry: 1,
  });
}
