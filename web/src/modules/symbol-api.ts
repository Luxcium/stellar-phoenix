import { APIClient } from "../app/api-client";
import { GetSymbolsRequest, GetSymbolsResponse } from "../types/get-symbols-id";
import { GetSymbolOptionsRequest, GetSymbolOptionsResponse } from "../types/get-symbols-id-options";
import { GetSymbolsSearchRequest, GetSymbolsSearchResponse } from "../types/get-symbols-search";

export class SymbolAPI {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async getSymbols(request: GetSymbolsRequest): Promise<GetSymbolsResponse> {
    return this.client.request<GetSymbolsResponse>("GET", `/symbols/${request.ids?.join(",")}`);
  }

  async getSymbolOptions(request: GetSymbolOptionsRequest): Promise<GetSymbolOptionsResponse> {
    return this.client.request<GetSymbolOptionsResponse>("GET", `/symbols/${request.symbolId}/options`);
  }

  async searchSymbols(request: GetSymbolsSearchRequest): Promise<GetSymbolsSearchResponse> {
    return this.client.request<GetSymbolsSearchResponse>("GET", `/symbols/search?prefix=${request.prefix}`);
  }
}
