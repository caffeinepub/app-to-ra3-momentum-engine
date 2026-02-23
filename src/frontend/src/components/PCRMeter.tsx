import { usePCR } from '@/hooks/usePCR';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface PCRMeterProps {
  symbol: 'NIFTY' | 'BANKNIFTY';
}

export function PCRMeter({ symbol }: PCRMeterProps) {
  const { data, isLoading } = usePCR(symbol);

  const getStrengthColor = (strength: string) => {
    if (strength === 'Strong Bullish') return 'text-success';
    if (strength === 'Bullish') return 'text-success/70';
    if (strength === 'Neutral') return 'text-muted-foreground';
    if (strength === 'Bearish') return 'text-destructive/70';
    if (strength === 'Strong Bearish') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getProgressValue = (pcr: number) => {
    // Map PCR (0-2) to progress (0-100)
    return Math.min(100, (pcr / 2) * 100);
  };

  const getProgressColor = (strength: string) => {
    if (strength.includes('Bullish')) return 'bg-success';
    if (strength.includes('Bearish')) return 'bg-destructive';
    return 'bg-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} PCR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{symbol} Put-Call Ratio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono">{data.pcr.toFixed(2)}</span>
            <span className={`text-sm font-semibold ${getStrengthColor(data.strength)}`}>
              {data.strength}
            </span>
          </div>
          <div className="relative">
            <Progress value={getProgressValue(data.pcr)} className="h-3" />
            <div className={`absolute inset-0 h-3 rounded-full ${getProgressColor(data.strength)} opacity-70`} 
                 style={{ width: `${getProgressValue(data.pcr)}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Strong Bearish</span>
            <span>Neutral</span>
            <span>Strong Bullish</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
