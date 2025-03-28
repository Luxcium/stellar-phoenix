/**
 * GET /accounts/:id/executions
 * Retrieves executions (fills) for a specific account within a time window.
 */

/**
 * Request for GET /accounts/:id/executions
 */
export interface GetAccountExecutionsRequest {
  /** The account number (from path parameter). */
  accountId: string;
  /** Start time in ISO format (query param). */
  startTime?: string;
  /** End time in ISO format (query param). */
  endTime?: string;
}

/**
 * Represents a single execution fill.
 */
export interface Execution {
  symbol: string;
  symbolId: number;
  quantity: number;
  side: "Buy" | "Sell";
  price: number;
  orderId: number;
  timestamp: string; // Execution timestamp in ISO format
  venue: string;
  totalCost: number;
  commission: number;
}

/**
 * Response for GET /accounts/:id/executions
 */
export interface GetAccountExecutionsResponse {
  executions: Execution[];
}
