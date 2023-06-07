import type { Menu } from "./menu.type";

export interface LayoutProps {
  title: string;
  children: React.ReactNode;
  menu?: Menu[];
}
