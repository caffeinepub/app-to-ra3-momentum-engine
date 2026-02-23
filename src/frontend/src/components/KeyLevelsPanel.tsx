import { useKeyLevels } from '@/hooks/useKeyLevels';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Target, Zap } from 'lucide-react';

interface KeyLevelsPanelProps {
  symbol: 'NIFTY' | 'BANKNIFTY';
}

export function KeyLevelsPanel({ symbol }: KeyLevelsPanelProps) {
  const { data, isLoading } = useKeyLevels(symbol);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Key Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{symbol} Key Levels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-2">
            <ArrowUp className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Strong Resistance</span>
          </div>
          <Badge variant="outline" className="font-mono text-destructive border-destructive">
            {formatNumber(data.resistance)}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-warning" />
            <span className="text-sm font-medium">ATM Strike</span>
          </div>
          <Badge variant="outline" className="font-mono text-warning border-warning">
            {formatNumber(data.atmStrike)}
          </Badge>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center gap-2">
            <ArrowDown className="h-4 w-4 text-success" />
            <span className="text-sm font-medium">Strong Support</span>
          </div>
          <Badge variant="outline" className="font-mono text-success border-success">
            {formatNumber(data.support)}
          </Badge>
        </div>

        {data.breakoutLevels.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Breakout Levels</span>
            </div>
            <div className="flex gap-2">
              {data.breakoutLevels.map((level, i) => (
                <Badge key={i} variant="outline" className="font-mono text-primary border-primary">
                  {formatNumber(level)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
