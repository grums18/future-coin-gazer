
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PortfolioItem {
  id: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
}

const PortfolioTracker = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: '1',
      symbol: 'BTC',
      amount: 0.5,
      buyPrice: 40000,
      currentPrice: 42350
    },
    {
      id: '2',
      symbol: 'ETH',
      amount: 2.0,
      buyPrice: 2400,
      currentPrice: 2580
    }
  ]);

  const [newHolding, setNewHolding] = useState({
    symbol: '',
    amount: '',
    buyPrice: ''
  });

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.amount || !newHolding.buyPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const mockCurrentPrice = newHolding.symbol === 'BTC' ? 42350 : 
                           newHolding.symbol === 'ETH' ? 2580 : 100;

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      symbol: newHolding.symbol.toUpperCase(),
      amount: parseFloat(newHolding.amount),
      buyPrice: parseFloat(newHolding.buyPrice),
      currentPrice: mockCurrentPrice
    };

    setPortfolio([...portfolio, newItem]);
    setNewHolding({ symbol: '', amount: '', buyPrice: '' });
    
    toast({
      title: "Success",
      description: `${newItem.symbol} added to portfolio`,
    });
  };

  const removeHolding = (id: string) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
    toast({
      title: "Removed",
      description: "Holding removed from portfolio",
    });
  };

  const calculatePnL = (item: PortfolioItem) => {
    const pnl = (item.currentPrice - item.buyPrice) * item.amount;
    const pnlPercentage = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
    return { pnl, pnlPercentage };
  };

  const totalPortfolioValue = portfolio.reduce((total, item) => 
    total + (item.currentPrice * item.amount), 0
  );

  const totalPnL = portfolio.reduce((total, item) => {
    const { pnl } = calculatePnL(item);
    return total + pnl;
  }, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Summary */}
        <div className="p-4 bg-slate-700/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="text-xl font-bold text-white">
                ${totalPortfolioValue.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Total P&L</p>
              <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Holdings List */}
        <div className="space-y-3">
          {portfolio.map((item) => {
            const { pnl, pnlPercentage } = calculatePnL(item);
            return (
              <div key={item.id} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-white border-slate-500">
                      {item.symbol}
                    </Badge>
                    <span className="text-sm text-slate-400">
                      {item.amount} units
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHolding(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Buy Price: ${item.buyPrice}</p>
                    <p className="text-slate-400">Current: ${item.currentPrice}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="font-semibold">
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                      </span>
                    </div>
                    <p className={`text-sm ${pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Holding */}
        <div className="space-y-3 pt-4 border-t border-slate-600">
          <h4 className="text-sm font-medium text-white">Add New Holding</h4>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="symbol" className="text-xs text-slate-400">Symbol</Label>
              <Input
                id="symbol"
                placeholder="BTC"
                value={newHolding.symbol}
                onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="text-xs text-slate-400">Amount</Label>
              <Input
                id="amount"
                placeholder="0.1"
                value={newHolding.amount}
                onChange={(e) => setNewHolding({ ...newHolding, amount: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="buyPrice" className="text-xs text-slate-400">Buy Price</Label>
              <Input
                id="buyPrice"
                placeholder="40000"
                value={newHolding.buyPrice}
                onChange={(e) => setNewHolding({ ...newHolding, buyPrice: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          
          <Button onClick={addHolding} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus size={16} className="mr-2" />
            Add Holding
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioTracker;
