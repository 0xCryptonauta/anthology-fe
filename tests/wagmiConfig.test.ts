import { describe, expect, test } from "bun:test";

describe("wagmi RPC configuration", () => {
  test("uses Arbitrum's public RPC when no RPC is configured", async () => {
    const process = Bun.spawn(
      [
        "bun",
        "-e",
        'import("./src/wagmiConfig.ts").then(({ networks }) => console.log(JSON.stringify(networks[0].rpcUrls.default.http)))',
      ],
      {
        env: { ...globalThis.process.env, VITE_FACTORY_RPC: "" },
        stdout: "pipe",
        stderr: "pipe",
      }
    );
    const [exitCode, stdout, stderr] = await Promise.all([
      process.exited,
      new Response(process.stdout).text(),
      new Response(process.stderr).text(),
    ]);

    expect({
      exitCode,
      stderr,
      networks: JSON.parse(stdout) as string[],
    }).toEqual({
      exitCode: 0,
      stderr: "",
      networks: ["https://arb1.arbitrum.io/rpc"],
    });
  });
});
