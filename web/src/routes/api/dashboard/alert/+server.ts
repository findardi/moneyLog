import { produce } from "sveltekit-sse";
import API_URL from "$lib/utils/api-url";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ fetch }) => {
  return produce(
    async function start({ emit }) {
      try {
        const response = await fetch(API_URL.dashboard.notification(), {
          method: "GET",
          headers: {
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Backend SSE connection failed:",
            response.status,
            errorText,
          );
          emit(
            "error",
            JSON.stringify({
              message: `Failed to connect: ${response.status} ${response.statusText}`,
              details: errorText,
            }),
          );
          return;
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          emit("error", JSON.stringify({ message: "No stream available" }));
          return;
        }

        let buffer = "";
        let currentEvent = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();

              if (!data) {
                continue;
              }

              try {
                const parsedData = JSON.parse(data);

                if (currentEvent === "connected") {
                  const { error } = emit("connected", data);
                  if (error) {
                    console.error("SSE emit error:", error);
                    reader.cancel();
                    return;
                  }
                } else if (currentEvent === "notification") {
                  const { error } = emit("notification", data);
                  if (error) {
                    console.error("SSE emit error:", error);
                    reader.cancel();
                    return;
                  }
                } else if (currentEvent === "no_budget") {
                  console.log("No budget limit found, closing connection");
                  const { error } = emit("no_budget", data);
                  if (error) {
                    console.error("SSE emit error:", error);
                  }
                  reader.cancel();
                  return;
                } else if (currentEvent === "heartbeat") {
                  // console.log('Heartbeat received:', parsedData.timestamp);
                }

                currentEvent = "";
              } catch (e) {
                console.error("Invalid JSON from backend:", data, e);
              }
            }
          }
        }
      } catch (error) {
        console.error("SSE stream error:", error);
        emit(
          "error",
          JSON.stringify({
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        );
      }
    },
    {
      stop() {
        console.log("Client disconnected from notification stream");
      },
    },
  );
};

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    const apiUrl = API_URL.limit.get();
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch expense detail: ${response.status}`);
    }

    const result = await response.json();
    const body = result.body || result;

    if (!body || !body.data) {
      throw new Error("Invalid response structure: missing data");
    }

    console.log(result);
    return json(body.data[0]);
  } catch (error) {
    throw error;
  }
};
