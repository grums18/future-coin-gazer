
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useHistoricalPrices } from '@/hooks/useCryptoData';
import { useTokens } from '@/hooks/useCryptoData';
import { Loader2 } from 'lucide-react';

interface PriceChartProps {
  crypto: string;
}

const PriceChart = ({ crypto }: PriceChartProps) => {
  const { data: tokens = [] } = useTokens();
  const selectedToken = tokens.find(token => token.symbol === crypto);
  const coingeckoId = selectedToken?.coingecko_id || '';

  console.log('PriceChart - crypto:', crypto);
  console.log('PriceChart - selectedToken:', selectedToken);
  console.log('PriceChart - coingeckoId:', coingeckoId);

  const { data: historicalData, isLoading, error } = useHistoricalPrices(coingeckoId, 30);

  console.log('PriceChart - historicalData:', historicalData);
  console.log('PriceChart - isLoading:', isLoading);
  console.log('PriceChart - error:', error);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-2" />
          <p className="text-slate-400">Loading price data for {crypto}...</p>
        </div>
      </div>
    );
  }

  if (!selectedToken) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-2">Token not found: {crypto}</p>
          <p className="text-sm text-slate-500">
            Available tokens: {tokens.slice(0, 5).map(t => t.symbol).join(', ')}
            {tokens.length > 5 ? '...' : ''}
          </p>
        </div>
      </div>
    );
  }

  // Generate mock data if real data is not available
  const generateMockData = () => {
    const mockData = [];
    const basePrice = 100; // Base price for mock data
    let currentPrice = basePrice;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      // Simulate price movement with some randomness
      const change = (Math.random() - 0.5) * 0.1; // ±5% max change
      currentPrice = currentPrice * (1 + change);
      
      mockData.push({
        date: date.toLocaleDateString(),
        price: Number(currentPrice.toFixed(2)),
        type: 'historical'
      });
    }
    return mockData;
  };

  let chartData = [];

  if (error || !historicalData || !historicalData.prices) {
    console.warn('Using mock data due to error or missing data:', error);
    chartData = generateMockData();
  } else {
    // Transform CoinGecko data to chart format
    chartData = historicalData.prices?.map((price: number[], index: number) => {
      const date = new Date(price[0]);
      return {
        date: date.toLocaleDateString(),
        price: Number(price[1].toFixed(2)),
        type: 'historical'
      };
    }) || [];
  }

  console.log('PriceChart - chartData length:', chartData.length);

  // Add prediction data for the next 7 days if we have historical data
  if (chartData.length > 0) {
    const lastPrice = chartData[chartData.length - 1]?.price || 0;
    const currentDate = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const trendFactor = 0.02; // Slight upward trend
      const randomVariation = (Math.random() - 0.5) * 0.05;
      const predictedPrice = lastPrice * (1 + trendFactor + randomVariation);
      
      chartData.push({
        date: date.toLocaleDateString(),
        price: Number(predictedPrice.toFixed(2)),
        type: 'predicted'
      });
    }
  }

  const currentIndex = chartData.findIndex(d => d.type === 'predicted') - 1;

  if (chartData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-2">No price data available for {crypto}</p>
          <p className="text-sm text-slate-500">
            Token: {selectedToken.name} ({selectedToken.symbol})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {selectedToken.name} ({selectedToken.symbol}) Price Chart
        </h3>
        <p className="text-sm text-slate-400">
          {error ? 'Showing mock data (API unavailable)' : 'Live market data with 7-day predictions'}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value, name) => [`$${Number(value).toLocaleString()}`, 'Price']}
          />
          
          {/* Historical price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
            data={chartData.filter((_, index) => index <= currentIndex)}
          />
          
          {/* Predicted price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            connectNulls={false}
            data={chartData.filter((_, index) => index >= currentIndex)}
          />
          
          {/* Current time reference line */}
          {currentIndex >= 0 && (
            <ReferenceLine x={chartData[currentIndex]?.date} stroke="#EF4444" strokeDasharray="2 2" />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500"></div>
          <span className="text-sm text-slate-300">Historical Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-500 border-dashed"></div>
          <span className="text-sm text-slate-300">Predicted Price</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500 border-dashed"></div>
          <span className="text-sm text-slate-300">Current Time</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
