import { ClockPanel, type OpenShift } from "@/components/driver/clock-panel";
import { EmptyState, PortalHeader } from "@/components/driver/portal-ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getActiveTripForDriver,
  getOpenClockRecord,
  getTruckById,
  listClockRecords,
} from "@/lib/data";
import { dateOnly, dateTime, duration, timeOnly } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Clock In / Out" };

export default async function ClockPage() {
  const driver = await requireDriver();
  const [open, trip, truck, records] = await Promise.all([
    getOpenClockRecord(driver.id),
    getActiveTripForDriver(driver.id),
    getTruckById(driver.assignedTruckId),
    listClockRecords(driver.id),
  ]);

  const openShift: OpenShift = open
    ? {
        clockInAt: open.clockInAt,
        clockInAtLabel: dateTime(open.clockInAt),
        locationIn: open.locationIn,
        startOdometerKm: open.startOdometerKm,
      }
    : null;

  const history = records.filter((record) => record.clockOutAt);

  return (
    <div>
      <PortalHeader
        title="Clock in / out"
        description="Log the start and end of every shift or trip leg."
      />

      <div className="space-y-6 px-4 py-6 sm:px-6">
        <ClockPanel
          openShift={openShift}
          tripLabel={trip ? `${trip.reference} — ${trip.origin} → ${trip.destination}` : undefined}
          lastOdometerKm={open?.startOdometerKm ?? truck?.odometerKm}
        />

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Shift history</CardTitle>
            <Badge variant="subtle">{history.length} closed shifts</Badge>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            {history.length ? (
              <>
                {/* Mobile: cards. Desktop: table. */}
                <ul className="divide-y divide-border sm:hidden">
                  {history.map((record) => (
                    <li key={record.id} className="px-6 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-navy-900">
                          {dateOnly(record.clockInAt)}
                        </p>
                        <Badge variant="subtle">
                          {duration(record.clockInAt, record.clockOutAt!)}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {timeOnly(record.clockInAt)} – {timeOnly(record.clockOutAt!)}
                        {record.locationIn ? ` · ${record.locationIn}` : ""}
                        {record.locationOut ? ` → ${record.locationOut}` : ""}
                      </p>
                      {record.startOdometerKm && record.endOdometerKm ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {(record.endOdometerKm - record.startOdometerKm).toLocaleString()} km
                          driven
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>

                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>In</TableHead>
                        <TableHead>Out</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead className="text-right">Distance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {dateOnly(record.clockInAt)}
                          </TableCell>
                          <TableCell>{timeOnly(record.clockInAt)}</TableCell>
                          <TableCell>{timeOnly(record.clockOutAt!)}</TableCell>
                          <TableCell>{duration(record.clockInAt, record.clockOutAt!)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {record.locationIn ?? "—"}
                            {record.locationOut ? ` → ${record.locationOut}` : ""}
                          </TableCell>
                          <TableCell className="text-right">
                            {record.startOdometerKm && record.endOdometerKm
                              ? `${(record.endOdometerKm - record.startOdometerKm).toLocaleString()} km`
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="px-6">
                <EmptyState
                  title="No closed shifts yet"
                  description="Once you clock out, each completed shift appears here with its duration and distance."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
