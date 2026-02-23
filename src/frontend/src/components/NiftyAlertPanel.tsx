import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, Bell } from 'lucide-react';
import type { AlertData } from '@/hooks/useAlertTrigger';

interface StoredAlert extends AlertData {
  id: string;
}

export function NiftyAlertPanel() {
  const [alerts, setAlerts] = useState<StoredAlert[]>([]);

  // Load alerts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ra3_alerts');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAlerts(parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        })));
      } catch (error) {
        console.error('Failed to load alerts:', error);
      }
    }
  }, []);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ra3_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const clearAlerts = () => {
    setAlerts([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert History
            {alerts.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {alerts.length}
              </Badge>
            )}
          </CardTitle>
          {alerts.length > 0 && (
            <Button onClick={clearAlerts} variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No alerts yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Alerts will appear when significant market changes are detected
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-border/40 bg-card p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {alert.symbol}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {alert.metric}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Change: </span>
                      <span className="font-semibold text-warning">
                        {formatChange(alert.metric, alert.change)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Signal: </span>
                      <span className={`font-semibold ${getSignalColor(alert.signal)}`}>
                        {alert.signal}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
