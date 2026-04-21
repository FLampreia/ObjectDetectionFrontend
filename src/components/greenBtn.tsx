import Link from "next/link"

type GreenBtnProps = {
  desc: string;
  href: string;
};

export default function GreenBtn({desc, href} : GreenBtnProps) {
    return (
        <Link
            href={href}
            className="bg-emerald-500 hover:bg-emerald-100 text-white hover:text-blue-950 font-semibold py-2 px-5 rounded-full transition cursor-pointer text-center"
        >
            {desc}
        </Link>
    )
}