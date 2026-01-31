export default function DragArrow({ className }: { className?: string }) {
  return (
    <svg
      className={'h-6 w-6 text-blue-600 drop-shadow-md' + ' ' + className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M7 2l12 11.2l-5.8 0.5l3.3 7.3l-2.2 1l-3.2-7.4L7 18z"></path>
    </svg>
  )
}
