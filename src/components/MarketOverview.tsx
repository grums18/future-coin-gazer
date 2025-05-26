
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useTokens, useCurrentPrices, useTradingSignals } from '@/hooks/useCryptoData';

interface MarketOverviewProps {
  selectedCrypto: string;
  onSelectCrypto: (crypto: string) => void;
}

const MarketOverview = ({ selectedCrypto, onSelectCrypto }: MarketOverviewProps) => {
  const { data: tokens = [], isLoading: tokensLoading } = useTokens();
  const { data: currentPrices = {}, isLoading: pricesLoading } = useCurrentPrices(tokens);
  const { data: signals = [] } = useTradingSignals();

  // Show only top 12 tokens for the overview
  const displayTokens = tokens.slice(0, 12);

  if (tokensLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayTokens.map((token) => {
            const priceData = currentPrices[token.coingecko_id || ''];
            const price = priceData?.usd || 0;
            const change = priceData?.usd_24h_change || 0;
            
            // Find latest signal for this token
            const latestSignal = signals.find(s => s.token_symbol === token.symbol);
            const prediction = latestSignal?.signal_type || 'HOLD';

            return (
              <div
                key={token.symbol}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  selectedCrypto === token.symbol
                    ? 'bg-blue-600/20 border-blue-500'
                    : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700/70'
                }`}
                onClick={() => onSelectCrypto(token.symbol)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{token.symbol}</h3>
                    <p className="text-sm text-slate-400">{token.name}</p>
                  </div>
                  <Badge
                    variant={prediction === 'BUY' ? 'default' : prediction === 'SELL' ? 'destructive' : 'secondary'}
                    className={
                      prediction === 'BUY'
                        ? 'bg-green-600 hover:bg-green-700'
                        : prediction === 'SELL'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-yellow-600 hover:bg-yellow-700'
                    }
                  >
                    {prediction}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">
                    {pricesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `$${price.toLocaleString(undefined, { 
                        minimumFractionDigits: price < 1 ? 4 : 2,
                        maximumFractionDigits: price < 1 ? 4 : 2 
                      })}`
                    )}
                  </span>
                  <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="text-sm font-medium">
                      {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
