import { useId, useState } from "react";
import type { ConnectionGroup } from "@src/utils/groupConnections";
import { formatContactName } from "@src/utils/connectDisplay";
import { UserConnectedMemory } from "./UserConnectedMemory";
import { useTranslation } from "@src/i18n/useTranslation";

export const ConnectContactSection = ({
  group,
  hasDuplicateNametag,
}: {
  group: ConnectionGroup;
  hasDuplicateNametag: boolean;
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  const displayName = formatContactName(
    group.nametag,
    group.deviceId,
    hasDuplicateNametag
  );
  const date = new Date(group.lastConnectedAt).toLocaleDateString();
  const anthologyCount =
    group.anthologies.length === 1
      ? t("connect.anthologyCountOne")
      : t("connect.anthologyCount", { count: group.anthologies.length });

  return (
    <section className="w-full rounded-xl border border-sky-500/40 bg-[#161b22] p-4 text-zinc-100 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
      <h2 className="m-0 text-xl font-semibold">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((value) => !value)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: "inherit",
            cursor: "pointer",
            font: "inherit",
            textAlign: "left",
          }}
        >
          <span translate="no">{displayName}</span>{" "}
          <span aria-hidden="true" className="text-sm text-zinc-400">
            {expanded ? "▾" : "▸"}
          </span>
        </button>
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        {anthologyCount} · {t("connect.lastConnected", { date })}
      </p>

      <div id={contentId} hidden={!expanded}>
        <UserConnectedMemory anthologies={group.anthologies} />
      </div>
    </section>
  );
};
