
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

  const { data: historicalData, isLoading, error } = useHistoricalPrices(coingeckoId, 30);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error || !historicalData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-slate-400">Unable to load price data</p>
      </div>
    );
  }

  // Transform CoinGecko data to chart format
  const chartData = historicalData.prices?.map((price: number[], index: number) => {
    const date = new Date(price[0]);
    return {
      date: date.toLocaleDateString(),
      price: Number(price[1].toFixed(2)),
      type: 'historical'
    };
  }) || [];

  // Add mock prediction data for the next 7 days
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

  const currentIndex = chartData.findIndex(d => d.type === 'predicted') - 1;

  return (
    <div className="h-96">
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
