import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
  replace?: boolean;
  prefetch?: boolean;
}

export default function NextLink({ href, replace = false, prefetch = false, children }: Props) {
  return <Link href={href} replace={replace} prefetch={prefetch} passHref legacyBehavior>{children}</Link>
}
