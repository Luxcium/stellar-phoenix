import { ThrottledAPIClient } from "./optimizations/throttled-api-client";
import { BatchRequestHandler } from "./optimizations/batch-request-handler";
import { CacheManager } from "./optimizations/cache-manager";
import { Auth } from "./auth";
import { RateLimiter } from "./rate-limiter";
import { MarketAPI } from "../modules/market-api";
import { SymbolAPI } from "../modules/symbol-api";
import { AccountAPI } from "../modules/account-api";
import { OrderAPI } from "../modules/order-api";
import { SmartQueryEngine } from "../modules/query-engine";
import { AutoQueryExecutor } from "../modules/auto-query-executor";
import { LiveMarketFeed } from "../streaming/live-market-feed";
import { LiveTradeFeed } from "../streaming/live-trade-feed";

export class QuestradeSDK {
  private client: ThrottledAPIClient;
  private rateLimiter: RateLimiter;
  public market: MarketAPI;
  public symbol: SymbolAPI;
  public account: AccountAPI;
  public order: OrderAPI;
  public query: SmartQueryEngine;
  public autoQuery: AutoQueryExecutor;
  public batchRequests: BatchRequestHandler;
  public cache: CacheManager;
  public liveMarket: LiveMarketFeed;
  public liveTrade: LiveTradeFeed;

  constructor(private refreshToken: string) {}

  async initialize(): Promise<void> {
    const auth = new Auth(this.refreshToken);
    const { accessToken, apiServer } = await auth.authenticate();

    this.client = new ThrottledAPIClient(apiServer, accessToken);
    this.rateLimiter = new RateLimiter();
    this.market = new MarketAPI(this.client);
    this.symbol = new SymbolAPI(this.client);
    this.account = new AccountAPI(this.client);
    this.order = new OrderAPI(this.client);
    this.query = new SmartQueryEngine(this.market, this.symbol, this.account, this.order);
    this.autoQuery = new AutoQueryExecutor(this.query);
    this.batchRequests = new BatchRequestHandler(this.market);
    this.cache = new CacheManager(this.market);
    this.liveMarket = new LiveMarketFeed(accessToken, apiServer);
    this.liveTrade = new LiveTradeFeed(accessToken, apiServer);
  }

  async fetch<T>(method: "GET" | "POST", endpoint: string, body?: object): Promise<T> {
    await this.rateLimiter.limit();
    return this.client.request<T>(method, endpoint, body);
  }
}
