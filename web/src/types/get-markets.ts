/**
 * GET /markets
 * Retrieves information about all supported markets.
 */

/**
 * Request for GET /markets
 */
export interface GetMarketsRequest {}

/**
 * Represents a trading venue code set (e.g., "TSX", "NYSE").
 */
export interface MarketVenueCode {
  code: string;
}

/**
 * Represents a single market definition.
 */
export interface Market {
  name: string;
  tradingVenues: string[];
  defaultTradingVenue: string;
  primaryOrderRoutes: string[];
  secondaryOrderRoutes: string[];
  level1Feeds: string[];
  level2Feeds?: string[];
  extendedStartTime: string;
  startTime: string;
  endTime: string;
  extendedEndTime?: string;
  currency: "USD" | "CAD";
  snapQuotesLimit: number;
}

/**
 * Response for GET /markets
 */
export interface GetMarketsResponse {
  markets: Market[];
}
