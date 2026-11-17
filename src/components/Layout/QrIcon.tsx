/**
 * The white QR tile used by the side panel and the share triggers.
 *
 * `maxWidth: none` is required: the global `img { max-width: 100% }` rule
 * collapses this image to 0×0 inside zero-width flex rows (the old header
 * trigger rendered as the button's black background only).
 */
export const QrIcon = ({
  size = 18,
  radius = 3,
}: {
  size?: number;
  radius?: number;
}) => (
  <img
    src="/icons/qrIcon.svg"
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      maxWidth: "none",
      flexShrink: 0,
      display: "block",
      borderRadius: `${radius}px`,
    }}
  />
);
