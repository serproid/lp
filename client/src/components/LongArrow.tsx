export default function LongArrow({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={Math.round(size * 1.75)}
      height={size}
      viewBox="0 0 35 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 10h31" />
      <path d="M24 3l7 7-7 7" />
    </svg>
  );
}
