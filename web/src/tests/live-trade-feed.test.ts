import { QuestradeSDK } from "../app/questrade-sdk";

describe("LiveTradeFeed", () => {
  let sdk: QuestradeSDK;

  beforeAll(async () => {
    sdk = new QuestradeSDK("your-refresh-token");
    await sdk.initialize();
  });

  test("should receive trade execution events in real-time", (done) => {
    sdk.liveTrade.onExecution((data) => {
      try {
        expect(data).toHaveProperty("symbol");
        expect(data).toHaveProperty("quantity");
        expect(data).toHaveProperty("price");
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  test("should automatically reconnect if WebSocket closes", (done) => {
    const originalWs = sdk.liveTrade["ws"];
    originalWs.close();

    setTimeout(() => {
      const newWs = sdk.liveTrade["ws"];
      expect(newWs).not.toBe(originalWs);
      expect(newWs.readyState).toBe(WebSocket.OPEN);
      done();
    }, 6000); // Wait for reconnection
  });
});
