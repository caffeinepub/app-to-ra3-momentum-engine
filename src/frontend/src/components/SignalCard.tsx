import { useTradingSignals } from '@/hooks/useTradingSignals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Pause, AlertCircle } from 'lucide-react';

interface SignalCardProps {
  symbol: 'NIFTY' | 'BANKNIFTY';
}

export function SignalCard({ symbol }: SignalCardProps) {
  const { data, isLoading } = useTradingSignals(symbol);

  const getSignalIcon = (action: string) => {
    if (action === 'BUY_CALL') return <TrendingUp className="h-6 w-6" />;
    if (action === 'BUY_PUT') return <TrendingDown className="h-6 w-6" />;
    return <Pause className="h-6 w-6" />;
  };

  const getSignalColor = (action: string) => {
    if (action === 'BUY_CALL') return 'bg-success text-white';
    if (action === 'BUY_PUT') return 'bg-destructive text-white';
    return 'bg-muted text-foreground';
  };

  const getSignalText = (action: string) => {
    if (action === 'BUY_CALL') return 'BUY CALL';
    if (action === 'BUY_PUT') return 'BUY PUT';
    return 'WAIT / NO TRADE';
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'High') return 'bg-warning text-white';
    if (urgency === 'Medium') return 'bg-warning/60 text-white';
    return 'bg-muted text-foreground';
  };

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>{symbol} Trading Signal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-8 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const primarySignal = data && data.length > 0 ? data[0] : null;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{symbol} Trading Signal</span>
          {primarySignal && (
            <Badge className={getUrgencyColor(primarySignal.urgency)}>
              <AlertCircle className="h-3 w-3 mr-1" />
              {primarySignal.urgency} Priority
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!primarySignal ? (
          <div className="text-center py-8">
            <Pause className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-muted-foreground">WAIT / NO TRADE</p>
            <p className="text-sm text-muted-foreground mt-2">No clear setup detected</p>
          </div>
        ) : (
          <>
            <div className={`flex items-center justify-center gap-3 p-6 rounded-lg ${getSignalColor(primarySignal.action)}`}>
              {getSignalIcon(primarySignal.action)}
              <span className="text-2xl font-bold">{getSignalText(primarySignal.action)}</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Rationale:</span> {primarySignal.message}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-mono font-semibold">
                  ₹{primarySignal.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expiry:</span>
                <span className="font-semibold">{primarySignal.expiry}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
