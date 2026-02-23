import { useMarketBias } from '@/hooks/useMarketBias';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketBiasPanelProps {
  symbol: 'NIFTY' | 'BANKNIFTY';
}

export function MarketBiasPanel({ symbol }: MarketBiasPanelProps) {
  const { data, isLoading } = useMarketBias(symbol);

  const getBiasIcon = (bias: string) => {
    if (bias === 'Bullish') return <TrendingUp className="h-5 w-5" />;
    if (bias === 'Bearish') return <TrendingDown className="h-5 w-5" />;
    return <Minus className="h-5 w-5" />;
  };

  const getBiasColor = (bias: string) => {
    if (bias === 'Bullish') return 'bg-success text-white';
    if (bias === 'Bearish') return 'bg-destructive text-white';
    return 'bg-muted text-foreground';
  };

  const getPositionColor = (position: string) => {
    if (position.includes('Long Build-Up') || position.includes('Short Covering')) {
      return 'text-success';
    }
    if (position.includes('Short Build-Up') || position.includes('Long Unwinding')) {
      return 'text-destructive';
    }
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Market Bias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{symbol} Market Bias</span>
          <Badge className={getBiasColor(data.bias)}>
            {getBiasIcon(data.bias)}
            <span className="ml-1">{data.bias}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Position Type:</span>
            <span className={`text-base font-semibold ${getPositionColor(data.positionType)}`}>
              {data.positionType}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Confidence:</span>
            <span className="text-base font-semibold">
              {data.confidence.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
