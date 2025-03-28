/**
 * GET /markets/quotes/options
 * Retrieves Level 1 option quotes + Greek data for one or more option symbols.
 */

/**
 * Request for GET /markets/quotes/options
 */
export interface GetMarketOptionsQuotesRequest {
  /**
   * Option IDs (query param "optionIds=1,2,...").
   * Also can include filters, but in raw GET form it may vary.
   */
  optionIds?: number[];
  // For simplified usage, let's omit advanced filters (they're often done via POST),
  // but we reflect the gist here.
}

/**
 * Represents a single L1 option data quote with Greeks.
 */
export interface Level1OptionData {
  underlying: string;
  underlyingId: number;
  symbol: string;
  symbolId: number;
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
  lastTradePriceTrHrs: number;
  lastTradePrice: number;
  lastTradeSize: number;
  lastTradeTick: "Up" | "Down" | "Equal";
  lastTradeTime: string;
  volume: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  openInterest: number;
  delay: number;
  isHalted: boolean;
  VWAP: number;
}

/**
 * Response for GET /markets/quotes/options
 */
export interface GetMarketOptionsQuotesResponse {
  optionQuotes: Level1OptionData[];
}
