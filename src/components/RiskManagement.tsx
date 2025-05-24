
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Target, TrendingDown } from 'lucide-react';

interface RiskManagementProps {
  crypto: string;
}

const RiskManagement = ({ crypto }: RiskManagementProps) => {
  const currentPrice = crypto === 'BTC' ? 42350 : crypto === 'ETH' ? 2580 : 1.0;
  
  const riskData = {
    riskLevel: 'MEDIUM',
    volatility: '12.5%',
    stopLoss: currentPrice * 0.92, // 8% below current
    takeProfit: currentPrice * 1.15, // 15% above current
    positionSize: '3-5%',
    riskReward: '1:2.5',
    maxDrawdown: '15%',
    recommendations: [
      'Set stop-loss at 8% below entry',
      'Consider taking partial profits at +10%',
      'Monitor support level at $40,000 (BTC)',
      'Risk only 3-5% of portfolio on this trade'
    ]
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-600 hover:bg-green-700';
      case 'HIGH': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return <Shield size={16} />;
      case 'HIGH': return <AlertTriangle size={16} />;
      default: return <Target size={16} />;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield size={20} />
          Risk Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Level */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Risk Level</span>
          <Badge className={`${getRiskColor(riskData.riskLevel)} flex items-center gap-1`}>
            {getRiskIcon(riskData.riskLevel)}
            {riskData.riskLevel}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400">Volatility (30D)</p>
            <p className="text-lg font-semibold text-white">{riskData.volatility}</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-xs text-slate-400">Position Size</p>
            <p className="text-lg font-semibold text-white">{riskData.positionSize}</p>
          </div>
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-red-400" />
              <span className="text-sm text-red-400">Stop Loss</span>
            </div>
            <span className="font-semibold text-red-400">
              ${riskData.stopLoss.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-green-400" />
              <span className="text-sm text-green-400">Take Profit</span>
            </div>
            <span className="font-semibold text-green-400">
              ${riskData.takeProfit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">Risk:Reward</p>
            <p className="text-sm font-semibold text-white">{riskData.riskReward}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Max Drawdown</p>
            <p className="text-sm font-semibold text-white">{riskData.maxDrawdown}</p>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-sm font-medium text-white mb-2">Recommendations</p>
          <div className="space-y-2">
            {riskData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-slate-300">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-yellow-400 font-medium">Risk Warning</p>
              <p className="text-xs text-slate-300">
                Cryptocurrency trading involves substantial risk. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskManagement;
