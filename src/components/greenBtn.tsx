import Link from "next/link"

type GreenBtnProps = {
  desc: string;
  href: string;
};

export default function GreenBtn({ desc, href }: GreenBtnProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center h-10 px-5 rounded-full
                 bg-emerald-500 hover:bg-emerald-100
                 text-white hover:text-blue-950
                 font-semibold text-sm transition"
    >
      {desc}
    </Link>
  );
}