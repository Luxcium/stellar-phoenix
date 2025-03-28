/**
 * GET /symbols/:id/options
 * Retrieves an option chain for a particular underlying symbol.
 */

/**
 * Request for GET /symbols/:id/options
 */
export interface GetSymbolOptionsRequest {
  /** The underlying symbol's internal ID (path parameter). */
  symbolId: number;
}

/**
 * Represents a single chain of options for a given expiry date.
 */
export interface ChainPerExpiryDate {
  expiryDate: string; // ISO date
  description: string;
  listingExchange: "MX" | "OPRA" | "NYSE" | "NASDAQ" | "TSX" | "TSXV";
  optionExerciseType: "American" | "European";
  chainPerRoot: ChainPerRoot[];
}

/**
 * Represents a specific option root grouping under an expiry date.
 */
export interface ChainPerRoot {
  optionRoot: string;
  multiplier: number;
  chainPerStrikePrice: ChainPerStrikePrice[];
}

/**
 * Represents the call/put symbol IDs at a given strike.
 */
export interface ChainPerStrikePrice {
  strikePrice: number;
  callSymbolId: number;
  putSymbolId: number;
}

/**
 * Response for GET /symbols/:id/options
 */
export interface GetSymbolOptionsResponse {
  options: ChainPerExpiryDate[];
}
