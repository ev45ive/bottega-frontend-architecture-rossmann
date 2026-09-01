import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { markNotificationRead } from "../api/notifications";
import { listNotifications } from "../api/notifications";
import { setNotifications, upsertNotification } from "../store/notificationsSlice";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

export function NotificationsPage() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((s) => s.notifications.items);
  useLoadList(useAppSelector((s) => s.notifications.loaded), listNotifications, setNotifications);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Powiadomienia</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-center justify-between py-2 text-sm">
              <span className={n.read ? "text-muted-foreground" : ""}>{n.message}</span>
              {!n.read && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () =>
                    dispatch(upsertNotification(await markNotificationRead(n.id)))
                  }
                >
                  Oznacz jako przeczytane
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
