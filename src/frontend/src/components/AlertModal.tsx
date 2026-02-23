import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AlertData } from '@/hooks/useAlertTrigger';

interface AlertModalProps {
  alertData: AlertData | null;
  onDismiss: () => void;
}

export function AlertModal({ alertData, onDismiss }: AlertModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (alertData) {
      setOpen(true);

      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [alertData]);

  const handleDismiss = () => {
    setOpen(false);
    setTimeout(() => {
      onDismiss();
    }, 300);
  };

  if (!alertData) return null;

  const formatChange = (metric: string, change: number) => {
    if (metric === 'ATM Strike') {
      return `${change > 0 ? '+' : ''}${change.toFixed(0)} points`;
    }
    return `${change > 0 ? '+' : ''}${change.toFixed(0)}`;
  };

  const getSignalColor = (signal: string) => {
    if (signal.includes('Spike') || signal.includes('Unusual')) {
      return 'text-warning';
    }
    return 'text-muted-foreground';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/assets/generated/alert-icon.dim_64x64.png" 
              alt="Alert" 
              className="h-12 w-12"
            />
            <div>
              <DialogTitle className="text-xl">Market Alert!</DialogTitle>
              <DialogDescription>
                Sudden change detected in {alertData.symbol} options
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Symbol:</span>
              <Badge variant="outline" className="text-base">
                {alertData.symbol}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Metric:</span>
              <Badge variant="outline" className="text-base">
                {alertData.metric}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Change:</span>
              <span className="text-lg font-bold text-warning">
                {formatChange(alertData.metric, alertData.change)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Signal:</span>
              <span className={`text-base font-semibold ${getSignalColor(alertData.signal)}`}>
                {alertData.signal}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Time:</span>
              <span className="text-sm font-mono">
                {alertData.timestamp.toLocaleTimeString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handleDismiss} variant="default">
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
