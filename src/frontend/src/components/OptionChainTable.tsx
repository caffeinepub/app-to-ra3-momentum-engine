import { useOptionChainData } from '@/hooks/useOptionChainData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OptionChainTableProps {
  symbol: 'NIFTY' | 'BANKNIFTY';
}

export function OptionChainTable({ symbol }: OptionChainTableProps) {
  const { data, isLoading, isError, error } = useOptionChainData(symbol);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-3 w-3" />;
    if (change < 0) return <ArrowDown className="h-3 w-3" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : `Failed to load ${symbol} option chain data.`}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {symbol} Option Chain
          {data && (
            <span className="text-sm font-normal text-muted-foreground">
              ATM: {formatNumber(data.atmStrike)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-center">Strike</TableHead>
                <TableHead className="text-right font-semibold">LTP</TableHead>
                <TableHead className="text-right font-semibold">Call OI</TableHead>
                <TableHead className="text-right font-semibold">Call OI Δ</TableHead>
                <TableHead className="text-right font-semibold">Put OI</TableHead>
                <TableHead className="text-right font-semibold">Put OI Δ</TableHead>
                <TableHead className="text-right font-semibold">Volume</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 11 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !data ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No data available. Please configure your Shoonya API credentials in settings.
                  </TableCell>
                </TableRow>
              ) : (
                data.strikes.map((strike) => (
                  <TableRow
                    key={strike.strike}
                    className={`hover:bg-accent/50 ${
                      strike.strike === data.atmStrike ? 'bg-accent/30 font-semibold' : ''
                    } ${strike.hasOISpike ? 'bg-warning/10' : ''}`}
                  >
                    <TableCell className="text-center font-mono">
                      <div className="flex items-center justify-center gap-1">
                        {strike.hasOISpike && <AlertTriangle className="h-3 w-3 text-warning" />}
                        {formatNumber(strike.strike)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPrice(strike.ltp)}
                    </TableCell>
                    <TableCell className={`text-right font-mono ${strike.isHighestCallOI ? 'bg-destructive/20 font-bold' : ''}`}>
                      {formatNumber(strike.callOI)}
                    </TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${getChangeColor(strike.callOIChange)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {getChangeIcon(strike.callOIChange)}
                        {formatNumber(Math.abs(strike.callOIChange))}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${strike.isHighestPutOI ? 'bg-success/20 font-bold' : ''}`}>
                      {formatNumber(strike.putOI)}
                    </TableCell>
                    <TableCell className={`text-right font-mono font-semibold ${getChangeColor(strike.putOIChange)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {getChangeIcon(strike.putOIChange)}
                        {formatNumber(Math.abs(strike.putOIChange))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatNumber(strike.volume)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
