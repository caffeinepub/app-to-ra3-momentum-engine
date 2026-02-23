import { useRefreshTimer } from '@/hooks/useRefreshTimer';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Clock } from 'lucide-react';

export function RefreshIndicator() {
  const { countdown, lastUpdate } = useRefreshTimer(60000);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Last update: {formatTime(lastUpdate)}</span>
      </div>
      <Badge variant="outline" className="gap-2">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Next refresh in {countdown}s
      </Badge>
    </div>
  );
}
