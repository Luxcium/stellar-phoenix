import { SmartQueryEngine } from "./query-engine";

export class AutoQueryExecutor {
  private queryEngine: SmartQueryEngine;

  constructor(queryEngine: SmartQueryEngine) {
    this.queryEngine = queryEngine;
  }

  async execute(params: { symbolName?: string; accountId?: string }) {
    if (params.symbolName) {
      return this.queryEngine.getFullStockOverview(params.symbolName);
    }
    if (params.accountId) {
      return this.queryEngine.getAccountSummary(params.accountId);
    }
    throw new Error("Invalid query parameters");
  }
}
