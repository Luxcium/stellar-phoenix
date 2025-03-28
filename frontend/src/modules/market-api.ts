import { APIClient } from "../app/api-client";
import { GetMarketQuotesRequest, GetMarketQuotesResponse } from "../types/get-markets-quotes-id";
import { GetMarketCandlesRequest, GetMarketCandlesResponse } from "../types/get-markets-candles-id";
import { GetMarketsRequest, GetMarketsResponse } from "../types/get-markets";

export class MarketAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async getMarketQuotes(request: GetMarketQuotesRequest): Promise<GetMarketQuotesResponse> {
    return this.client.request<GetMarketQuotesResponse>("GET", `/markets/quotes/${request.symbolIds.join(",")}`);
  }

  async getMarketCandles(request: GetMarketCandlesRequest): Promise<GetMarketCandlesResponse> {
    const { symbolId, startTime, endTime, interval } = request;
    return this.client.request<GetMarketCandlesResponse>("GET", `/markets/candles/${symbolId}`, {
      startTime,
      endTime,
      interval,
    });
  }

  async getMarkets(request: GetMarketsRequest): Promise<GetMarketsResponse> {
    return this.client.request<GetMarketsResponse>("GET", "/markets");
  }
}
