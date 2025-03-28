import { MarketAPI } from "../modules/market-api";
import { SymbolAPI } from "../modules/symbol-api";
import { AccountAPI } from "../modules/account-api";
import { OrderAPI } from "../modules/order-api";

export class SmartQueryEngine {
  private marketApi: MarketAPI;
  private symbolApi: SymbolAPI;
  private accountApi: AccountAPI;
  private orderApi: OrderAPI;

  constructor(marketApi: MarketAPI, symbolApi: SymbolAPI, accountApi: AccountAPI, orderApi: OrderAPI) {
    this.marketApi = marketApi;
    this.symbolApi = symbolApi;
    this.accountApi = accountApi;
    this.orderApi = orderApi;
  }

  async getFullStockOverview(symbolName: string) {
    const symbolResult = await this.symbolApi.searchSymbols({ prefix: symbolName });
    if (!symbolResult.symbols.length) throw new Error("Symbol not found");
    
    const symbol = symbolResult.symbols[0];
    const symbolId = symbol.symbolId;

    const [marketData, optionChain, history] = await Promise.all([
      this.marketApi.getMarketQuotes({ symbolIds: [symbolId] }),
      this.symbolApi.getSymbolOptions({ symbolId }),
      this.marketApi.getMarketCandles({ symbolId, startTime: "2022-01-01T00:00:00Z", endTime: "2022-12-31T23:59:59Z", interval: "OneDay" })
    ]);

    return {
      symbol: symbol.symbol,
      description: symbol.description,
      market: marketData.quotes[0],
      optionChain: optionChain.options,
      history: history.candles
    };
  }

  async getAccountSummary(accountId: string) {
    const [accountBalances, positions] = await Promise.all([
      this.accountApi.getBalances({ accountId }),
      this.accountApi.getPositions({ accountId })
    ]);

    const symbolIds = positions.positions.map(p => p.symbolId);
    const marketQuotes = await this.marketApi.getMarketQuotes({ symbolIds });

    return {
      accountBalances,
      positions: positions.positions.map(position => ({
        ...position,
        marketPrice: marketQuotes.quotes.find(q => q.symbolId === position.symbolId)?.lastTradePrice || null
      }))
    };
  }
}
