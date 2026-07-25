import Link from "next/link";
import { Filter, Paperclip, Plus } from "lucide-react";

import { EmptyState, PortalHeader } from "@/components/driver/portal-ui";
import { FormBanner } from "@/components/driver/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/currency";
import { decorateWithTruck, listMaintenance, listTrucks } from "@/lib/data";
import { dateOnly, maintenanceTypeLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Maintenance" };

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: { truckId?: string; from?: string; to?: string; saved?: string };
}) {
  const driver = await requireDriver();
  const trucks = await listTrucks();

  const records = await decorateWithTruck(
    await listMaintenance({
      driverId: driver.id,
      truckId: searchParams.truckId || undefined,
      from: searchParams.from || undefined,
      to: searchParams.to || undefined,
    })
  );

  const filtered = Boolean(searchParams.truckId || searchParams.from || searchParams.to);

  return (
    <div>
      <PortalHeader
        title="Truck maintenance"
        description="Everything you have logged, newest first."
        action={
          <Button asChild size="touch">
            <Link href="/driver/maintenance/new">
              <Plus className="h-5 w-5" aria-hidden="true" />
              Log maintenance
            </Link>
          </Button>
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6">
        {searchParams.saved ? (
          <FormBanner tone="success">Maintenance record saved.</FormBanner>
        ) : null}

        {/* Plain GET form — filtering works without JavaScript. */}
        <Card>
          <CardContent className="p-5">
            <form className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="truckId">Truck</Label>
                <Select id="truckId" name="truckId" defaultValue={searchParams.truckId ?? ""}>
                  <option value="">All trucks</option>
                  {trucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.plateNumber}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input id="from" name="from" type="date" defaultValue={searchParams.from ?? ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input id="to" name="to" type="date" defaultValue={searchParams.to ?? ""} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="outline" size="touch">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  Filter
                </Button>
                {filtered ? (
                  <Button asChild variant="ghost" size="touch">
                    <Link href="/driver/maintenance">Clear</Link>
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        {records.length ? (
          <Card>
            <CardContent className="px-0 py-0 sm:px-0">
              {/* Mobile list */}
              <ul className="divide-y divide-border sm:hidden">
                {records.map((record) => (
                  <li key={record.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy-900">
                          {maintenanceTypeLabels[record.type]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {dateOnly(record.performedAt)} · {record.truckPlate}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-navy-900">
                        {formatMoney(record.costAmount, record.costCurrency)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{record.description}</p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{record.odometerKm.toLocaleString()} km</span>
                      {record.vendor ? <span>· {record.vendor}</span> : null}
                      {record.receiptUrl ? (
                        <a
                          href={record.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-navy-700 hover:underline"
                        >
                          <Paperclip className="h-3 w-3" aria-hidden="true" />
                          Receipt
                        </a>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Truck</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Odometer</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                      <TableHead>Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
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
              </div>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title={filtered ? "No records match those filters" : "No maintenance logged yet"}
            description={
              filtered
                ? "Try widening the date range or selecting all trucks."
                : "Log oil changes, tyres, brakes, servicing and repairs so the workshop has the full history."
            }
            action={
              <Button asChild size="touch">
                <Link href="/driver/maintenance/new">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  Log maintenance
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
