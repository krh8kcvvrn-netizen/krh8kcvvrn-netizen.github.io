export default function Mark({ size = 28 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0D7377" />
      <circle cx="32" cy="13" r="5" fill="#D4A017" />
      <path fill="#F7F9F8" d="M8 36.5h48v7H8zM12 36.5h9v15h-9zM43 36.5h9v15h-9z" />
      <path d="M18 40A14 14 0 0 1 46 40" fill="none" stroke="#F7F9F8" strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  );
}
