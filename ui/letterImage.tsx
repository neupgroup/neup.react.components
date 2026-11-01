import type { CSSProperties, HTMLAttributes } from 'react';

export type LetterImageProps = HTMLAttributes<HTMLSpanElement> & {
  src?: string | null;
  initials?: string;
  alt?: string;
  imageClassName?: string;
  fontSize?: string;
};

const letterColors = [
  '#2563eb', '#7c3aed', '#c026d3', '#db2777', '#e11d48', '#ea580c',
  '#ca8a04', '#16a34a', '#0d9488', '#0891b2', '#4f46e5', '#9333ea',
];

/** Returns a stable color for each initial, suitable for server rendering. */
function getLetterColor(letter: string): string {
  const code = letter.toUpperCase().codePointAt(0) ?? 85;
  return letterColors[code % letterColors.length];
}

/** Renders a full-size photo, or a deterministic two-letter fallback without client state. */
export function LetterImage({
  src,
  initials = 'U',
  alt = '',
  imageClassName = '',
  fontSize = '1.5rem',
  className = '',
  style,
  ...props
}: LetterImageProps) {
  const letters = initials.trim().slice(0, 2).toUpperCase() || 'U';
  const imageSrc = src?.trim() || null;
  const colors = Array.from(letters, getLetterColor);
  const background = colors.length > 1
    ? `linear-gradient(135deg, ${colors[0]} 0 50%, ${colors[1]} 50% 100%)`
    : colors[0];
  const combinedStyle: CSSProperties = {
    background,
    fontFamily: '"Times New Roman", Times, serif',
    fontSize,
    ...style,
  };

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}
      style={combinedStyle}
      aria-label={!imageSrc ? (alt || letters) : undefined}
      {...props}
    >
      {imageSrc ? (
        <img className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`} src={imageSrc} alt={alt} />
      ) : (
        <span className="relative z-10 font-bold leading-none text-white">{letters}</span>
      )}
    </span>
  );
}
