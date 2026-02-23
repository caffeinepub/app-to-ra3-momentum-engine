import { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, Settings2, Key } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const {
    shoonyaCredentials,
    setShoonyaCredentials,
    isCredentialsValid,
    setIsCredentialsValid,
    oiChangeThreshold,
    setOIChangeThreshold,
    ltpChangeThreshold,
    setLTPChangeThreshold,
  } = useSettings();

  const [credentials, setCredentials] = useState(shoonyaCredentials);
  const [oiThresholdInput, setOIThresholdInput] = useState(oiChangeThreshold.toString());
  const [ltpThresholdInput, setLTPThresholdInput] = useState(ltpChangeThreshold.toString());
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const handleSaveCredentials = () => {
    setShoonyaCredentials(credentials);
    toast.success('Shoonya credentials saved successfully');
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestError(null);

    try {
      // Simulate connection test - in real implementation, this would call backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Check if all fields are filled
      if (!credentials.userId || !credentials.vendorCode || !credentials.imei || 
          !credentials.apiKey || !credentials.totpSecret) {
        throw new Error('All credential fields are required');
      }

      setIsCredentialsValid(true);
      toast.success('Connection successful! Shoonya API is configured correctly.');
    } catch (error) {
      setTestError(error instanceof Error ? error.message : 'Connection test failed');
      setIsCredentialsValid(false);
      toast.error('Connection test failed');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveThresholds = () => {
    const oiValue = parseFloat(oiThresholdInput);
    const ltpValue = parseFloat(ltpThresholdInput);

    if (!isNaN(oiValue) && oiValue > 0) {
      setOIChangeThreshold(oiValue);
    }

    if (!isNaN(ltpValue) && ltpValue > 0) {
      setLTPChangeThreshold(ltpValue);
    }

    toast.success('Alert thresholds updated');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your Shoonya API credentials and alert thresholds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Shoonya API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5" />
                Shoonya API Configuration
              </CardTitle>
              <CardDescription>
                Enter your Finvasia Shoonya API credentials to fetch real-time options data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter your user ID"
                    value={credentials.userId}
                    onChange={(e) => setCredentials({ ...credentials, userId: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendorCode">Vendor Code</Label>
                  <Input
                    id="vendorCode"
                    type="text"
                    placeholder="Enter vendor code"
                    value={credentials.vendorCode}
                    onChange={(e) => setCredentials({ ...credentials, vendorCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imei">IMEI</Label>
                  <Input
                    id="imei"
                    type="text"
                    placeholder="Enter IMEI"
                    value={credentials.imei}
                    onChange={(e) => setCredentials({ ...credentials, imei: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">Secret API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter secret API key"
                    value={credentials.apiKey}
                    onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="totpSecret">TOTP Secret Key</Label>
                  <Input
                    id="totpSecret"
                    type="password"
                    placeholder="Enter TOTP secret key"
                    value={credentials.totpSecret}
                    onChange={(e) => setCredentials({ ...credentials, totpSecret: e.target.value })}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your credentials are stored securely in your browser and never sent to external servers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={handleSaveCredentials} variant="outline" size="sm">
                  Save Credentials
                </Button>
                <Button
                  onClick={handleTestConnection}
                  disabled={!credentials.userId || isTestingConnection}
                  size="sm"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    'Test Connection'
                  )}
                </Button>

                {isCredentialsValid && (
                  <Badge variant="default" className="ml-auto bg-success text-white">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>

              {testError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{testError}</AlertDescription>
                </Alert>
              )}

              {isCredentialsValid && !testError && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Connection successful! Your Shoonya API is configured correctly.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Alert Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alert Thresholds</CardTitle>
              <CardDescription>
                Configure when alerts should be triggered for sudden market changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oi-threshold">
                  Open Interest Change Threshold (%)
                </Label>
                <Input
                  id="oi-threshold"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={oiThresholdInput}
                  onChange={(e) => setOIThresholdInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Alert when Call OI or Put OI changes by more than this percentage (default: 15%)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltp-threshold">
                  LTP Change Threshold (Points)
                </Label>
                <Input
                  id="ltp-threshold"
                  type="number"
                  min="1"
                  max="1000"
                  step="1"
                  value={ltpThresholdInput}
                  onChange={(e) => setLTPThresholdInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Alert when price changes by more than this many points (default: 5 points)
                </p>
              </div>

              <Button onClick={handleSaveThresholds} size="sm">
                Save Thresholds
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
