import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/UserMenu';
import PriceChart from '@/components/PriceChart';
import PredictionPanel from '@/components/PredictionPanel';
import PortfolioTracker from '@/components/PortfolioTracker';
import MarketOverview from '@/components/MarketOverview';
import RiskManagement from '@/components/RiskManagement';
import { TrendingUp, LogIn } from 'lucide-react';
import PredictionAnalysis from '@/components/PredictionAnalysis';

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">
                Crypto Market Prediction Dashboard
              </h1>
            </div>
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>

          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to CryptoPredict
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              AI-powered short-term cryptocurrency price predictions for smart trading decisions. 
              Sign in to access your personalized dashboard, portfolio tracking, and prediction history.
            </p>
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Get Started - It's Free
            </Button>
          </div>

          {/* Preview of features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">AI Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Get 3-day and 7-day price predictions with confidence scores
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Portfolio Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Track your holdings and see predicted performance
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Smart stop-loss suggestions and position sizing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header with User Menu */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Crypto Market Prediction Dashboard
            </h1>
            <p className="text-slate-300">
              AI-powered short-term cryptocurrency price predictions for smart trading decisions
            </p>
          </div>
          <UserMenu />
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

            {/* Advanced Prediction Analysis */}
            <PredictionAnalysis crypto={selectedCrypto} />

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
