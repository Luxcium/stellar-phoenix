/**
 * GET /accounts/:id/orders
 * Retrieves orders for the specified account within a time window.
 */

/**
 * Request for GET /accounts/:id/orders
 */
export interface GetAccountOrdersRequest {
  /** The account number (from path parameter). */
  accountId: string;
  /** Start time in ISO format (query param). */
  startTime?: string;
  /** End time in ISO format (query param). */
  endTime?: string;
  /** Filter by order state: "All", "Open", "Closed" (query param). */
  stateFilter?: "All" | "Open" | "Closed";
  /** Specific orderId to retrieve (path param). */
  orderId?: number;
}

/**
 * Represents an individual order.
 */
export interface Order {
  id: number;
  symbol: string;
  symbolId: number;
  totalQuantity: number;
  openQuantity: number;
  filledQuantity: number;
  canceledQuantity: number;
  side: "Buy" | "Sell" | "Short" | "Cover";
  orderType: "Market" | "Limit" | "Stop" | "StopLimit" | "TrailStopInPercentage" | "TrailStopInDollar";
  limitPrice?: number;
  stopPrice?: number;
  isAllOrNone?: boolean;
  isAnonymous?: boolean;
  timeInForce: "Day" | "GoodTillCanceled" | "GoodTillDate" | "ImmediateOrCancel" | "FillOrKill";
  state: "Failed" | "Pending" | "Accepted" | "Rejected" | "CancelPending" | "Canceled" | "PartialCanceled"
         | "Partial" | "Executed" | "ReplacePending" | "Replaced" | "Stopped" | "Suspended" | "Expired"
         | "Queued" | "Triggered" | "Activated" | "PendingRiskReview" | "ContingentOrder";
  creationTime: string;
  updateTime: string;
}

/**
 * Response for GET /accounts/:id/orders
 */
export interface GetAccountOrdersResponse {
  orders: Order[];
}
