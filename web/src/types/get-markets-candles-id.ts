/**
 * GET /markets/candles/:id
 * Retrieves historical market data in OHLC candlesticks form for a specified symbol.
 */

/**
 * Request for GET /markets/candles/:id
 */
export interface GetMarketCandlesRequest {
  /** The symbol ID (path param). */
  symbolId: number;
  /** Beginning of the candlestick range (query param, ISO datetime). */
  startTime: string;
  /** End of the candlestick range (query param, ISO datetime). */
  endTime: string;
  /** Interval of a single candlestick. */
  interval:
    | "OneMinute"
    | "TwoMinutes"
    | "ThreeMinutes"
    | "FourMinutes"
    | "FiveMinutes"
    | "TenMinutes"
    | "FifteenMinutes"
    | "HalfHour"
    | "OneHour"
    | "TwoHours"
    | "FourHours"
    | "OneDay"
    | "OneWeek"
    | "OneMonth"
    | "OneYear";
}

/**
 * A single candlestick (OHLC).
 */
export interface Candle {
  start: string;
  end: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Response for GET /markets/candles/:id
 */
export interface GetMarketCandlesResponse {
  candles: Candle[];
}
