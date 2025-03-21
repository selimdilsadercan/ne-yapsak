"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserX2, Shield, ShieldAlert } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

type User = {
  _id: Id<"users">;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: number;
};

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: { row: Row<User> }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: { row: Row<User> }) => {
      const role = row.getValue("role") as string;
      return (
        <div className="flex items-center gap-2">
          {role === "admin" ? (
            <ShieldAlert className="h-4 w-4 text-destructive" />
          ) : role === "moderator" ? (
            <Shield className="h-4 w-4 text-warning" />
          ) : (
            <UserX2 className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="capitalize">{role}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }: { row: Row<User> }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                toast.success("User role updated");
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Make Moderator
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.success("User suspended");
              }}
              className="text-destructive"
            >
              <UserX2 className="mr-2 h-4 w-4" />
              Suspend User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

export default function AdminUsersPage() {
  const users = useQuery(api.users.getAll) || [];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <DataTable
        columns={columns}
        data={users}
        pagination={{
          pageSize: 10,
          pageIndex: 0
        }}
      />
    </div>
  );
}
