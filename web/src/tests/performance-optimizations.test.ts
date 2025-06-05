import { QuestradeSDK } from "../app/questrade-sdk";
import { BatchRequestHandler } from "../optimizations/batch-request-handler";
import { CacheManager } from "../optimizations/cache-manager";
import { ThrottledAPIClient } from "../optimizations/throttled-api-client";

describe("Performance Optimizations", () => {
  let sdk: QuestradeSDK;

  beforeAll(async () => {
    sdk = new QuestradeSDK("your-refresh-token");
    await sdk.initialize();
  });

  describe("BatchRequestHandler", () => {
    test("batchMarketQuotes should group multiple symbolIds into a single API call", async () => {
      const symbolIds = [123, 456, 789, 1001];
      const quotes = await sdk.batchRequests.batchMarketQuotes(symbolIds);
      expect(quotes).toHaveProperty("quotes");
      expect(quotes.quotes.length).toBeGreaterThan(0);
    });
  });

  describe("CacheManager", () => {
    test("getMarketQuote should return cached data if available", async () => {
      const symbolId = 123;
      const firstQuote = await sdk.cache.getMarketQuote(symbolId);
      expect(firstQuote).toHaveProperty("symbolId", symbolId);

      const cachedQuote = await sdk.cache.getMarketQuote(symbolId);
      expect(cachedQuote).toEqual(firstQuote);
    });

    test("getMarketQuote should fetch new data if cache is expired", async () => {
      const symbolId = 456;
      const firstQuote = await sdk.cache.getMarketQuote(symbolId);
      expect(firstQuote).toHaveProperty("symbolId", symbolId);

      // Simulate cache expiration
      jest.advanceTimersByTime(60000);

      const newQuote = await sdk.cache.getMarketQuote(symbolId);
      expect(newQuote).not.toEqual(firstQuote);
    });
  });

  describe("ThrottledAPIClient", () => {
    test("request should throttle API calls to stay within rate limits", async () => {
      const endpoint = "/v1/markets/quotes?ids=123";
      const firstRequest = await sdk.client.request("GET", endpoint);
      expect(firstRequest).toHaveProperty("quotes");

      const secondRequest = await sdk.client.request("GET", endpoint);
      expect(secondRequest).toHaveProperty("quotes");

      // Ensure requests are throttled
      const timeBetweenRequests = Date.now() - sdk.client.lastRequestTime;
      expect(timeBetweenRequests).toBeGreaterThanOrEqual(1000 / sdk.client.maxRequestsPerSecond);
    });
  });
});
