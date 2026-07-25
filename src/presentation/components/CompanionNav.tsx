import { Link } from "@tanstack/react-router";

/**
 * Navegação principal do Companion. Mantida propositalmente mínima
 * (Jornada / Inbox / Memórias) nesta fase.
 */
export function CompanionNav() {
  const linkClass =
    "rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeClass = "bg-accent text-accent-foreground";

  return (
    <nav className="flex items-center gap-1">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={{ className: `${linkClass} ${activeClass}` }}
        inactiveProps={{ className: linkClass }}
      >
        Jornada
      </Link>
      <Link
        to="/inbox"
        activeProps={{ className: `${linkClass} ${activeClass}` }}
        inactiveProps={{ className: linkClass }}
      >
        Inbox
      </Link>
      <Link
        to="/memories"
        activeProps={{ className: `${linkClass} ${activeClass}` }}
        inactiveProps={{ className: linkClass }}
      >
        Memórias
      </Link>
    </nav>
  );
}
