
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

export interface OnChainMetrics {
  id: string;
  token_symbol: string;
  timestamp: string;
  active_addresses: number | null;
  transaction_volume: number | null;
  exchange_inflows: number | null;
  exchange_outflows: number | null;
  network_value: number | null;
}

export interface SentimentData {
  id: string;
  token_symbol: string;
  timestamp: string;
  sentiment_score: number | null;
  sentiment_label: 'Bullish' | 'Neutral' | 'Bearish' | null;
  fear_greed_index: number | null;
  social_mentions: number | null;
  news_sentiment: number | null;
}

class CryptoDataService {
  private coingeckoBaseUrl = 'https://api.coingecko.com/api/v3';

  // Fetch all supported tokens from database
  async getTokens(): Promise<Token[]> {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('is_active', true)
      .order('market_cap', { ascending: false, nullsFirst: false });

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

    return (data || []) as TradingSignal[];
  }

  // Get on-chain metrics
  async getOnChainMetrics(tokenSymbol: string, days: number = 7): Promise<OnChainMetrics[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('onchain_metrics')
      .select('*')
      .eq('token_symbol', tokenSymbol)
      .gte('timestamp', fromDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching on-chain metrics:', error);
      throw error;
    }

    return data || [];
  }

  // Get sentiment data
  async getSentimentData(tokenSymbol: string, days: number = 7): Promise<SentimentData[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('sentiment_data')
      .select('*')
      .eq('token_symbol', tokenSymbol)
      .gte('timestamp', fromDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching sentiment data:', error);
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

  // Generate trading signal using ensemble logic
  async generateTradingSignal(tokenSymbol: string, timeframe: string): Promise<TradingSignal> {
    // Get historical data for analysis
    const historicalPrices = await this.getPriceData(tokenSymbol, 30);
    const onChainData = await this.getOnChainMetrics(tokenSymbol, 7);
    const sentimentData = await this.getSentimentData(tokenSymbol, 7);

    // Calculate technical indicators
    const technicalSignal = this.calculateTechnicalSignals(historicalPrices);
    
    // Calculate on-chain signals
    const onChainSignal = this.calculateOnChainSignals(onChainData);
    
    // Calculate sentiment signals
    const sentimentSignal = this.calculateSentimentSignals(sentimentData);

    // Ensemble logic: weighted voting (40% TA, 30% on-chain, 30% sentiment)
    const ensembleScore = (technicalSignal.score * 0.4) + (onChainSignal.score * 0.3) + (sentimentSignal.score * 0.3);
    const confidenceScore = Math.abs(ensembleScore) * 100;

    let signalType: 'BUY' | 'SELL' | 'HOLD';
    if (ensembleScore > 0.3) {
      signalType = 'BUY';
    } else if (ensembleScore < -0.3) {
      signalType = 'SELL';
    } else {
      signalType = 'HOLD';
    }

    // Calculate target price and stop loss
    const currentPrice = historicalPrices[historicalPrices.length - 1]?.close_price || 0;
    const volatility = this.calculateVolatility(historicalPrices);
    
    const targetPrice = signalType === 'BUY' ? currentPrice * (1 + volatility * 2) : 
                       signalType === 'SELL' ? currentPrice * (1 - volatility * 2) : null;
    const stopLoss = signalType === 'BUY' ? currentPrice * (1 - volatility) :
                     signalType === 'SELL' ? currentPrice * (1 + volatility) : null;

    // Determine risk level
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 
      volatility < 0.02 ? 'LOW' : volatility < 0.05 ? 'MEDIUM' : 'HIGH';

    const signal: Omit<TradingSignal, 'id' | 'created_at'> = {
      token_symbol: tokenSymbol,
      signal_type: signalType,
      confidence_score: confidenceScore,
      target_price: targetPrice,
      stop_loss: stopLoss,
      risk_level: riskLevel,
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

    return data as TradingSignal;
  }

  // Technical Analysis Functions
  private calculateTechnicalSignals(prices: PriceData[]): { score: number; signals: string[] } {
    if (prices.length < 26) return { score: 0, signals: ['Insufficient data'] };

    const closePrices = prices.map(p => p.close_price);
    const volumes = prices.map(p => p.volume || 0);
    
    // RSI (7-period)
    const rsi = this.calculateRSI(closePrices, 7);
    const rsiSignal = rsi < 30 ? 1 : rsi > 70 ? -1 : 0;

    // MACD (12, 26, 9)
    const macd = this.calculateMACD(closePrices, 12, 26, 9);
    const macdSignal = macd.histogram > 0 && macd.macdLine > macd.signalLine ? 1 : 
                       macd.histogram < 0 && macd.macdLine < macd.signalLine ? -1 : 0;

    // Bollinger Bands
    const bb = this.calculateBollingerBands(closePrices, 20, 2);
    const currentPrice = closePrices[closePrices.length - 1];
    const currentVolume = volumes[volumes.length - 1];
    const avgVolume = volumes.slice(-10).reduce((a, b) => a + b, 0) / 10;
    const bbSignal = currentPrice <= bb.lower && currentVolume > avgVolume * 1.5 ? 1 : 
                     currentPrice >= bb.upper ? -1 : 0;

    // VWMA
    const vwma = this.calculateVWMA(closePrices, volumes, 14);
    const vwmaSignal = currentPrice > vwma ? 0.5 : currentPrice < vwma ? -0.5 : 0;

    const signals = [];
    if (rsiSignal > 0) signals.push('RSI Oversold');
    if (rsiSignal < 0) signals.push('RSI Overbought');
    if (macdSignal > 0) signals.push('MACD Bullish Crossover');
    if (macdSignal < 0) signals.push('MACD Bearish Crossover');
    if (bbSignal > 0) signals.push('Bollinger Band Lower Touch + High Volume');
    if (bbSignal < 0) signals.push('Bollinger Band Upper Touch');

    const totalScore = (rsiSignal + macdSignal + bbSignal + vwmaSignal) / 4;
    return { score: totalScore, signals };
  }

  private calculateOnChainSignals(onChainData: OnChainMetrics[]): { score: number; signals: string[] } {
    if (onChainData.length < 2) return { score: 0, signals: ['Insufficient on-chain data'] };

    const signals = [];
    let score = 0;

    // Active addresses growth
    const latest = onChainData[0];
    const previous = onChainData[1];
    
    if (latest.active_addresses && previous.active_addresses) {
      const addressGrowth = ((latest.active_addresses - previous.active_addresses) / previous.active_addresses) * 100;
      if (addressGrowth > 10) {
        score += 0.5;
        signals.push('Active Addresses Growth >10%');
      }
    }

    // Exchange netflows (negative = accumulation)
    if (latest.exchange_inflows && latest.exchange_outflows) {
      const netflow = latest.exchange_inflows - latest.exchange_outflows;
      if (netflow < 0) {
        score += 0.5;
        signals.push('Negative Exchange Netflows (Accumulation)');
      } else if (netflow > 0) {
        score -= 0.3;
        signals.push('Positive Exchange Netflows (Distribution)');
      }
    }

    return { score: Math.max(-1, Math.min(1, score)), signals };
  }

  private calculateSentimentSignals(sentimentData: SentimentData[]): { score: number; signals: string[] } {
    if (sentimentData.length === 0) return { score: 0, signals: ['No sentiment data'] };

    const latest = sentimentData[0];
    const signals = [];
    let score = 0;

    // Sentiment score (-1 to 1)
    if (latest.sentiment_score !== null) {
      score += latest.sentiment_score * 0.6;
      if (latest.sentiment_score > 0.3) signals.push('Positive Social Sentiment');
      if (latest.sentiment_score < -0.3) signals.push('Negative Social Sentiment');
    }

    // Fear & Greed Index (0-100, lower = more fearful = potential buy opportunity)
    if (latest.fear_greed_index !== null) {
      const fgNormalized = (latest.fear_greed_index - 50) / 50; // Convert to -1 to 1
      score += fgNormalized * 0.4;
      if (latest.fear_greed_index < 25) signals.push('Extreme Fear (Buy Opportunity)');
      if (latest.fear_greed_index > 75) signals.push('Extreme Greed (Caution)');
    }

    return { score: Math.max(-1, Math.min(1, score)), signals };
  }

  // Technical Indicator Calculations
  private calculateRSI(prices: number[], period: number): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[], fastPeriod: number, slowPeriod: number, signalPeriod: number) {
    const emaFast = this.calculateEMA(prices, fastPeriod);
    const emaSlow = this.calculateEMA(prices, slowPeriod);
    const macdLine = emaFast - emaSlow;
    
    // For simplicity, using SMA instead of EMA for signal line
    const macdHistory = [macdLine]; // In real implementation, you'd calculate this for multiple periods
    const signalLine = macdHistory.reduce((a, b) => a + b, 0) / macdHistory.length;
    const histogram = macdLine - signalLine;

    return { macdLine, signalLine, histogram };
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    for (let i = prices.length - period; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateBollingerBands(prices: number[], period: number, stdDev: number) {
    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((a, b) => a + b, 0) / period;
    const variance = recentPrices.reduce((a, b) => a + Math.pow(b - sma, 2), 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  private calculateVWMA(prices: number[], volumes: number[], period: number): number {
    const recentPrices = prices.slice(-period);
    const recentVolumes = volumes.slice(-period);
    
    let totalVolumePrice = 0;
    let totalVolume = 0;
    
    for (let i = 0; i < recentPrices.length; i++) {
      totalVolumePrice += recentPrices[i] * recentVolumes[i];
      totalVolume += recentVolumes[i];
    }
    
    return totalVolume > 0 ? totalVolumePrice / totalVolume : recentPrices[recentPrices.length - 1];
  }

  private calculateVolatility(prices: PriceData[]): number {
    if (prices.length < 2) return 0.05; // Default 5%
    
    const returns = [];
    for (let i = 1; i < prices.length; i++) {
      const returnRate = (prices[i].close_price - prices[i-1].close_price) / prices[i-1].close_price;
      returns.push(returnRate);
    }
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }
}

export const cryptoDataService = new CryptoDataService();
