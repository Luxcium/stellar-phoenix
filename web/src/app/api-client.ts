import fetch from "node-fetch";

export class BaseAPIClient {
  private apiServer: string;
  private accessToken: string;
  private maxRetries = 3;

  constructor(apiServer: string, accessToken: string) {
    this.apiServer = apiServer;
    this.accessToken = accessToken;
  }

  async request<T>(method: "GET" | "POST", endpoint: string, body?: object): Promise<T> {
    const headers = { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" };
    const options: RequestInit = { method, headers, body: body ? JSON.stringify(body) : undefined };

    let attempt = 0;
    while (attempt < this.maxRetries) {
      try {
        console.info(`[API Request] ${method} ${this.apiServer}${endpoint}`);
        const response = await fetch(`${this.apiServer}${endpoint}`, options);
        const responseData = await response.json();
        console.info(`[API Response] ${endpoint}`, responseData);

        if (!response.ok) throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        return responseData;
      } catch (error) {
        console.warn(`Request failed (attempt ${attempt + 1}): ${error.message}`);
        attempt++;
        if (attempt >= this.maxRetries) throw new Error("Max retry attempts reached");
      }
    }
    throw new Error("Request failed after retries");
  }
}
