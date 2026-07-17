import { describe, expect, it } from "bun:test";
import { app } from "../src/app";

describe("Northline API", () => {
  it("reports service health", async () => {
    const response = await app.handle(new Request("http://localhost/api/health"));
    expect(response.status).toBe(200);
    expect((await response.json()).status).toBe("ok");
  });

  it("filters the project collection", async () => {
    const response = await app.handle(new Request("http://localhost/api/projects?limit=2"));
    const payload = await response.json();
    expect(payload.data).toHaveLength(2);
    expect(payload.total).toBe(3);
  });

  it("returns a useful 404 for an unknown project", async () => {
    const response = await app.handle(new Request("http://localhost/api/projects/unknown"));
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: "Project not found" });
  });

  it("validates and accepts an inquiry", async () => {
    const response = await app.handle(new Request("http://localhost/api/inquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Dara",
        email: "dara@example.com",
        projectType: "Digital product"
      })
    }));
    expect(response.status).toBe(201);
  });
});
