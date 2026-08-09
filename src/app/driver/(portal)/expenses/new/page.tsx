import { ExpenseForm } from "@/components/driver/expense-form";
import { PortalHeader } from "@/components/driver/portal-ui";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveTripForDriver, listTripsForDriver } from "@/lib/data";
import { isoDateInput } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "New Expense" };

export default async function NewExpensePage() {
  const driver = await requireDriver();
  const [trips, activeTrip] = await Promise.all([
    listTripsForDriver(driver.id),
    getActiveTripForDriver(driver.id),
  ]);

  return (
    <div>
      <PortalHeader
        title="Add trip expense"
        description="Fuel, tolls, border fees, food and lodging — logged in the currency you paid in."
        backHref="/driver/expenses"
      />

      <div>
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-6">
            <ExpenseForm
              trips={trips.map((trip) => ({
                id: trip.id,
                label: `${trip.reference} — ${trip.origin} → ${trip.destination}`,
              }))}
              defaultTripId={activeTrip?.id}
              todayIso={isoDateInput(new Date().toISOString())}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
