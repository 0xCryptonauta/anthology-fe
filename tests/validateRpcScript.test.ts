import { describe, expect, test } from "bun:test";

describe("RPC deployment validation", () => {
  test("exits successfully when the configured RPC responds on Arbitrum One", async () => {
    const server = Bun.serve({
      port: 0,
      fetch: async () =>
        Response.json({ jsonrpc: "2.0", id: 1, result: "0xa4b1" }),
    });

    try {
      const process = Bun.spawn(["bun", "scripts/validate-rpc.ts"], {
        env: {
          ...globalThis.process.env,
          VITE_FACTORY_RPC: `http://127.0.0.1:${server.port}`,
        },
        stdout: "pipe",
        stderr: "pipe",
      });
      const [exitCode, stdout, stderr] = await Promise.all([
        process.exited,
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
      ]);

      expect({ exitCode, stdout, stderr }).toMatchObject({ exitCode: 0 });
    } finally {
      server.stop(true);
    }
  });

  test("rejects a reachable RPC from the wrong chain using eth_chainId", async () => {
    const methods: string[] = [];
    const server = Bun.serve({
      port: 0,
      fetch: async (request) => {
        const body = (await request.json()) as { method?: string };
        methods.push(body.method ?? "");
        return Response.json({ jsonrpc: "2.0", id: 1, result: "0x1" });
      },
    });

    try {
      const process = Bun.spawn(["bun", "scripts/validate-rpc.ts"], {
        env: {
          ...globalThis.process.env,
          VITE_FACTORY_RPC: `http://127.0.0.1:${server.port}`,
        },
        stdout: "pipe",
        stderr: "pipe",
      });
      const [exitCode, stdout, stderr] = await Promise.all([
        process.exited,
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
      ]);

      expect({ exitCode, stdout, stderr, methods }).toMatchObject({
        exitCode: 1,
        methods: ["eth_chainId"],
      });
    } finally {
      server.stop(true);
    }
  });

  test("aborts an unresponsive RPC instead of hanging deployment", async () => {
    const server = Bun.serve({
      port: 0,
      fetch: () => new Promise<Response>(() => {}),
    });

    try {
      const process = Bun.spawn(["bun", "scripts/validate-rpc.ts"], {
        env: {
          ...globalThis.process.env,
          VITE_FACTORY_RPC: `http://127.0.0.1:${server.port}`,
        },
        stdout: "pipe",
        stderr: "pipe",
      });
      let watchdogFired = false;
      const watchdog = setTimeout(() => {
        watchdogFired = true;
        process.kill();
      }, 6000);
      const startedAt = Date.now();
      const [exitCode, stdout, stderr] = await Promise.all([
        process.exited,
        new Response(process.stdout).text(),
        new Response(process.stderr).text(),
      ]);
      clearTimeout(watchdog);

      expect({ exitCode, stdout, stderr, watchdogFired }).toMatchObject({
        exitCode: 1,
        watchdogFired: false,
      });
      expect(Date.now() - startedAt).toBeLessThan(6000);
    } finally {
      server.stop(true);
    }
  }, 7000);
});
