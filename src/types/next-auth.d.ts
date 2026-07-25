import type { DefaultSession } from "next-auth";

import type { Role } from "@/lib/data/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      employeeId: string;
      role: Role;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    employeeId: string;
    role: Role;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    employeeId: string;
    role: Role;
    name: string;
  }
}
