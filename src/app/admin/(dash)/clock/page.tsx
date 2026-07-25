import Link from "next/link";

import { EmptyState } from "@/components/driver/portal-ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { decorateWithDriver, listClockRecords, listDrivers } from "@/lib/data";
import { dateOnly, duration, timeOnly } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Clock Logs" };

export default async function AdminClockPage({
  searchParams,
}: {
  searchParams: { driverId?: string };
}) {
  await requireAdmin();

  const drivers = await listDrivers();
  const rows = await decorateWithDriver(await listClockRecords(searchParams.driverId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy-900">
          Clock in / out logs
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {rows.length} record{rows.length === 1 ? "" : "s"} · open shifts are marked
          &ldquo;on shift&rdquo;.
        </p>
      </div>

      <div role="group" aria-label="Filter by driver" className="flex flex-wrap gap-2">
        <Chip href="/admin/clock" label="All drivers" active={!searchParams.driverId} />
        {drivers.map((driver) => (
          <Chip
            key={driver.id}
            href={`/admin/clock?driverId=${driver.id}`}
            label={driver.fullName}
            active={searchParams.driverId === driver.id}
          />
        ))}
      </div>

      <Card>
        <CardContent className="px-0">
          {rows.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>In</TableHead>
                  <TableHead>Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead className="text-right">Distance</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {dateOnly(record.clockInAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="block">{record.driverName}</span>
                      <span className="text-xs text-muted-foreground">
                        {record.driverEmployeeId}
                      </span>
                    </TableCell>
                    <TableCell>{timeOnly(record.clockInAt)}</TableCell>
                    <TableCell>
                      {record.clockOutAt ? (
                        timeOnly(record.clockOutAt)
                      ) : (
                        <Badge variant="success">On shift</Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {record.clockOutAt ? duration(record.clockInAt, record.clockOutAt) : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {record.locationIn ?? "—"}
                      {record.locationOut ? ` → ${record.locationOut}` : ""}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      {record.startOdometerKm && record.endOdometerKm
                        ? `${(record.endOdometerKm - record.startOdometerKm).toLocaleString()} km`
                        : "—"}
                    </TableCell>
                    <TableCell className="max-w-xs text-xs text-muted-foreground">
                      {[record.clockInNote, record.clockOutNote].filter(Boolean).join(" · ") || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-6">
              <EmptyState
                title="No clock records"
                description="Nothing logged for this driver yet."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Chip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition-colors ${
        active
          ? "border-navy-700 bg-navy-700 text-white"
          : "border-border bg-white text-navy-800 hover:border-navy-200"
      }`}
    >
      {label}
    </Link>
  );
}
