/**
 * GET /accounts/:id/positions
 * Retrieves positions in a specified account.
 */

/**
 * Request for GET /accounts/:id/positions
 */
export interface GetAccountPositionsRequest {
  /** The account number (from path parameter). */
  accountId: string;
}

/**
 * Represents an open position in an account.
 */
export interface Position {
  symbol: string;
  symbolId: number;
  openQuantity: number;
  currentMarketValue: number;
  currentPrice: number;
  averageEntryPrice: number;
  closedPnl: number; // realized PnL
  openPnl: number;   // unrealized PnL
  totalCost: number;
  isRealTime: boolean;
  isUnderReorg: boolean;
}

/**
 * Response for GET /accounts/:id/positions
 */
export interface GetAccountPositionsResponse {
  positions: Position[];
}
