import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { DataTable } from "@/shared/components/DataTable";
import { listUsers, assignUserRole } from "../api/users";
import { setUsers, upsertUser } from "../store/usersSlice";
import type { UserRole } from "../types";
import { useAppDispatch, useAppSelector } from "@/shared/store/hooks";
import { useLoadList } from "@/shared/store/useLoadList";

// Base for Dzień 3 (role/permissions) — read + role assignment only, no full user management.
export function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.items);
  useLoadList(useAppSelector((s) => s.users.loaded), listUsers, setUsers);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Użytkownicy i role</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { key: "name", header: "Imię i nazwisko", render: (u) => u.name },
            { key: "email", header: "E-mail", render: (u) => u.email },
            {
              key: "role",
              header: "Rola",
              render: (u) => (
                <Select
                  value={u.role}
                  onValueChange={async (role) =>
                    dispatch(upsertUser(await assignUserRole(u.id, role as UserRole)))
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Kierownik</SelectItem>
                    <SelectItem value="viewer">Podgląd</SelectItem>
                  </SelectContent>
                </Select>
              ),
            },
          ]}
          rows={users}
          getRowId={(u) => u.id}
          searchText={(u) => `${u.name} ${u.email}`}
        />
      </CardContent>
    </Card>
  );
}
