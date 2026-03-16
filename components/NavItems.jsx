import Link from "next/link";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export default function NavItems(mobile = false) {
  if (mobile) {
    return (
      <>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[15px] text-slate-600 hover:text-slate-900 transition-colors py-1"
          >
            {link.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="flex items-center gap-7">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors duration-150 font-medium tracking-wide relative group"
        >
          {link.label}
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-500 transition-all duration-200 group-hover:w-full" />
        </Link>
      ))}
    </div>
  );
}
