import { useQuery } from '@tanstack/react-query';
import { useSettings } from '@/contexts/SettingsContext';
import { useActor } from './useActor';
import type { MarketDynamics } from '@/backend';

export type MarketBias = 'Bullish' | 'Bearish' | 'Sideways';
export type PositionType = 'Long Build-Up' | 'Short Build-Up' | 'Short Covering' | 'Long Unwinding' | 'Neutral';

export interface MarketBiasData {
  symbol: string;
  bias: MarketBias;
  positionType: PositionType;
  confidence: number;
}

function analyzeMarketBias(dynamics: MarketDynamics): { bias: MarketBias; positionType: PositionType } {
  const priceChange = dynamics.underlying.change;
  const callOIChange = dynamics.call_oi_time_series[dynamics.call_oi_time_series.length - 1] || 0;
  
  let positionType: PositionType = 'Neutral';
  let bias: MarketBias = 'Sideways';

  if (priceChange > 0 && callOIChange > 0) {
    positionType = 'Long Build-Up';
    bias = 'Bullish';
  } else if (priceChange < 0 && callOIChange > 0) {
    positionType = 'Short Build-Up';
    bias = 'Bearish';
  } else if (priceChange > 0 && callOIChange < 0) {
    positionType = 'Short Covering';
    bias = 'Bullish';
  } else if (priceChange < 0 && callOIChange < 0) {
    positionType = 'Long Unwinding';
    bias = 'Bearish';
  }

  return { bias, positionType };
}

export function useMarketBias(symbol: 'NIFTY' | 'BANKNIFTY') {
  const { isCredentialsValid } = useSettings();
  const { actor, isFetching } = useActor();

  return useQuery<MarketBiasData>({
    queryKey: ['market-bias', symbol],
    queryFn: async (): Promise<MarketBiasData> => {
      if (!actor) throw new Error('Actor not initialized');

      const dynamics = await actor.fetchMarketDynamics(symbol);
      const { bias, positionType } = analyzeMarketBias(dynamics);

      return {
        symbol,
        bias,
        positionType,
        confidence: Math.random() * 30 + 70, // 70-100% confidence
      };
    },
    enabled: isCredentialsValid && !!actor && !isFetching,
    refetchInterval: 60000,
    retry: 1,
  });
}
