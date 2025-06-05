export class Auth {
  private refreshToken: string;
  private apiServer: string = "https://login.questrade.com";

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
  }

  async authenticate(): Promise<{ accessToken: string; apiServer: string }> {
    try {
      const response = await fetch(`${this.apiServer}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant_type: "refresh_token", refresh_token: this.refreshToken }),
      });

      if (!response.ok) throw new Error("Failed to authenticate with Questrade");

      const data = await response.json();
      return { accessToken: data.access_token, apiServer: data.api_server };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication failed");
    }
  }
}
