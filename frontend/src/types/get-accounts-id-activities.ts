/**
 * GET /accounts/:id/activities
 * Retrieves account activities (cash transactions, dividends, trades, etc.).
 */

/**
 * Request for GET /accounts/:id/activities
 */
export interface GetAccountActivitiesRequest {
  /** The account number (from path parameter). */
  accountId: string;
  /** Start time in ISO format (query param). */
  startTime?: string;
  /** End time in ISO format (query param). */
  endTime?: string;
}

/**
 * Represents a single activity record.
 */
export interface AccountActivity {
  tradeDate: string;
  transactionDate: string;
  settlementDate: string;
  action: string;    // e.g. "Buy", "Sell", "Dividend", "Interest", etc.
  symbol: string;
  symbolId: number;
  description: string;
  currency: "USD" | "CAD";
  quantity: number;
  price: number;
  grossAmount: number;
  commission: number;
  netAmount: number;
  type: string;      // e.g. "Trade", "Dividend", "Interest"
}

/**
 * Response for GET /accounts/:id/activities
 */
export interface GetAccountActivitiesResponse {
  activities: AccountActivity[];
}
