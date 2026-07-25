import { MaintenanceForm } from "@/components/driver/maintenance-form";
import { PortalHeader } from "@/components/driver/portal-ui";
import { Card, CardContent } from "@/components/ui/card";
import { getTruckById, listTrucks } from "@/lib/data";
import { isoDateInput } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Log Maintenance" };

export default async function NewMaintenancePage() {
  const driver = await requireDriver();
  const [trucks, assigned] = await Promise.all([
    listTrucks(),
    getTruckById(driver.assignedTruckId),
  ]);

  return (
    <div>
      <PortalHeader
        title="Log maintenance"
        description="Record work done on a truck so the workshop and operations have the history."
        backHref="/driver/maintenance"
      />

      <div className="px-4 py-6 sm:px-6">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-6">
            <MaintenanceForm
              trucks={trucks}
              defaultTruckId={assigned?.id}
              defaultOdometerKm={assigned?.odometerKm}
              todayIso={isoDateInput(new Date().toISOString())}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
