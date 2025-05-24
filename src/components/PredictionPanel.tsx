
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react';

interface PredictionPanelProps {
  crypto: string;
}

const PredictionPanel = ({ crypto }: PredictionPanelProps) => {
  const predictions = {
    '3day': {
      signal: 'BUY',
      confidence: 78,
      priceTarget: crypto === 'BTC' ? 44500 : crypto === 'ETH' ? 2680 : 1.2,
      currentPrice: crypto === 'BTC' ? 42350 : crypto === 'ETH' ? 2580 : 1.0,
      change: 5.07,
      factors: ['Rising RSI', 'Volume Increase', 'Support Level Hold']
    },
    '7day': {
      signal: 'HOLD',
      confidence: 65,
      priceTarget: crypto === 'BTC' ? 43800 : crypto === 'ETH' ? 2620 : 1.1,
      currentPrice: crypto === 'BTC' ? 42350 : crypto === 'ETH' ? 2580 : 1.0,
      change: 3.42,
      factors: ['Market Uncertainty', 'Mixed Signals', 'Resistance Near']
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(predictions).map(([timeframe, prediction]) => (
        <Card key={timeframe} className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar size={20} />
              {timeframe === '3day' ? '3-Day' : '7-Day'} Prediction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signal and Confidence */}
            <div className="flex items-center justify-between">
              <Badge className={`${getSignalColor(prediction.signal)} flex items-center gap-1`}>
                {getSignalIcon(prediction.signal)}
                {prediction.signal}
              </Badge>
              <div className="text-right">
                <p className="text-sm text-slate-400">Confidence</p>
                <p className="text-lg font-bold text-white">{prediction.confidence}%</p>
              </div>
            </div>

            {/* Confidence Progress Bar */}
            <Progress 
              value={prediction.confidence} 
              className="h-2"
            />

            {/* Price Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Current Price</p>
                <p className="text-lg font-semibold text-white">
                  ${prediction.currentPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Target Price</p>
                <p className="text-lg font-semibold text-green-400">
                  ${prediction.priceTarget.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Expected Change */}
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Expected Change</span>
                <span className={`font-semibold ${prediction.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {prediction.change >= 0 ? '+' : ''}{prediction.change}%
                </span>
              </div>
            </div>

            {/* Key Factors */}
            <div>
              <p className="text-sm text-slate-400 mb-2">Key Factors</p>
              <div className="space-y-1">
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PredictionPanel;
