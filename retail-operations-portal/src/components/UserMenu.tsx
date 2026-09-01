import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/store/hooks";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  manager: "Kierownik",
  viewer: "Podgląd",
};

export function UserMenu() {
  const user = useAppSelector((s) => s.currentUser);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar className="size-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <div className="px-2 pb-1.5 text-xs text-muted-foreground">
            {ROLE_LABELS[user.role] ?? user.role}
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Wyloguj (Dzień 3)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
