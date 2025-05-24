
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PriceChartProps {
  crypto: string;
}

const PriceChart = ({ crypto }: PriceChartProps) => {
  // Mock historical and predicted data
  const generateMockData = () => {
    const data = [];
    const basePrice = crypto === 'BTC' ? 42000 : crypto === 'ETH' ? 2500 : 1;
    const currentDate = new Date();
    
    // Historical data (last 30 days)
    for (let i = 30; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const randomVariation = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + randomVariation + (i * 0.002));
      
      data.push({
        date: date.toLocaleDateString(),
        price: Number(price.toFixed(2)),
        type: 'historical'
      });
    }
    
    // Predicted data (next 7 days)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const trendFactor = 0.02; // Slight upward trend
      const randomVariation = (Math.random() - 0.5) * 0.05;
      const lastPrice = data[data.length - 1].price;
      const predictedPrice = lastPrice * (1 + trendFactor + randomVariation);
      
      data.push({
        date: date.toLocaleDateString(),
        price: Number(predictedPrice.toFixed(2)),
        type: 'predicted'
      });
    }
    
    return data;
  };

  const data = generateMockData();
  const currentIndex = data.findIndex(d => d.type === 'predicted') - 1;

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            data={data.filter((_, index) => index <= currentIndex)}
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
            data={data.filter((_, index) => index >= currentIndex)}
          />
          
          {/* Current time reference line */}
          <ReferenceLine x={data[currentIndex]?.date} stroke="#EF4444" strokeDasharray="2 2" />
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
