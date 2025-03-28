/**
 * GET /markets/quotes/strategies
 * Retrieves a calculated L1 quote for multi-leg strategies (though official docs often use POST).
 * We'll define a GET variant for structural completeness.
 */

/**
 * Request for GET /markets/quotes/strategies
 * Potentially includes multi-leg strategy definitions in query parameters (though typically a POST).
 */
export interface GetStrategyQuotesRequest {
  // This is conceptual. Questrade typically uses POST for multi-leg strategy quotes.
  // We'll keep minimal placeholders for demonstration.
  variantIds?: number[];
}

/**
 * A single multi-leg strategy quote record.
 */
export interface StrategyQuote {
  variantId: number;
  bidPrice: number;
  askPrice: number;
  underlying: string;
  underlyingId: number;
  openPrice?: number;
  volatility?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;
  isRealTime: boolean;
}

/**
 * Response for GET /markets/quotes/strategies
 */
export interface GetStrategyQuotesResponse {
  strategyQuotes: StrategyQuote[];
}
