import { MarketAPI } from "../modules/market-api";
import { GetMarketQuoteResponse } from "../types/get-markets-quotes-id";

export class BatchRequestHandler {
  private marketApi: MarketAPI;
  private batchSize = 50; // Questrade allows multiple symbols, limit appropriately.

  constructor(marketApi: MarketAPI) {
    this.marketApi = marketApi;
  }

  async batchMarketQuotes(symbolIds: number[]): Promise<GetMarketQuoteResponse> {
    const chunks: number[][] = [];

    for (let i = 0; i < symbolIds.length; i += this.batchSize) {
      chunks.push(symbolIds.slice(i, i + this.batchSize));
    }

    const results = await Promise.all(chunks.map(chunk => this.marketApi.getMarketQuotes({ symbolIds: chunk })));
    return { quotes: results.flatMap(res => res.quotes) };
  }
}
