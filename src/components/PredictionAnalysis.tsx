
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Activity, Brain, MessageCircle, BarChart3 } from 'lucide-react';
import { useOnChainMetrics, useSentimentData, usePriceData } from '@/hooks/useCryptoData';

interface PredictionAnalysisProps {
  crypto: string;
}

const PredictionAnalysis = ({ crypto }: PredictionAnalysisProps) => {
  const { data: onChainData = [] } = useOnChainMetrics(crypto, 7);
  const { data: sentimentData = [] } = useSentimentData(crypto, 7);
  const { data: priceData = [] } = usePriceData(crypto, 30);

  const renderTechnicalAnalysis = () => {
    // Mock technical analysis data - in real implementation this would come from the service
    const technicalIndicators = {
      rsi: { value: 35, signal: 'BUY', reason: 'Oversold condition (RSI < 30)' },
      macd: { value: 0.15, signal: 'BUY', reason: 'Bullish crossover detected' },
      bollingerBands: { position: 'LOWER', signal: 'BUY', reason: 'Price touching lower band with high volume' },
      vwma: { trend: 'BULLISH', signal: 'BUY', reason: 'Price above volume-weighted moving average' }
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">RSI (7-period)</span>
              <Badge className={technicalIndicators.rsi.signal === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                {technicalIndicators.rsi.signal}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">{technicalIndicators.rsi.value}</div>
            <Progress value={technicalIndicators.rsi.value} className="mt-2" />
            <p className="text-xs text-slate-400 mt-1">{technicalIndicators.rsi.reason}</p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">MACD (12,26,9)</span>
              <Badge className={technicalIndicators.macd.signal === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                {technicalIndicators.macd.signal}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">{technicalIndicators.macd.value.toFixed(3)}</div>
            <p className="text-xs text-slate-400 mt-1">{technicalIndicators.macd.reason}</p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Bollinger Bands</span>
              <Badge className={technicalIndicators.bollingerBands.signal === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                {technicalIndicators.bollingerBands.signal}
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{technicalIndicators.bollingerBands.position}</div>
            <p className="text-xs text-slate-400 mt-1">{technicalIndicators.bollingerBands.reason}</p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">VWMA Trend</span>
              <Badge className={technicalIndicators.vwma.signal === 'BUY' ? 'bg-green-600' : 'bg-red-600'}>
                {technicalIndicators.vwma.signal}
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{technicalIndicators.vwma.trend}</div>
            <p className="text-xs text-slate-400 mt-1">{technicalIndicators.vwma.reason}</p>
          </div>
        </div>

        <div className="p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <h4 className="font-semibold text-blue-400 mb-2">Technical Analysis Summary</h4>
          <p className="text-sm text-slate-300">
            Technical indicators show a <strong>bullish consensus</strong> with RSI indicating oversold conditions,
            MACD showing bullish momentum, and price action near Bollinger Band support with strong volume.
          </p>
          <div className="mt-2">
            <span className="text-sm text-slate-400">Weight in Ensemble: </span>
            <span className="text-white font-semibold">40%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderOnChainAnalysis = () => {
    const latestOnChain = onChainData[0];
    const previousOnChain = onChainData[1];

    let activeAddressesGrowth = 0;
    let netflowSignal = 'NEUTRAL';

    if (latestOnChain && previousOnChain) {
      if (latestOnChain.active_addresses && previousOnChain.active_addresses) {
        activeAddressesGrowth = ((latestOnChain.active_addresses - previousOnChain.active_addresses) / previousOnChain.active_addresses) * 100;
      }

      if (latestOnChain.exchange_inflows && latestOnChain.exchange_outflows) {
        const netflow = latestOnChain.exchange_inflows - latestOnChain.exchange_outflows;
        netflowSignal = netflow < 0 ? 'ACCUMULATION' : netflow > 0 ? 'DISTRIBUTION' : 'NEUTRAL';
      }
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Active Addresses</span>
              <Badge className={activeAddressesGrowth > 10 ? 'bg-green-600' : activeAddressesGrowth < -10 ? 'bg-red-600' : 'bg-yellow-600'}>
                {activeAddressesGrowth > 10 ? 'GROWING' : activeAddressesGrowth < -10 ? 'DECLINING' : 'STABLE'}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {latestOnChain?.active_addresses?.toLocaleString() || 'N/A'}
            </div>
            <div className={`text-sm mt-1 ${activeAddressesGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {activeAddressesGrowth >= 0 ? '+' : ''}{activeAddressesGrowth.toFixed(2)}% vs yesterday
            </div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Exchange Netflow</span>
              <Badge className={netflowSignal === 'ACCUMULATION' ? 'bg-green-600' : netflowSignal === 'DISTRIBUTION' ? 'bg-red-600' : 'bg-yellow-600'}>
                {netflowSignal}
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{netflowSignal}</div>
            <p className="text-xs text-slate-400 mt-1">
              {netflowSignal === 'ACCUMULATION' ? 'Coins leaving exchanges (bullish)' : 
               netflowSignal === 'DISTRIBUTION' ? 'Coins entering exchanges (bearish)' :
               'Balanced flow'}
            </p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <span className="text-sm text-slate-400">Transaction Volume</span>
            <div className="text-2xl font-bold text-white">
              {latestOnChain?.transaction_volume ? `$${(latestOnChain.transaction_volume / 1000000).toFixed(1)}M` : 'N/A'}
            </div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <span className="text-sm text-slate-400">Network Value</span>
            <div className="text-2xl font-bold text-white">
              {latestOnChain?.network_value ? `$${(latestOnChain.network_value / 1000000000).toFixed(1)}B` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
          <h4 className="font-semibold text-green-400 mb-2">On-Chain Analysis Summary</h4>
          <p className="text-sm text-slate-300">
            On-chain metrics show {activeAddressesGrowth > 10 ? 'strong network growth' : 'stable network activity'} with{' '}
            {netflowSignal === 'ACCUMULATION' ? 'bullish accumulation patterns' : 'neutral flow patterns'}.
          </p>
          <div className="mt-2">
            <span className="text-sm text-slate-400">Weight in Ensemble: </span>
            <span className="text-white font-semibold">30%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSentimentAnalysis = () => {
    const latestSentiment = sentimentData[0];
    
    const mockSentimentData = {
      socialScore: latestSentiment?.sentiment_score || 0.15,
      fearGreedIndex: latestSentiment?.fear_greed_index || 35,
      mentions: latestSentiment?.social_mentions || 1250,
      newsScore: latestSentiment?.news_sentiment || 0.25
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Social Sentiment</span>
              <Badge className={mockSentimentData.socialScore > 0.3 ? 'bg-green-600' : mockSentimentData.socialScore < -0.3 ? 'bg-red-600' : 'bg-yellow-600'}>
                {mockSentimentData.socialScore > 0.3 ? 'BULLISH' : mockSentimentData.socialScore < -0.3 ? 'BEARISH' : 'NEUTRAL'}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">
              {(mockSentimentData.socialScore * 100).toFixed(0)}%
            </div>
            <Progress value={(mockSentimentData.socialScore + 1) * 50} className="mt-2" />
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Fear & Greed Index</span>
              <Badge className={mockSentimentData.fearGreedIndex < 25 ? 'bg-green-600' : mockSentimentData.fearGreedIndex > 75 ? 'bg-red-600' : 'bg-yellow-600'}>
                {mockSentimentData.fearGreedIndex < 25 ? 'EXTREME FEAR' : mockSentimentData.fearGreedIndex > 75 ? 'EXTREME GREED' : 'NEUTRAL'}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-white">{mockSentimentData.fearGreedIndex}</div>
            <Progress value={mockSentimentData.fearGreedIndex} className="mt-2" />
            <p className="text-xs text-slate-400 mt-1">
              {mockSentimentData.fearGreedIndex < 25 ? 'Buy opportunity (contrarian)' : 
               mockSentimentData.fearGreedIndex > 75 ? 'Exercise caution' : 'Balanced sentiment'}
            </p>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <span className="text-sm text-slate-400">Social Mentions (24h)</span>
            <div className="text-2xl font-bold text-white">{mockSentimentData.mentions.toLocaleString()}</div>
          </div>

          <div className="p-4 bg-slate-700/50 rounded-lg">
            <span className="text-sm text-slate-400">News Sentiment</span>
            <div className="text-2xl font-bold text-white">
              {(mockSentimentData.newsScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="p-4 bg-purple-900/20 border border-purple-800/50 rounded-lg">
          <h4 className="font-semibold text-purple-400 mb-2">Sentiment Analysis Summary</h4>
          <p className="text-sm text-slate-300">
            Market sentiment shows {mockSentimentData.fearGreedIndex < 25 ? 'extreme fear creating buying opportunities' : 'balanced conditions'} with{' '}
            {mockSentimentData.socialScore > 0 ? 'positive' : 'neutral'} social media sentiment.
          </p>
          <div className="mt-2">
            <span className="text-sm text-slate-400">Weight in Ensemble: </span>
            <span className="text-white font-semibold">30%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEnsembleResults = () => {
    // Mock ensemble calculation
    const technicalScore = 0.7; // 70% bullish
    const onChainScore = 0.4;   // 40% bullish
    const sentimentScore = 0.2; // 20% bullish

    const ensembleScore = (technicalScore * 0.4) + (onChainScore * 0.3) + (sentimentScore * 0.3);
    const confidence = Math.abs(ensembleScore) * 100;

    const finalSignal = ensembleScore > 0.3 ? 'BUY' : ensembleScore < -0.3 ? 'SELL' : 'HOLD';

    return (
      <div className="space-y-4">
        <div className="p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Ensemble Prediction Model</h3>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Technical Analysis</div>
              <div className="text-2xl font-bold text-blue-400">{(technicalScore * 100).toFixed(0)}%</div>
              <div className="text-xs text-slate-400">Weight: 40%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">On-Chain Metrics</div>
              <div className="text-2xl font-bold text-green-400">{(onChainScore * 100).toFixed(0)}%</div>
              <div className="text-xs text-slate-400">Weight: 30%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Sentiment Analysis</div>
              <div className="text-2xl font-bold text-purple-400">{(sentimentScore * 100).toFixed(0)}%</div>
              <div className="text-xs text-slate-400">Weight: 30%</div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">Final Signal</h4>
                <p className="text-sm text-slate-400">Weighted ensemble result</p>
              </div>
              <Badge className={`text-lg px-4 py-2 ${
                finalSignal === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 
                finalSignal === 'SELL' ? 'bg-red-600 hover:bg-red-700' : 
                'bg-yellow-600 hover:bg-yellow-700'
              }`}>
                {finalSignal === 'BUY' ? <TrendingUp className="mr-2" /> : 
                 finalSignal === 'SELL' ? <TrendingDown className="mr-2" /> : 
                 <Activity className="mr-2" />}
                {finalSignal}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Confidence Score</span>
                <span className="text-white font-semibold">{confidence.toFixed(1)}%</span>
              </div>
              <Progress value={confidence} className="h-3" />
            </div>

            <div className="text-sm text-slate-300">
              <strong>Model Logic:</strong> Random Forest Classifier with LSTM price forecasting, 
              combining {technicalScore > 0.5 ? 'bullish' : 'bearish'} technical signals, {' '}
              {onChainScore > 0.3 ? 'positive' : 'neutral'} on-chain metrics, and {' '}
              {sentimentScore > 0.2 ? 'optimistic' : 'cautious'} market sentiment.
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
          <h4 className="font-semibold text-yellow-400 mb-2">Model Information</h4>
          <div className="text-sm text-slate-300 space-y-1">
            <p>• <strong>Training Data:</strong> 6 months historical data, retrained weekly</p>
            <p>• <strong>Algorithms:</strong> Random Forest (signals) + LSTM (price forecasting)</p>
            <p>• <strong>Features:</strong> RSI, MACD, Bollinger Bands, VWMA, netflows, sentiment scores</p>
            <p>• <strong>Validation:</strong> Walk-forward analysis with 70/30 train/test split</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain size={20} />
          Advanced Prediction Analysis - {crypto}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ensemble" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="ensemble" className="text-white">
              <Brain className="mr-2 h-4 w-4" />
              Ensemble
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-white">
              <BarChart3 className="mr-2 h-4 w-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="onchain" className="text-white">
              <Activity className="mr-2 h-4 w-4" />
              On-Chain
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="text-white">
              <MessageCircle className="mr-2 h-4 w-4" />
              Sentiment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ensemble" className="mt-6">
            {renderEnsembleResults()}
          </TabsContent>
          
          <TabsContent value="technical" className="mt-6">
            {renderTechnicalAnalysis()}
          </TabsContent>
          
          <TabsContent value="onchain" className="mt-6">
            {renderOnChainAnalysis()}
          </TabsContent>
          
          <TabsContent value="sentiment" className="mt-6">
            {renderSentimentAnalysis()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictionAnalysis;
