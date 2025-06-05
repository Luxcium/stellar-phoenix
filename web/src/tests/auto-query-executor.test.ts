import { QuestradeSDK } from "../app/questrade-sdk";

describe("AutoQueryExecutor", () => {
  let sdk: QuestradeSDK;

  beforeAll(async () => {
    sdk = new QuestradeSDK("your-refresh-token");
    await sdk.initialize();
  });

  test("execute should fetch full stock overview when symbolName is provided", async () => {
    const result = await sdk.autoQuery.execute({ symbolName: "AAPL" });
    expect(result).toHaveProperty("symbol", "AAPL");
    expect(result).toHaveProperty("market");
    expect(result).toHaveProperty("optionChain");
    expect(result).toHaveProperty("history");
  });

  test("execute should fetch full account summary when accountId is provided", async () => {
    const result = await sdk.autoQuery.execute({ accountId: "12345678" });
    expect(result).toHaveProperty("accountBalances");
    expect(result).toHaveProperty("positions");
    expect(result.positions[0]).toHaveProperty("marketPrice");
  });
});
