export class MockAPI {
  static getMockMarketQuotes() {
    return {
      quotes: [{ symbolId: 123, lastTradePrice: 150.75, bidPrice: 150.5, askPrice: 151.0 }]
    };
  }

  static getMockAuthResponse() {
    return { access_token: "mock-access-token", api_server: "https://mock-api" };
  }

  static getMockAccountPositions() {
    return {
      positions: [{ symbol: "AAPL", symbolId: 123, openQuantity: 10, currentMarketValue: 1500 }]
    };
  }
}
