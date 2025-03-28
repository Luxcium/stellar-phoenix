export class LiveTradeFeed {
  private ws: WebSocket;
  private eventHandlers: ((data: any) => void)[] = [];

  constructor(private accessToken: string, private apiServer: string) {
    this.ws = this.connect();
  }

  private connect(): WebSocket {
    const wsUrl = `${this.apiServer.replace("https://", "wss://")}/v1/accounts/executions`;
    const ws = new WebSocket(`${wsUrl}?token=${this.accessToken}`);

    ws.onopen = () => console.log("Trade Execution WebSocket connected.");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.eventHandlers.forEach(callback => callback(data));
    };

    ws.onclose = () => {
      console.warn("Trade execution feed disconnected. Reconnecting...");
      setTimeout(() => (this.ws = this.connect()), 5000);
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    return ws;
  }

  onExecution(callback: (data: any) => void) {
    this.eventHandlers.push(callback);
  }
}
