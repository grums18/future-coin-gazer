
import { useQuery } from '@tanstack/react-query';
import { cryptoDataService, Token, PriceData, TradingSignal, OnChainMetrics, SentimentData } from '@/services/cryptoDataService';

export const useTokens = () => {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: () => cryptoDataService.getTokens(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePriceData = (tokenSymbol: string, days: number = 7) => {
  return useQuery({
    queryKey: ['priceData', tokenSymbol, days],
    queryFn: () => cryptoDataService.getPriceData(tokenSymbol, days),
    enabled: !!tokenSymbol,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useTradingSignals = (tokenSymbol?: string) => {
  return useQuery({
    queryKey: ['tradingSignals', tokenSymbol],
    queryFn: () => cryptoDataService.getTradingSignals(tokenSymbol),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useOnChainMetrics = (tokenSymbol: string, days: number = 7) => {
  return useQuery({
    queryKey: ['onChainMetrics', tokenSymbol, days],
    queryFn: () => cryptoDataService.getOnChainMetrics(tokenSymbol, days),
    enabled: !!tokenSymbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSentimentData = (tokenSymbol: string, days: number = 7) => {
  return useQuery({
    queryKey: ['sentimentData', tokenSymbol, days],
    queryFn: () => cryptoDataService.getSentimentData(tokenSymbol, days),
    enabled: !!tokenSymbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCurrentPrices = (tokens: Token[]) => {
  return useQuery({
    queryKey: ['currentPrices', tokens.map(t => t.coingecko_id)],
    queryFn: async () => {
      if (tokens.length === 0) return {};
      const tokenIds = tokens.map(t => t.coingecko_id).filter(Boolean);
      return cryptoDataService.fetchCurrentPrices(tokenIds);
    },
    enabled: tokens.length > 0,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useHistoricalPrices = (coingeckoId: string, days: number = 7) => {
  return useQuery({
    queryKey: ['historicalPrices', coingeckoId, days],
    queryFn: () => cryptoDataService.fetchHistoricalPrices(coingeckoId, days),
    enabled: !!coingeckoId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
