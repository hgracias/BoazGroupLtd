import { z } from "zod";

import { cleanEmail, cleanLine, cleanPhone, cleanText } from "@/lib/sanitize";

// Must stay in step with Currency in src/lib/data/types.ts.
const currencyEnum = z.enum(["TZS", "KES", "RWF", "BIF", "UGX", "CDF", "USD"]);

export const loginSchema = z.object({
  employeeId: z
    .string()
    .min(3, "Enter your employee ID")
    .max(32, "That employee ID looks too long"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const clockInSchema = z.object({
  location: z.string().max(80).optional().or(z.literal("")),
  startOdometerKm: z.coerce
    .number({ invalid_type_error: "Enter the odometer reading" })
    .int("Whole kilometres only")
    .min(0)
    .max(3_000_000)
    .optional(),
  note: z.string().max(240, "Keep the note under 240 characters").optional().or(z.literal("")),
});

export const clockOutSchema = z.object({
  location: z.string().max(80).optional().or(z.literal("")),
  endOdometerKm: z.coerce
    .number({ invalid_type_error: "Enter the odometer reading" })
    .int("Whole kilometres only")
    .min(0)
    .max(3_000_000)
    .optional(),
  note: z.string().max(240, "Keep the note under 240 characters").optional().or(z.literal("")),
});

export const maintenanceSchema = z.object({
  truckId: z.string().min(1, "Select the truck"),
  performedAt: z.string().min(1, "Select the date"),
  type: z.enum(["OIL_CHANGE", "TIRES", "BRAKES", "GENERAL_SERVICE", "REPAIR", "INSPECTION"], {
    errorMap: () => ({ message: "Select the type of maintenance" }),
  }),
  description: z
    .string()
    .min(10, "Describe what was done (at least 10 characters)")
    .max(600, "Keep the description under 600 characters"),
  costAmount: z.coerce
    .number({ invalid_type_error: "Enter the cost" })
    .min(0, "Cost cannot be negative")
    .max(1_000_000_000, "That cost looks wrong"),
  costCurrency: currencyEnum,
  odometerKm: z.coerce
    .number({ invalid_type_error: "Enter the odometer reading" })
    .int("Whole kilometres only")
    .min(0, "Odometer cannot be negative")
    .max(3_000_000, "That odometer reading looks wrong"),
  vendor: z.string().max(120).optional().or(z.literal("")),
});
export type MaintenanceValues = z.infer<typeof maintenanceSchema>;

/* ------------------------------------------------- public site forms */

export const quoteStepOneSchema = z.object({
  originCity: z.string().min(2, "Select where the cargo is loading"),
  // Must stay in step with the corridor slugs in src/lib/content/corridors.ts.
  destinationCountry: z.enum(["rwanda", "kenya", "uganda", "drc", "burundi", "other"], {
    errorMap: () => ({ message: "Select the destination country" }),
  }),
  destinationCity: z.string().min(2, "Enter the delivery city or town"),
  service: z.string().min(2, "Select the service you need"),
});

export const quoteStepTwoSchema = z.object({
  cargoType: z.string().min(2, "Select the cargo type"),
  cargoDescription: z
    .string()
    .min(5, "Describe the cargo in a few words")
    .max(500, "Keep it under 500 characters"),
  weightKg: z.coerce
    .number({ invalid_type_error: "Enter the weight in kilograms" })
    .positive("Weight must be greater than zero")
    .max(200_000, "That weight looks wrong — contact us directly for project cargo"),
  unitCount: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .int()
    .min(0)
    .max(500)
    .optional(),
  readyDate: z.string().min(1, "When will the cargo be ready?"),
  needsCustoms: z.enum(["yes", "no", "unsure"]),
});

export const quoteStepThreeSchema = z.object({
  contactName: z.string().min(2, "Enter your name"),
  companyName: z.string().min(2, "Enter your company name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a phone number we can reach you on"),
  preferredContact: z.enum(["phone", "whatsapp", "email"]),
  notes: z.string().max(800, "Keep notes under 800 characters").optional().or(z.literal("")),
});

export const quoteSchema = quoteStepOneSchema
  .merge(quoteStepTwoSchema)
  .merge(quoteStepThreeSchema);
export type QuoteValues = z.infer<typeof quoteSchema>;

export const CONTACT_SUBJECTS = [
  "quote",
  "tracking",
  "customs",
  "warehousing",
  "careers",
  "other",
] as const;

/**
 * Contact form. Every string is sanitised before the length rules run, so a
 * message padded with zero-width characters cannot slip past the limits.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .transform(cleanLine)
    .pipe(z.string().min(2, "Enter your name").max(120, "That name is too long")),
  email: z
    .string()
    .transform(cleanEmail)
    .pipe(z.string().email("Enter a valid email address").max(254)),
  phone: z
    .string()
    .transform(cleanPhone)
    .pipe(z.string().max(40, "That phone number is too long"))
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .transform(cleanLine)
    .pipe(z.string().max(160, "That company name is too long"))
    .optional()
    .or(z.literal("")),
  subject: z.enum(CONTACT_SUBJECTS, {
    errorMap: () => ({ message: "Choose what this is about" }),
  }),
  message: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(10, "Tell us a little more (at least 10 characters)")
        .max(2000, "Keep the message under 2000 characters")
    ),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const expenseSchema = z.object({
  spentAt: z.string().min(1, "Select the date"),
  category: z.enum(["FUEL", "TOLLS", "BORDER_FEES", "FOOD_LODGING", "PARKING", "REPAIRS", "OTHER"], {
    errorMap: () => ({ message: "Select a category" }),
  }),
  description: z
    .string()
    .min(5, "Add a short description")
    .max(400, "Keep the description under 400 characters"),
  amount: z.coerce
    .number({ invalid_type_error: "Enter the amount" })
    .positive("Amount must be greater than zero")
    .max(1_000_000_000, "That amount looks wrong"),
  currency: currencyEnum,
  tripId: z.string().optional().or(z.literal("")),
});
export type ExpenseValues = z.infer<typeof expenseSchema>;
