import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/cloudflare-pages";

const app = new Hono().basePath("/proxy");

app.get("/:folder/:fileName", async (c) => {
  const folder = c.req.param("folder");
  const fileName = c.req.param("fileName");

  const result = await fetch(
    `https://pics.janitorai.com/${folder}/${fileName}`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "sec-ch-ua":
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        referer: "https://www.janitorai.com",
        authority: "pics.janitorai.com",
      },
      method: "GET",
    }
  );

  let headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  headers.set("Cache-Control", "public, max-age=604800");
  headers.set("Content-Type", result.headers.get("Content-Type") || "");

  return new Response(result.body, {
    headers,
  });
});

export const onRequest = handle(app);
