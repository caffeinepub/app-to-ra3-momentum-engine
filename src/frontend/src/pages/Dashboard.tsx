import { useState } from 'react';
import { SettingsPanel } from '@/components/SettingsPanel';
import { OptionChainTable } from '@/components/OptionChainTable';
import { MarketBiasPanel } from '@/components/MarketBiasPanel';
import { PCRMeter } from '@/components/PCRMeter';
import { SignalCard } from '@/components/SignalCard';
import { KeyLevelsPanel } from '@/components/KeyLevelsPanel';
import { NiftyAlertPanel } from '@/components/NiftyAlertPanel';
import { AlertModal } from '@/components/AlertModal';
import { RefreshIndicator } from '@/components/RefreshIndicator';
import { useAlertTrigger } from '@/hooks/useAlertTrigger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState<'NIFTY' | 'BANKNIFTY'>('NIFTY');
  const { alertData, dismissAlert } = useAlertTrigger();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">RA³ Momentum Engine</h1>
                <p className="text-xs text-muted-foreground">
                  Real-time NSE F&O Options Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <RefreshIndicator />
              <Button
                onClick={() => setSettingsOpen(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Symbol Tabs */}
        <Tabs value={activeSymbol} onValueChange={(v) => setActiveSymbol(v as 'NIFTY' | 'BANKNIFTY')} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="NIFTY">NIFTY</TabsTrigger>
            <TabsTrigger value="BANKNIFTY">BANKNIFTY</TabsTrigger>
          </TabsList>

          <TabsContent value="NIFTY" className="space-y-6">
            {/* Trading Signals - Most Prominent */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SignalCard symbol="NIFTY" />
              <SignalCard symbol="BANKNIFTY" />
            </div>

            {/* Market Analysis Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <MarketBiasPanel symbol="NIFTY" />
              <PCRMeter symbol="NIFTY" />
              <KeyLevelsPanel symbol="NIFTY" />
            </div>

            {/* Option Chain */}
            <OptionChainTable symbol="NIFTY" />
          </TabsContent>

          <TabsContent value="BANKNIFTY" className="space-y-6">
            {/* Trading Signals - Most Prominent */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SignalCard symbol="BANKNIFTY" />
              <SignalCard symbol="NIFTY" />
            </div>

            {/* Market Analysis Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              <MarketBiasPanel symbol="BANKNIFTY" />
              <PCRMeter symbol="BANKNIFTY" />
              <KeyLevelsPanel symbol="BANKNIFTY" />
            </div>

            {/* Option Chain */}
            <OptionChainTable symbol="BANKNIFTY" />
          </TabsContent>
        </Tabs>

        {/* Alert History - Collapsible Section */}
        <div className="mt-8">
          <NiftyAlertPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} RA³ Momentum Engine. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'ra3-momentum-engine'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Alert Modal */}
      <AlertModal alertData={alertData} onDismiss={dismissAlert} />
    </div>
  );
}
