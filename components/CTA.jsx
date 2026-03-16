import Link from "next/link";

export default function CTAButton({
  href,
  children,
  size = "md",
  variant = "solid",
}) {
  const sizeClasses = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-5 py-2.5 text-[14px]",
    lg: "px-7 py-3.5 text-[15px]",
  };

  const variantClasses = {
    solid:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-blue-200 hover:shadow-md",
    outline:
      "border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300",
  };

  return (
    <Link
      href={href}
      className={`
        inline-flex items-center justify-center gap-1.5 rounded-lg font-medium
        transition-all duration-150 active:scale-[0.97]
        ${sizeClasses[size]} ${variantClasses[variant]}
      `}
    >
      {children}
    </Link>
  );
}
