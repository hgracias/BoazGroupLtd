import Link from "next/link";
import { Paperclip } from "lucide-react";

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
import { formatMoney } from "@/lib/currency";
import { decorateWithDriver, decorateWithTruck, listMaintenance, listTrucks } from "@/lib/data";
import { dateOnly, maintenanceTypeLabels } from "@/lib/format";
import { requireAdmin } from "@/lib/session";

export const metadata = { title: "Maintenance" };

export default async function AdminMaintenancePage({
  searchParams,
}: {
  searchParams: { truckId?: string };
}) {
  await requireAdmin();

  const trucks = await listTrucks();
  const rows = await decorateWithDriver(
    await decorateWithTruck(await listMaintenance({ truckId: searchParams.truckId || undefined }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-navy-900">
          Maintenance records
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything drivers have logged across the fleet, newest first.
        </p>
      </div>

      <div role="group" aria-label="Filter by truck" className="flex flex-wrap gap-2">
        <FilterChip href="/admin/maintenance" label="All trucks" active={!searchParams.truckId} />
        {trucks.map((truck) => (
          <FilterChip
            key={truck.id}
            href={`/admin/maintenance?truckId=${truck.id}`}
            label={truck.plateNumber}
            active={searchParams.truckId === truck.id}
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
                  <TableHead>Truck</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Logged by</TableHead>
                  <TableHead className="text-right">Odometer</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {dateOnly(record.performedAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="subtle">{record.truckPlate}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {maintenanceTypeLabels[record.type]}
                    </TableCell>
                    <TableCell className="max-w-sm text-muted-foreground">
                      {record.description}
                      {record.vendor ? (
                        <span className="block text-xs">{record.vendor}</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span className="block">{record.driverName}</span>
                      <span className="text-xs text-muted-foreground">
                        {record.driverEmployeeId}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      {record.odometerKm.toLocaleString()} km
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold">
                      {formatMoney(record.costAmount, record.costCurrency)}
                    </TableCell>
                    <TableCell>
                      {record.receiptUrl ? (
                        <a
                          href={record.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-navy-700 hover:underline"
                        >
                          <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                          View
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-6">
              <EmptyState
                title="No maintenance records"
                description="Nothing has been logged for this truck yet."
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
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
