import { useAppDispatch } from "@src/store/utils/hooks";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import { shortenAddress } from "@src/utils/shortenAddress";
import type { CurrentPaths } from "@src/types/common";
import type { ConnectionGroup } from "@src/utils/groupConnections";
import { useTranslation } from "@src/i18n/useTranslation";

export const ConnectContactSection = ({
  group,
}: {
  group: ConnectionGroup;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const openAnthology = (address: string) => {
    const path = `contract/${address}` as CurrentPaths;
    dispatch(updateCurrentPath(path));
    window.history.pushState(
      { currentPath: path },
      "",
      window.location.pathname
    );
  };

  const date = new Date(group.lastConnectedAt).toLocaleDateString();
  const anthologyCount =
    group.anthologies.length === 1
      ? t("connect.anthologyCountOne")
      : t("connect.anthologyCount", { count: group.anthologies.length });

  return (
    <section className="w-full rounded-xl border border-sky-500/40 bg-[#161b22] p-4 text-zinc-100 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="m-0 text-xl font-semibold" translate="no">
          {group.nametag}
        </h2>
        <span className="text-xs font-mono text-zinc-400" translate="no">
          {shortenAddress(group.deviceId, 8, 4)}
        </span>
      </div>

      <p className="mt-1 text-sm text-zinc-400">
        {anthologyCount} · {t("connect.lastConnected", { date })}
      </p>

      <ul className="mt-3 space-y-2">
        {group.anthologies.map((anthology) => (
          <li key={anthology.address}>
            <button
              type="button"
              onClick={() => openAnthology(anthology.address)}
              className="flex w-full flex-wrap items-baseline justify-between gap-2 rounded-lg bg-transparent px-2 py-1 text-left text-white transition-colors hover:bg-white/5"
            >
              <span className="font-medium" translate="no">
                {anthology.title}
              </span>
              <span className="text-xs text-zinc-400">
                {anthology.memoirCount === 1
                  ? t("connect.memoirCountOne")
                  : t("connect.memoirCount", {
                      count: anthology.memoirCount,
                    })}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
