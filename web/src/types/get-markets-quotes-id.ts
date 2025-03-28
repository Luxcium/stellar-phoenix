/**
 * GET /markets/quotes/:id
 * Retrieves a single Level 1 market data quote for one or more symbols.
 */

/**
 * Request for GET /markets/quotes/:id or GET /markets/quotes?ids=...
 */
export interface GetMarketQuotesRequest {
  /**
   * Single symbol ID via path param, or multiple IDs via query param "ids=1,2,3".
   */
  symbolIds: number[];
}

/**
 * Represents a Level 1 market data quote.
 */
export interface Quote {
  symbol: string;
  symbolId: number;
  bidPrice: number;
  bidSize: number;
  askPrice: number;
  askSize: number;
  lastTradePrice: number;
  lastTradeSize: number;
  volume: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  delay: boolean;
  isHalted: boolean;
}

/**
 * Response for GET /markets/quotes/:id
 */
export interface GetMarketQuotesResponse {
  quotes: Quote[];
}
