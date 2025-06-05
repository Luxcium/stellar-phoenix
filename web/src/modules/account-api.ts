import { APIClient } from "../app/api-client";
import { GetAccountBalancesRequest, GetAccountBalancesResponse } from "../types/get-accounts-id-balances";
import { GetAccountPositionsRequest, GetAccountPositionsResponse } from "../types/get-accounts-id-positions";
import { GetAccountOrdersRequest, GetAccountOrdersResponse } from "../types/get-accounts-id-orders";
import { GetAccountExecutionsRequest, GetAccountExecutionsResponse } from "../types/get-accounts-id-executions";
import { GetAccountActivitiesRequest, GetAccountActivitiesResponse } from "../types/get-accounts-id-activities";
import { GetAccountsRequest, GetAccountsResponse } from "../types/get-accounts";

export class AccountAPI {
  constructor(private client: APIClient) {}

  async getBalances(request: GetAccountBalancesRequest): Promise<GetAccountBalancesResponse> {
    return this.client.request<GetAccountBalancesResponse>("GET", `/accounts/${request.accountId}/balances`);
  }

  async getPositions(request: GetAccountPositionsRequest): Promise<GetAccountPositionsResponse> {
    return this.client.request<GetAccountPositionsResponse>("GET", `/accounts/${request.accountId}/positions`);
  }

  async getOrders(request: GetAccountOrdersRequest): Promise<GetAccountOrdersResponse> {
    return this.client.request<GetAccountOrdersResponse>("GET", `/accounts/${request.accountId}/orders`, {
      startTime: request.startTime,
      endTime: request.endTime,
      stateFilter: request.stateFilter,
      orderId: request.orderId,
    });
  }

  async getExecutions(request: GetAccountExecutionsRequest): Promise<GetAccountExecutionsResponse> {
    return this.client.request<GetAccountExecutionsResponse>("GET", `/accounts/${request.accountId}/executions`, {
      startTime: request.startTime,
      endTime: request.endTime,
    });
  }

  async getActivities(request: GetAccountActivitiesRequest): Promise<GetAccountActivitiesResponse> {
    return this.client.request<GetAccountActivitiesResponse>("GET", `/accounts/${request.accountId}/activities`, {
      startTime: request.startTime,
      endTime: request.endTime,
    });
  }

  async getAccount(request: GetAccountsRequest): Promise<GetAccountsResponse> {
    return this.client.request<GetAccountsResponse>("GET", `/accounts`);
  }
}
