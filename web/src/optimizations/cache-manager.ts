import { MarketAPI } from "../modules/market-api";
import { MarketQuote } from "../types/get-markets-quotes-id";

export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 60000; // Cache market data for 1 minute

  constructor(private marketApi: MarketAPI) {}

  async getMarketQuote(symbolId: number): Promise<MarketQuote> {
    const now = Date.now();
    const cacheKey = `marketQuote-${symbolId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && now - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const marketData = await this.marketApi.getMarketQuotes({ symbolIds: [symbolId] });
    this.cache.set(cacheKey, { data: marketData.quotes[0], timestamp: now });

    return marketData.quotes[0];
  }
}
