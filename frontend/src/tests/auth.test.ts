import { Auth } from "../app/auth";
import fetchMock from "jest-fetch-mock";

describe("Auth", () => {
  let auth: Auth;

  beforeEach(() => {
    fetchMock.resetMocks();
    auth = new Auth("mock-refresh-token");
  });

  test("should authenticate and return access token", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ access_token: "mock-access-token", api_server: "https://mock-api" })
    );

    const result = await auth.authenticate();
    expect(result.accessToken).toBe("mock-access-token");
    expect(result.apiServer).toBe("https://mock-api");
  });

  test("should handle authentication errors", async () => {
    fetchMock.mockReject(new Error("Auth failure"));

    await expect(auth.authenticate()).rejects.toThrow("Auth failure");
  });
});
