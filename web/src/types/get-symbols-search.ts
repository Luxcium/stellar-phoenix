/**
 * GET /symbols/search
 * Retrieves symbol(s) using prefix-based search.
 */

/**
 * Request for GET /symbols/search
 */
export interface GetSymbolsSearchRequest {
  /** Prefix of a symbol or any word in the description (query param). */
  prefix: string;
  /** Offset in number of records from the beginning (query param). */
  offset?: number;
}

/**
 * Represents a single symbol search result.
 */
export interface EquitySymbol {
  symbol: string;
  symbolId: number;
  description: string;
  securityType: "Stock" | "Option" | "Bond" | "Right" | "MutualFund" | "Index" | "ETF" | "ETN";
  listingExchange: "TSX" | "TSXV" | "CNSX" | "MX" | "NASDAQ" | "NYSE" | "NYSEAM" | "ARCA"
                   | "OPRA" | "PinkSheets" | "OTCBB";
  isQuotable: boolean;
  isTradable: boolean;
  currency: "USD" | "CAD";
}

/**
 * Response for GET /symbols/search
 */
export interface GetSymbolsSearchResponse {
  symbols: EquitySymbol[];
}
