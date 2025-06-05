import { QuestradeSDK } from "../app/questrade-sdk";

describe("LiveMarketFeed", () => {
  let sdk: QuestradeSDK;

  beforeAll(async () => {
    sdk = new QuestradeSDK("your-refresh-token");
    await sdk.initialize();
  });

  test("should subscribe to a symbol and receive live updates", (done) => {
    sdk.liveMarket.subscribe("AAPL", (data) => {
      try {
        expect(data).toHaveProperty("symbol", "AAPL");
        expect(data).toHaveProperty("price");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  test("should unsubscribe from a symbol and stop receiving updates", (done) => {
    sdk.liveMarket.subscribe("AAPL", (data) => {
      sdk.liveMarket.unsubscribe("AAPL");
      setTimeout(() => {
        expect(sdk.liveMarket["subscribedSymbols"].has("AAPL")).toBe(false);
        done();
      }, 1000);
    });
  });
});
