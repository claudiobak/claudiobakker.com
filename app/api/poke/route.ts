const POKE_COUNTER_KEY = "portfolio:creature:pokes";

type RedisResponse = {
  result?: number;
  error?: string;
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  }

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!redisUrl || !redisToken) {
    return Response.json({ error: "Counter is not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["INCR", POKE_COUNTER_KEY]),
      cache: "no-store",
    });
    const data = (await response.json()) as RedisResponse;

    if (!response.ok || typeof data.result !== "number") {
      throw new Error(data.error ?? "Invalid response from counter");
    }

    return Response.json(
      { count: data.result },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to increment creature poke counter", error);
    return Response.json({ error: "Counter unavailable" }, { status: 502 });
  }
}
