
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketOverviewProps {
  selectedCrypto: string;
  onSelectCrypto: (crypto: string) => void;
}

const MarketOverview = ({ selectedCrypto, onSelectCrypto }: MarketOverviewProps) => {
  const cryptoData = [
    { symbol: 'BTC', name: 'Bitcoin', price: 42350.50, change: 2.45, prediction: 'BUY' },
    { symbol: 'ETH', name: 'Ethereum', price: 2580.75, change: -1.23, prediction: 'HOLD' },
    { symbol: 'ADA', name: 'Cardano', price: 0.485, change: 5.67, prediction: 'BUY' },
    { symbol: 'SOL', name: 'Solana', price: 98.45, change: 3.21, prediction: 'BUY' },
    { symbol: 'DOT', name: 'Polkadot', price: 6.78, change: -2.15, prediction: 'SELL' },
    { symbol: 'LINK', name: 'Chainlink', price: 14.23, change: 1.89, prediction: 'HOLD' },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.symbol}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                selectedCrypto === crypto.symbol
                  ? 'bg-blue-600/20 border-blue-500'
                  : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700/70'
              }`}
              onClick={() => onSelectCrypto(crypto.symbol)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{crypto.symbol}</h3>
                  <p className="text-sm text-slate-400">{crypto.name}</p>
                </div>
                <Badge
                  variant={crypto.prediction === 'BUY' ? 'default' : crypto.prediction === 'SELL' ? 'destructive' : 'secondary'}
                  className={
                    crypto.prediction === 'BUY'
                      ? 'bg-green-600 hover:bg-green-700'
                      : crypto.prediction === 'SELL'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-yellow-600 hover:bg-yellow-700'
                  }
                >
                  {crypto.prediction}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">
                  ${crypto.price.toLocaleString()}
                </span>
                <div className={`flex items-center gap-1 ${crypto.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm font-medium">
                    {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
