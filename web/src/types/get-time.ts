/**
 * GET /time
 * Retrieves the current server time.
 */

/**
 * No request parameters for GET time.
 */
export interface GetTimeRequest {}

/**
 * Response for GET /time
 */
export interface GetTimeResponse {
  /**
   * Current server time in ISO format (Eastern time).
   */
  time: string;
}
