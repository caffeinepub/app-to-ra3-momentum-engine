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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshIndicator } from './RefreshIndicator';

export function NiftyDataTable() {
  const { data: niftyData, isLoading: niftyLoading, isError: niftyError } = useOptionChainData('NIFTY');
  const { data: bankniftyData, isLoading: bankniftyLoading, isError: bankniftyError } = useOptionChainData('BANKNIFTY');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(num);
  };

  const isLoading = niftyLoading || bankniftyLoading;
  const isError = niftyError || bankniftyError;

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load options data. Please check your Shoonya API configuration.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle>Options Summary</CardTitle>
          {!isLoading && <RefreshIndicator />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/40 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Symbol</TableHead>
                <TableHead className="text-right font-semibold">ATM Strike</TableHead>
                <TableHead className="text-right font-semibold">Total Strikes</TableHead>
                <TableHead className="text-right font-semibold">Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  <TableRow>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 ml-auto" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32 ml-auto" /></TableCell>
                  </TableRow>
                </>
              ) : (
                <>
                  {niftyData && (
                    <TableRow className="hover:bg-accent/50">
                      <TableCell className="font-semibold">NIFTY</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(niftyData.atmStrike)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {niftyData.strikes.length}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {niftyData.lastUpdate.toLocaleTimeString('en-IN')}
                      </TableCell>
                    </TableRow>
                  )}
                  {bankniftyData && (
                    <TableRow className="hover:bg-accent/50">
                      <TableCell className="font-semibold">BANKNIFTY</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(bankniftyData.atmStrike)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {bankniftyData.strikes.length}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {bankniftyData.lastUpdate.toLocaleTimeString('en-IN')}
                      </TableCell>
                    </TableRow>
                  )}
                  {!niftyData && !bankniftyData && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No data available. Please configure your Shoonya API credentials in settings.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
