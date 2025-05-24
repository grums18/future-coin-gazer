
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PriceChart from '@/components/PriceChart';
import PredictionPanel from '@/components/PredictionPanel';
import PortfolioTracker from '@/components/PortfolioTracker';
import MarketOverview from '@/components/MarketOverview';
import RiskManagement from '@/components/RiskManagement';

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Crypto Market Prediction Dashboard
          </h1>
          <p className="text-slate-300">
            AI-powered short-term cryptocurrency price predictions for smart trading decisions
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Charts and Predictions */}
          <div className="xl:col-span-2 space-y-6">
            {/* Market Overview */}
            <MarketOverview selectedCrypto={selectedCrypto} onSelectCrypto={setSelectedCrypto} />
            
            {/* Price Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  {selectedCrypto} Price Chart
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      3D Prediction
                    </Badge>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      7D Prediction
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PriceChart crypto={selectedCrypto} />
              </CardContent>
            </Card>

            {/* Prediction Panel */}
            <PredictionPanel crypto={selectedCrypto} />
          </div>

          {/* Right Column - Portfolio and Risk Management */}
          <div className="space-y-6">
            <Tabs defaultValue="portfolio" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                <TabsTrigger value="portfolio" className="text-white">Portfolio</TabsTrigger>
                <TabsTrigger value="risk" className="text-white">Risk Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio">
                <PortfolioTracker />
              </TabsContent>
              
              <TabsContent value="risk">
                <RiskManagement crypto={selectedCrypto} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
