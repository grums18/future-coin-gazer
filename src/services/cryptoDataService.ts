
import { supabase } from '@/integrations/supabase/client';

export interface Token {
  id: string;
  symbol: string;
  name: string;
  coingecko_id: string;
  blockchain: string;
  market_cap: number | null;
  is_active: boolean;
}

export interface PriceData {
  id: string;
  token_symbol: string;
  timestamp: string;
  open_price: number;
  high_price: number;
  low_price: number;
  close_price: number;
  volume: number | null;
  market_cap: number | null;
}

export interface TradingSignal {
  id: string;
  token_symbol: string;
  signal_type: 'BUY' | 'SELL' | 'HOLD';
  confidence_score: number;
  target_price: number | null;
  stop_loss: number | null;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  timeframe: string;
  created_at: string;
}

class CryptoDataService {
  private coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';

  // Fetch all supported tokens from database
  async getTokens(): Promise<Token[]> {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('is_active', true)
      .order('market_cap', { ascending: false, nullsLast: true });

    if (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }

    return data || [];
  }

  // Fetch current prices from CoinGecko for multiple tokens
  async fetchCurrentPrices(tokenIds: string[]): Promise<any> {
    try {
      const response = await fetch(
        `${this.coingeckoBaseUrl}/simple/price?ids=${tokenIds.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_24hr_vol=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prices from CoinGecko');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching current prices:', error);
      throw error;
    }
  }

  // Fetch historical price data from CoinGecko
  async fetchHistoricalPrices(coingeckoId: string, days: number = 7): Promise<any> {
    try {
      const response = await fetch(
        `${this.coingeckoBaseUrl}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch historical prices from CoinGecko');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching historical prices:', error);
      throw error;
    }
  }

  // Get price data from database
  async getPriceData(tokenSymbol: string, days: number = 7): Promise<PriceData[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('price_data')
      .select('*')
      .eq('token_symbol', tokenSymbol)
      .gte('timestamp', fromDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching price data:', error);
      throw error;
    }

    return data || [];
  }

  // Get trading signals from database
  async getTradingSignals(tokenSymbol?: string): Promise<TradingSignal[]> {
    let query = supabase
      .from('trading_signals')
      .select('*')
      .order('created_at', { ascending: false });

    if (tokenSymbol) {
      query = query.eq('token_symbol', tokenSymbol);
    }

    const { data, error } = await query.limit(10);

    if (error) {
      console.error('Error fetching trading signals:', error);
      throw error;
    }

    return data || [];
  }

  // Store price data in database (for background data collection)
  async storePriceData(priceData: Omit<PriceData, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('price_data')
      .upsert(priceData, { 
        onConflict: 'token_symbol,timestamp',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('Error storing price data:', error);
      throw error;
    }
  }

  // Generate mock trading signal (placeholder for real ML predictions)
  async generateTradingSignal(tokenSymbol: string, timeframe: string): Promise<TradingSignal> {
    // This is a placeholder - replace with real ML prediction logic
    const signals: ('BUY' | 'SELL' | 'HOLD')[] = ['BUY', 'SELL', 'HOLD'];
    const riskLevels: ('LOW' | 'MEDIUM' | 'HIGH')[] = ['LOW', 'MEDIUM', 'HIGH'];
    
    const signal: Omit<TradingSignal, 'id' | 'created_at'> = {
      token_symbol: tokenSymbol,
      signal_type: signals[Math.floor(Math.random() * signals.length)],
      confidence_score: Math.random() * 100,
      target_price: Math.random() * 100000,
      stop_loss: Math.random() * 50000,
      risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      timeframe: timeframe
    };

    const { data, error } = await supabase
      .from('trading_signals')
      .insert([signal])
      .select()
      .single();

    if (error) {
      console.error('Error generating trading signal:', error);
      throw error;
    }

    return data;
  }
}

export const cryptoDataService = new CryptoDataService();
