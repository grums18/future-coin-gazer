
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Target, Calendar, Loader2 } from 'lucide-react';
import { useTradingSignals, useCurrentPrices, useTokens } from '@/hooks/useCryptoData';
import { cryptoDataService } from '@/services/cryptoDataService';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PredictionPanelProps {
  crypto: string;
}

const PredictionPanel = ({ crypto }: PredictionPanelProps) => {
  const [generating, setGenerating] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: tokens = [] } = useTokens();
  const { data: signals = [], refetch: refetchSignals } = useTradingSignals(crypto);
  const { data: currentPrices = {} } = useCurrentPrices(tokens);

  const selectedToken = tokens.find(token => token.symbol === crypto);
  const currentPrice = currentPrices[selectedToken?.coingecko_id || '']?.usd || 0;

  // Get latest signals for 3D and 7D timeframes
  const signals3D = signals.filter(s => s.timeframe === '3D').slice(0, 1);
  const signals7D = signals.filter(s => s.timeframe === '7D').slice(0, 1);

  const handleGeneratePrediction = async (timeframe: string) => {
    if (!selectedToken) return;

    setGenerating(timeframe);
    try {
      await cryptoDataService.generateTradingSignal(selectedToken.symbol, timeframe);
      await refetchSignals();
      toast({
        title: "Prediction Generated",
        description: `New ${timeframe} prediction created for ${crypto}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prediction",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY': return 'bg-green-600 hover:bg-green-700';
      case 'SELL': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY': return <TrendingUp size={16} />;
      case 'SELL': return <TrendingDown size={16} />;
      default: return <Target size={16} />;
    }
  };

  const renderPredictionCard = (timeframe: string, signal: any) => {
    const hasSignal = signal && signal.length > 0;
    const latestSignal = hasSignal ? signal[0] : null;

    return (
      <Card key={timeframe} className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar size={20} />
            {timeframe === '3D' ? '3-Day' : '7-Day'} Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasSignal ? (
            <div className="text-center py-4">
              <p className="text-slate-400 mb-4">No recent prediction available</p>
              <Button
                onClick={() => handleGeneratePrediction(timeframe)}
                disabled={generating === timeframe}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {generating === timeframe ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Prediction'
                )}
              </Button>
            </div>
          ) : (
            <>
              {/* Signal and Confidence */}
              <div className="flex items-center justify-between">
                <Badge className={`${getSignalColor(latestSignal.signal_type)} flex items-center gap-1`}>
                  {getSignalIcon(latestSignal.signal_type)}
                  {latestSignal.signal_type}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Confidence</p>
                  <p className="text-lg font-bold text-white">{Math.round(latestSignal.confidence_score)}%</p>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <Progress 
                value={latestSignal.confidence_score} 
                className="h-2"
              />

              {/* Price Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Current Price</p>
                  <p className="text-lg font-semibold text-white">
                    ${currentPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Target Price</p>
                  <p className="text-lg font-semibold text-green-400">
                    ${latestSignal.target_price?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Expected Change */}
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Expected Change</span>
                  <span className="font-semibold text-green-400">
                    {latestSignal.target_price && currentPrice ? 
                      `${((latestSignal.target_price - currentPrice) / currentPrice * 100).toFixed(2)}%` : 
                      'N/A'
                    }
                  </span>
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Risk Level</span>
                <Badge variant="outline" className={
                  latestSignal.risk_level === 'LOW' ? 'border-green-400 text-green-400' :
                  latestSignal.risk_level === 'HIGH' ? 'border-red-400 text-red-400' :
                  'border-yellow-400 text-yellow-400'
                }>
                  {latestSignal.risk_level || 'MEDIUM'}
                </Badge>
              </div>

              {/* Generate New Prediction Button */}
              <Button
                onClick={() => handleGeneratePrediction(timeframe)}
                disabled={generating === timeframe}
                variant="outline"
                className="w-full"
              >
                {generating === timeframe ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate New Prediction'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderPredictionCard('3D', signals3D)}
      {renderPredictionCard('7D', signals7D)}
    </div>
  );
};

export default PredictionPanel;
