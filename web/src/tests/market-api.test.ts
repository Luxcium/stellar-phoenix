import { MarketAPI } from "../modules/market-api";
import { APIClient } from "../app/api-client";
import fetchMock from "jest-fetch-mock";

describe("MarketAPI", () => {
  let apiClient: APIClient;
  let marketApi: MarketAPI;

  beforeEach(() => {
    fetchMock.resetMocks();
    apiClient = new APIClient("https://mock-api", "mock-token");
    marketApi = new MarketAPI(apiClient);
  });

  test("should fetch market quotes", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ quotes: [{ symbolId: 123, lastTradePrice: 100.5 }] })
    );

    const result = await marketApi.getMarketQuotes({ symbolIds: [123] });
    expect(result.quotes[0].symbolId).toBe(123);
    expect(result.quotes[0].lastTradePrice).toBe(100.5);
  });

  test("should handle API errors", async () => {
    fetchMock.mockReject(new Error("API failure"));

    await expect(marketApi.getMarketQuotes({ symbolIds: [123] })).rejects.toThrow("API failure");
  });
});
