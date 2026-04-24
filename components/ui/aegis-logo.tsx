/**
 * Aegis Brand Logo Component
 *
 * Based on brand guidelines:
 * - Shield shape with stylized "A" letterform and keyhole
 * - Primary palette: #7C5CFF, #A78BFA, #4F46E5
 * - Three variants: icon-only, horizontal (icon + wordmark), stacked
 */

interface AegisLogoIconProps {
  className?: string;
  size?: number;
}

/** Icon-only mark — the shield with embedded "A" + keyhole */
export function AegisLogoIcon({ className = "", size = 32 }: AegisLogoIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      aria-label="Aegis logo"
    >
      <defs>
        <linearGradient id="aegis-shield-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="aegis-inner-grad" x1="16" y1="12" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C5CFF" />
        </linearGradient>
      </defs>

      {/* Outer shield shape */}
      <path
        d="M32 2L6 16v16c0 16 11 26.5 26 30 15-3.5 26-14 26-30V16L32 2Z"
        fill="url(#aegis-shield-grad)"
      />

      {/* Inner shield outline */}
      <path
        d="M32 8L12 19v12c0 13 8.5 21.5 20 24.5 11.5-3 20-11.5 20-24.5V19L32 8Z"
        fill="none"
        stroke="url(#aegis-inner-grad)"
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Stylised "A" letterform */}
      <path
        d="M32 16L21 44h5l2.2-6h7.6l2.2 6h5L32 16Zm-1.8 18L32 28.5l1.8 5.5h-3.6Z"
        fill="white"
        opacity="0.95"
      />

      {/* Keyhole circle */}
      <circle cx="32" cy="30" r="3.5" fill="white" opacity="0.95" />

      {/* Keyhole slot */}
      <rect x="30.5" y="33" width="3" height="5" rx="1.5" fill="white" opacity="0.95" />
    </svg>
  );
}

interface AegisLogoProps {
  /** "horizontal" = icon + wordmark side-by-side (default), "icon" = icon only */
  variant?: "horizontal" | "icon";
  /** Icon size in px */
  iconSize?: number;
  /** Additional classes on the wrapper */
  className?: string;
  /** Text size class override for wordmark, e.g. "text-xl" */
  textClass?: string;
}

/** Full logo component with icon + optional "Aegis" wordmark */
export function AegisLogo({
  variant = "horizontal",
  iconSize = 32,
  className = "",
  textClass = "text-xl",
}: AegisLogoProps) {
  if (variant === "icon") {
    return <AegisLogoIcon size={iconSize} className={className} />;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <AegisLogoIcon size={iconSize} />
      <span className={`font-bold gradient-text ${textClass}`}>Aegis</span>
    </span>
  );
}
