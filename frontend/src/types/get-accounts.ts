/**
 * GET /accounts
 * Retrieves the accounts associated with the user.
 */

export interface GetAccountsRequest {}

/**
 * Represents a user account.
 */
export interface Account {
  type: "Margin" | "Cash" | "TFSA" | "RRSP";
  number: string; // 8-digit account number
  status: "Active" | "Suspended" | "Closed";
  isPrimary: boolean;
  isBilling: boolean;
  clientAccountType: "Individual" | "Joint" | "Corporation" | "Informal Trust" | "Family";
}

/**
 * Response for GET /accounts
 */
export interface GetAccountsResponse {
  accounts: Account[];
}
