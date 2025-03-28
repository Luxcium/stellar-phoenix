import { BaseAPIClient } from "./api-client";

export class ThrottledAPIClient extends BaseAPIClient {
  private maxRequestsPerSecond = 30;
  private lastRequestTime: number = 0;

  async request<T>(method: "GET" | "POST", endpoint: string, body?: object): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < 1000 / this.maxRequestsPerSecond) {
      await new Promise(resolve => setTimeout(resolve, 1000 / this.maxRequestsPerSecond - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
    return super.request<T>(method, endpoint, body);
  }
}
