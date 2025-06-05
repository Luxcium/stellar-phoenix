/**
 * GET /symbols/:id
 * Retrieves detailed information about one or more symbols (by IDs).
 */

/**
 * Request for GET /symbols/:id
 */
export interface GetSymbolsRequest {
  /** Symbol IDs in location or query (comma-separated if multiple). */
  ids?: number[];
  /** Symbol names in query if searching by name instead of IDs. */
  names?: string[];
}

/**
 * Represents detailed symbol information.
 */
export interface SymbolDetail {
  symbol: string;
  symbolId: number;
  prevDayClosePrice: number;
  highPrice52: number;
  lowPrice52: number;
  averageVol3Months: number;
  averageVol20Days: number;
  outstandingShares: number;
  eps: number;
  pe: number;
  dividend: number;
  yield: number;
  exDate?: string;
  marketCap: number;
  listingExchange: string;
  description: string;
  securityType: "Stock" | "Option" | "Bond" | "Right" | "MutualFund" | "Index";
  isTradable: boolean;
  isQuotable: boolean;
  hasOptions: boolean;
  currency: "USD" | "CAD";
}

/**
 * Response for GET /symbols/:id
 */
export interface GetSymbolsResponse {
  symbols: SymbolDetail[];
}
