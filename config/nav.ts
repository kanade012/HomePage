import { Home, FolderKanban, FileText, BookOpen, MessageSquare } from "lucide-react";

export const navItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    external: false,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
    external: false,
  },
  {
    name: "Blog",
    href: "/blog",
    icon: BookOpen,
    external: false,
    subItems: [
      {
        name: "All Posts",
        href: "/blog",
      },
      {
        name: "All Tags",
        href: "/blog/tags",
      },
    ],
  },
  {
    name: "CV (Korean)",
    href: "/cv",
    icon: FileText,
    external: false,
  },
  {
    name: "Get in touch",
    href: "/contact",
    icon: MessageSquare,
    external: false,
  },
]; 