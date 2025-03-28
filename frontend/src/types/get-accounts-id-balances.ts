/**
 * GET /accounts/:id/balances
 * Retrieves balances for a specified account.
 */

/**
 * Request for GET /accounts/:id/balances
 */
export interface GetAccountBalancesRequest {
  /** The account number (from path parameter). */
  accountId: string;
}

/**
 * Represents the balance details for an account.
 */
export interface Balance {
  currency: "USD" | "CAD";
  cash: number;
  marketValue: number;
  totalEquity: number;
  buyingPower: number;
  maintenanceExcess: number;
  isRealTime: boolean;
}

/**
 * Response for GET /accounts/:id/balances
 */
export interface GetAccountBalancesResponse {
  perCurrencyBalances: Balance[];
  combinedBalances: Balance[];
  sodPerCurrencyBalances: Balance[];
  sodCombinedBalances: Balance[];
}
