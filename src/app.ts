import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysia/static";
import { notes, projects } from "./data";

const startedAt = Date.now();

export const app = new Elysia({ name: "northline" })
  .onAfterHandle(({ set }) => {
    set.headers["x-content-type-options"] = "nosniff";
    set.headers["x-frame-options"] = "DENY";
  })
  .group("/api", (api) =>
    api
      .get("/health", () => ({
        status: "ok",
        service: "northline-web",
        uptime: Math.floor((Date.now() - startedAt) / 1000)
      }))
      .get("/projects", ({ query }) => {
        const limit = query.limit ?? projects.length;
        return { data: projects.slice(0, limit), total: projects.length };
      }, {
        query: t.Object({ limit: t.Optional(t.Numeric({ minimum: 1, maximum: 10 })) })
      })
      .get("/projects/:id", ({ params, status }) => {
        const project = projects.find((item) => item.id === params.id);
        return project ?? status(404, { message: "Project not found" });
      })
      .get("/notes", () => ({ data: notes, total: notes.length }))
      .post("/inquiries", ({ body, status }) => status(201, {
        message: `Thanks, ${body.name}. We’ll get back to you within two working days.`,
        received: { name: body.name, email: body.email, projectType: body.projectType }
      }), {
        body: t.Object({
          name: t.String({ minLength: 2, maxLength: 80 }),
          email: t.String({ format: "email" }),
          projectType: t.Union([
            t.Literal("Brand & web"),
            t.Literal("Digital product"),
            t.Literal("Something else")
          ])
        })
      })
  )
  .use(staticPlugin({
    assets: "public",
    prefix: "/",
    indexHTML: true,
    headers: { "cache-control": "public, max-age=3600" }
  }));

export type App = typeof app;
