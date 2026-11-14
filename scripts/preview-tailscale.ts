import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { preview, type PreviewServer } from "vite";

interface TailscaleStatus {
  Self?: {
    DNSName?: string;
  };
}

const DEFAULT_PORT = 4174;

const args = process.argv.slice(2);

const getArg = (name: string): string | undefined => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};

const port = Number(getArg("--port") ?? process.env.PORT ?? DEFAULT_PORT);
const buildFirst = args.includes("--build");
const forceResetServe = args.includes("--reset-serve");
const keepServe = args.includes("--keep-serve");

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid port: ${String(port)}`);
  process.exit(1);
}

if (forceResetServe && keepServe) {
  console.error("Use either --reset-serve or --keep-serve, not both.");
  process.exit(1);
}

const readTailscaleHost = (): string => {
  let output: string;

  try {
    output = execFileSync("tailscale", ["status", "--json"], {
      encoding: "utf8",
    });
  } catch {
    console.error(
      "Tailscale is not available. Install it and sign in on this machine first."
    );
    process.exit(1);
  }

  let status: TailscaleStatus;
  try {
    status = JSON.parse(output) as TailscaleStatus;
  } catch {
    console.error("Could not parse `tailscale status --json`.");
    process.exit(1);
  }

  const host = status.Self?.DNSName?.replace(/\.$/, "");
  if (!host) {
    console.error(
      "Tailscale did not report a DNS name. Make sure MagicDNS is enabled."
    );
    process.exit(1);
  }

  return host;
};

const hasExistingServe = (): boolean => {
  try {
    const output = execFileSync("tailscale", ["serve", "status", "--json"], {
      encoding: "utf8",
    }).trim();

    if (!output) return false;

    const parsed = JSON.parse(output) as Record<string, unknown>;
    return Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
};

const closeServer = async (server: PreviewServer): Promise<void> => {
  const httpServer = server.httpServer as typeof server.httpServer & {
    closeAllConnections?: () => void;
  };

  httpServer.closeAllConnections?.();

  await Promise.race([
    new Promise<void>((resolve) => {
      server.httpServer.close(() => resolve());
    }),
    new Promise<void>((resolve) => setTimeout(resolve, 2000)),
  ]);
};

const host = readTailscaleHost();
const hadServeConfig = hasExistingServe();
const createdServe = !hadServeConfig;
const shouldResetServe =
  forceResetServe || (createdServe && !keepServe);

if (hadServeConfig) {
  console.warn(
    forceResetServe
      ? "Tailscale Serve already has a configuration; --reset-serve will clear all of it on exit."
      : "Tailscale Serve already has a configuration; the script will replace the root proxy and leave the configuration in place on exit."
  );
}

if (buildFirst) {
  console.log("Building production bundle...");
  execFileSync("bun", ["run", "build"], { stdio: "inherit" });
}

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html is missing. Run `bun run build` first.");
  process.exit(1);
}

let server: PreviewServer;
try {
  server = await preview({
    configFile: "vite.config.ts",
    preview: {
      host: true,
      port,
      strictPort: true,
      allowedHosts: [host],
    },
  });
} catch (error) {
  console.error(
    `Could not start the preview on port ${port}. Is it already in use?`
  );
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

let shuttingDown = false;

const shutdown = async (signal: string): Promise<void> => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`\nStopping preview (${signal})...`);
  await closeServer(server);

  if (shouldResetServe) {
    try {
      execFileSync("tailscale", ["serve", "reset"], { stdio: "inherit" });
    } catch {
      console.warn("Could not reset the Tailscale Serve configuration.");
    }
  } else {
    console.log("Leaving the Tailscale Serve configuration in place.");
  }

  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGHUP", () => void shutdown("SIGHUP"));

try {
  execFileSync("tailscale", ["serve", "--bg", String(port)], {
    stdio: "inherit",
  });
} catch (error) {
  console.error(
    "Could not configure Tailscale Serve. Enable HTTPS certificates for your tailnet in the Tailscale admin console, then retry."
  );
  console.error(error instanceof Error ? error.message : String(error));

  if (createdServe) {
    try {
      execFileSync("tailscale", ["serve", "reset"], { stdio: "inherit" });
    } catch {
      // Best effort: the serve command may not have applied anything.
    }
  }

  await closeServer(server);
  process.exit(1);
}

const url = `https://${host}/`;

let reachable = false;
for (let attempt = 0; attempt < 10; attempt += 1) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      reachable = true;
      break;
    }
  } catch {
    // Tailscale Serve can take a moment to apply.
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

if (!reachable) {
  console.warn(
    `\nWarning: ${url} did not answer yet. Tailscale Serve may still be applying.`
  );
}

const serveExitMessage = shouldResetServe
  ? "Tailscale Serve will be reset on exit."
  : hadServeConfig
  ? "Tailscale Serve was already configured; it will be left as-is."
  : "Tailscale Serve will be left as-is (--keep-serve).";

console.log(`
Tailscale HTTPS preview ready
  Phone (HTTPS): ${url}
  Local:         http://localhost:${port}/

Tailnet-only. Open the HTTPS URL on the phone (Tailscale on) and allow camera access.
Press Ctrl+C to stop. ${serveExitMessage}
`);
