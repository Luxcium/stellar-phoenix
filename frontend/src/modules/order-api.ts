import { APIClient } from "../app/api-client";
import { PlaceOrderRequest, PlaceOrderResponse } from "../types/place-order";
import { GetOrderRequest, GetOrderResponse } from "../types/get-order";
import { CancelOrderRequest, CancelOrderResponse } from "../types/cancel-order";
import { GetOrderExecutionsRequest, GetOrderExecutionsResponse } from "../types/get-order-executions";

export class OrderAPI {
  constructor(private client: APIClient) {}

  async placeOrder(request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    return this.client.request<PlaceOrderResponse>("POST", `/accounts/${request.accountId}/orders`, request);
  }

  async getOrder(request: GetOrderRequest): Promise<GetOrderResponse> {
    return this.client.request<GetOrderResponse>("GET", `/accounts/${request.accountId}/orders/${request.orderId}`);
  }

  async cancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
    return this.client.request<CancelOrderResponse>("DELETE", `/accounts/${request.accountId}/orders/${request.orderId}`);
  }

  async getOrderExecutions(request: GetOrderExecutionsRequest): Promise<GetOrderExecutionsResponse> {
    return this.client.request<GetOrderExecutionsResponse>("GET", `/accounts/${request.accountId}/executions`, {
      startTime: request.startTime,
      endTime: request.endTime,
    });
  }
}
