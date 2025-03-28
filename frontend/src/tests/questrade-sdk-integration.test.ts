import { QuestradeSDK } from "../app/questrade-sdk";
import fetchMock from "jest-fetch-mock";
import { MockAPI } from "./mock-api";

describe("QuestradeSDK Integration", () => {
  let sdk: QuestradeSDK;

  beforeEach(async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify(MockAPI.getMockAuthResponse()));
    sdk = new QuestradeSDK("mock-refresh-token");
    await sdk.initialize();
  });

  test("should fetch market quotes", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(MockAPI.getMockMarketQuotes()));

    const quotes = await sdk.market.getMarketQuotes({ symbolIds: [123] });
    expect(quotes.quotes[0].symbolId).toBe(123);
    expect(quotes.quotes[0].lastTradePrice).toBe(150.75);
  });

  test("should fetch account positions and market prices", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(MockAPI.getMockAccountPositions()));
    fetchMock.mockResponseOnce(JSON.stringify(MockAPI.getMockMarketQuotes()));

    const positions = await sdk.account.getPositions({ accountId: "123456" });
    const marketQuotes = await sdk.market.getMarketQuotes({ symbolIds: [123] });

    expect(positions.positions[0].symbolId).toBe(123);
    expect(marketQuotes.quotes[0].lastTradePrice).toBe(150.75);
  });
});
