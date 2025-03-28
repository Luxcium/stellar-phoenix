export class LiveMarketFeed {
  private ws: WebSocket;
  private reconnectInterval = 5000; // 5 seconds reconnect delay
  private eventHandlers: Map<string, (data: any) => void> = new Map();
  private subscribedSymbols: Set<string> = new Set();

  constructor(private accessToken: string, private apiServer: string) {
    this.ws = this.connect();
  }

  private connect(): WebSocket {
    const wsUrl = `${this.apiServer.replace("https://", "wss://")}/v1/markets/quotes`;
    const ws = new WebSocket(`${wsUrl}?token=${this.accessToken}`);

    ws.onopen = () => {
      console.log("WebSocket connected.");
      this.subscribedSymbols.forEach(symbol => this.ws.send(JSON.stringify({ action: "subscribe", symbol })));
    };

    ws.onclose = () => {
      console.warn("WebSocket disconnected. Reconnecting...");
      setTimeout(() => (this.ws = this.connect()), this.reconnectInterval);
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.eventHandlers.has(data.symbol)) {
        this.eventHandlers.get(data.symbol)?.(data);
      }
    };

    return ws;
  }

  subscribe(symbol: string, callback: (data: any) => void) {
    this.eventHandlers.set(symbol, callback);
    this.subscribedSymbols.add(symbol);
    this.ws.send(JSON.stringify({ action: "subscribe", symbol }));
  }

  unsubscribe(symbol: string) {
    this.eventHandlers.delete(symbol);
    this.subscribedSymbols.delete(symbol);
    this.ws.send(JSON.stringify({ action: "unsubscribe", symbol }));
  }
}
