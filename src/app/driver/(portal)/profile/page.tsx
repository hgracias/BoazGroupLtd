import { MessageCircle, Phone, ShieldAlert } from "lucide-react";

import { InfoRow, PortalHeader } from "@/components/driver/portal-ui";
import { SignOutButton } from "@/components/driver/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { company } from "@/lib/company";
import { getTruckById } from "@/lib/data";
import { dateOnly, dutyLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const driver = await requireDriver();
  const truck = await getTruckById(driver.assignedTruckId);

  const licenceExpiringSoon =
    driver.licenseExpiry &&
    new Date(driver.licenseExpiry).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 90;

  return (
    <div>
      <PortalHeader title="My profile" description="Details operations holds for you." />

      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-semibold text-white">
                {driver.fullName
                  .split(" ")
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </span>
              <div>
                <p className="font-display text-xl font-semibold text-foreground">
                  {driver.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {driver.employeeId} · {driver.homeBase}
                </p>
              </div>
            </div>
            <Badge variant={driver.dutyStatus === "ON_DUTY" ? "success" : "subtle"}>
              {dutyLabels[driver.dutyStatus]}
            </Badge>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                <InfoRow label="Phone" value={driver.phone} />
                <InfoRow label="WhatsApp" value={driver.whatsapp ?? "Not on file"} />
                <InfoRow label="Email" value={driver.email ?? "Not on file"} />
                <InfoRow label="Home base" value={driver.homeBase} />
                <InfoRow label="Joined" value={dateOnly(driver.joinedAt)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Licence</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                <InfoRow label="Licence number" value={driver.licenseNumber} />
                <InfoRow label="Class" value={driver.licenseClass ?? "—"} />
                <InfoRow
                  label="Expires"
                  value={driver.licenseExpiry ? dateOnly(driver.licenseExpiry) : "—"}
                />
                <InfoRow label="National ID" value={driver.nationalId ?? "Not on file"} />
              </dl>
              {licenceExpiringSoon ? (
                <p className="mt-4 flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-sm text-amber-200">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Your licence expires within 90 days. Start the renewal now — border
                  posts will not clear an expired licence.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assigned truck</CardTitle>
          </CardHeader>
          <CardContent>
            {truck ? (
              <dl className="divide-y divide-border">
                <InfoRow label="Plate number" value={truck.plateNumber} />
                <InfoRow label="Unit" value={`${truck.make} ${truck.model} (${truck.year})`} />
                <InfoRow label="Trailer" value={truck.trailerType ?? "—"} />
                <InfoRow label="Capacity" value={truck.capacityTons ? `${truck.capacityTons} t` : "—"} />
                <InfoRow label="Odometer" value={`${truck.odometerKm.toLocaleString()} km`} />
                <InfoRow
                  label="Insurance expires"
                  value={truck.insuranceExpiry ? dateOnly(truck.insuranceExpiry) : "—"}
                />
              </dl>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                No truck currently assigned to you.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Something wrong here?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Profile details are maintained by the operations desk. Call or message
              them and they will update your record.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" size="touch">
                <a href={company.phoneHref}>
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {company.phone}
                </a>
              </Button>
              <Button asChild variant="outline" size="touch">
                <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp operations
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <SignOutButton full label="Sign out of the driver portal" />
      </div>
    </div>
  );
}
