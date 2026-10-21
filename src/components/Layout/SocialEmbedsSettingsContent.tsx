import type { CSSProperties } from "react";
import { Form } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import {
  resetSocialEmbedConsent,
  setSocialEmbedAllowed,
} from "@store/slices/dappSlice";
import { SOCIAL_EMBED_PROVIDERS } from "@src/utils/socialEmbedProviders";
import { useTranslation } from "@src/i18n/useTranslation";
import "./SocialEmbedsSettingsContent.css";

const NO_ALLOWED_PROVIDERS: string[] = [];

/**
 * Per-provider embed permissions without any surrounding panel or trigger.
 * Rendered inline on the /privacy page.
 */
export const SocialEmbedsSettingsContent = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const allowed = useAppSelector(
    (s) => s.dapp.allowedSocialEmbeds ?? NO_ALLOWED_PROVIDERS
  );

  return (
    <>
      <div>
        {SOCIAL_EMBED_PROVIDERS.map((provider) => (
          <div key={provider.id} style={rowStyle}>
            <label
              htmlFor={`social-embed-${provider.id}`}
              style={providerLabelStyle}
            >
              {provider.name}
            </label>
            <Form.Check
              type="switch"
              className="social-embed-check form-check"
              id={`social-embed-${provider.id}`}
              checked={allowed.includes(provider.id)}
              style={{ color: "#1a1a1a", marginTop: "2px" }}
              onChange={(event) =>
                dispatch(
                  setSocialEmbedAllowed({
                    provider: provider.id,
                    allowed: event.target.checked,
                  })
                )
              }
            />
            <a
              href={provider.policyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={policyLinkStyle}
            >
              {t("settings.socialEmbedsPolicy", { provider: provider.name })}
            </a>
          </div>
        ))}
      </div>

      <p style={hintStyle}>{t("settings.socialEmbedsHint")}</p>

      <button
        type="button"
        onClick={() => dispatch(resetSocialEmbedConsent())}
        style={resetStyle}
      >
        {t("settings.socialEmbedsReset")}
      </button>
    </>
  );
};

const rowStyle: CSSProperties = {
  padding: "8px 0",
  borderBottom: "1px solid #e2e8f0",
  textAlign: "center",
};

const providerLabelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#1a1a1a",
  cursor: "pointer",
};

const policyLinkStyle: CSSProperties = {
  display: "block",
  marginTop: "2px",
  fontSize: "0.78rem",
  color: "#2b6cb0",
};

const hintStyle: CSSProperties = {
  fontSize: "0.78rem",
  lineHeight: 1.5,
  color: "#475569",
  margin: "12px 0",
  textAlign: "center",
};

const resetStyle: CSSProperties = {
  display: "block",
  margin: "12px auto 0",
  border: "1px solid #cbd5e1",
  backgroundColor: "#e2e8f0",
  color: "#111827",
  borderRadius: "6px",
  padding: "7px 12px",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
};
