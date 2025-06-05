export class RateLimiter {
  private requestsPerSecond: number = 30;
  private requestsPerHour: number = 30000;
  private requestCount: number = 0;
  private lastResetTime: number = Date.now();

  async limit(): Promise<void> {
    const now = Date.now();
    if (now - this.lastResetTime > 3600000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    if (this.requestCount >= this.requestsPerSecond) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    this.requestCount++;
  }
}
