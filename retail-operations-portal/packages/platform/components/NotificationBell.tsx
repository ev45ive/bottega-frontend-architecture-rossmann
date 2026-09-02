import { Bell } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAppSelector } from "@/shared/store/hooks";
import { markNotificationRead } from "../api/notifications";
import { upsertNotification } from "../store/notificationsSlice";
import { useAppDispatch } from "@/shared/store/hooks";

// Small, self-contained header widget — good candidate to compare Web Component vs Module Federation (Dzień 2 A3).
export function NotificationBell() {
  const notifications = useAppSelector((s) => s.notifications.items);
  const dispatch = useAppDispatch();
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleOpenNotification(id: string) {
    const updated = await markNotificationRead(id);
    dispatch(upsertNotification(updated));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px]"
          >
            {unreadCount}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Powiadomienia</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {notifications.slice(0, 6).map((n) => (
          <DropdownMenuItem
            key={n.id}
            onClick={() => handleOpenNotification(n.id)}
            className={n.read ? "opacity-60" : ""}
          >
            {n.message}
          </DropdownMenuItem>
        ))}
        {notifications.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">Brak powiadomień</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
