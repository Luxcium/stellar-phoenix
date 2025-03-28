import { QuestradeSDK } from "../app/questrade-sdk";

describe("SmartQueryEngine", () => {
  let sdk: QuestradeSDK;

  beforeAll(async () => {
    sdk = new QuestradeSDK("your-refresh-token");
    await sdk.initialize();
  });

  test("getFullStockOverview should fetch full stock overview", async () => {
    const stockData = await sdk.query.getFullStockOverview("AAPL");
    expect(stockData).toHaveProperty("symbol", "AAPL");
    expect(stockData).toHaveProperty("market");
    expect(stockData).toHaveProperty("optionChain");
    expect(stockData).toHaveProperty("history");
  });

  test("getAccountSummary should fetch full account summary", async () => {
    const accountData = await sdk.query.getAccountSummary("12345678");
    expect(accountData).toHaveProperty("accountBalances");
    expect(accountData).toHaveProperty("positions");
    expect(accountData.positions[0]).toHaveProperty("marketPrice");
  });
});
