import type { ContactValues, QuoteValues } from "@/lib/validations";

/**
 * Quote requests and contact messages captured by the public site.
 *
 * They are held in memory for the prototype — nothing is emailed and nothing
 * is persisted across a server restart. Wire this to the database (and to an
 * email/CRM provider) before launch; it is deliberately isolated so that is a
 * single-file change.
 */

type QuoteLead = QuoteValues & { id: string; reference: string; receivedAt: string };
type ContactLead = ContactValues & { id: string; reference: string; receivedAt: string };

const globalLeads = globalThis as unknown as {
  __boazLeads?: { quotes: QuoteLead[]; messages: ContactLead[] };
};

function store() {
  if (!globalLeads.__boazLeads) {
    globalLeads.__boazLeads = { quotes: [], messages: [] };
  }
  return globalLeads.__boazLeads;
}

function reference(prefix: string, count: number) {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function recordQuoteRequest(values: QuoteValues) {
  const lead: QuoteLead = {
    ...values,
    id: `qte_${Date.now().toString(36)}`,
    reference: reference("BGL-Q", store().quotes.length),
    receivedAt: new Date().toISOString(),
  };
  store().quotes.unshift(lead);
  console.info(`[quote] ${lead.reference} from ${lead.companyName} (${lead.email})`);
  return lead;
}

export async function recordContactMessage(values: ContactValues) {
  const lead: ContactLead = {
    ...values,
    id: `msg_${Date.now().toString(36)}`,
    reference: reference("BGL-M", store().messages.length),
    receivedAt: new Date().toISOString(),
  };
  store().messages.unshift(lead);
  console.info(`[contact] ${lead.reference} from ${lead.name} (${lead.email})`);
  return lead;
}

export async function listQuoteRequests() {
  return [...store().quotes];
}

export async function listContactMessages() {
  return [...store().messages];
}
