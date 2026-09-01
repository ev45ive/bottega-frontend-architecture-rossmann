import { GlobalSearch } from "@/shared/components/GlobalSearch";
import { NotificationBell, UserMenu } from "@/modules/platform";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <span className="font-semibold">Retail Operations Portal</span>
      <div className="flex items-center gap-3">
        <GlobalSearch />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
