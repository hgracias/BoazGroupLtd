import { FileText, ShieldAlert } from "lucide-react";

import { EmptyState, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { company } from "@/lib/company";
import { listDocuments } from "@/lib/data";
import { dateOnly, daysUntil, documentCategoryLabels } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Documents" };

function expiryState(expiresAt?: string) {
  if (!expiresAt) return { label: "No expiry", chip: "bg-white/[0.07] text-slate-300" };
  const days = daysUntil(expiresAt);
  if (days < 0) return { label: `Expired ${Math.abs(days)}d ago`, chip: "bg-red-500/15 text-red-300" };
  if (days <= 45) return { label: `Expires in ${days}d`, chip: "bg-amber-500/15 text-amber-200" };
  return { label: `Valid · ${days}d left`, chip: "bg-emerald-500/15 text-emerald-300" };
}

export default async function DocumentsPage() {
  const driver = await requireDriver();
  const documents = await listDocuments(driver.id);
  const expiringSoon = documents.filter(
    (doc) => doc.expiresAt && daysUntil(doc.expiresAt) <= 45
  );

  return (
    <div className="mx-auto max-w-[1200px] space-y-5">
      <PortalHeader
        title="Documents"
        description="Licences, certificates and vehicle papers operations holds for you."
      />

      {expiringSoon.length ? (
        <PortalSection className="border-amber-500/30 bg-amber-500/[0.07]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <p className="font-semibold text-amber-100">
                {expiringSoon.length} document{expiringSoon.length === 1 ? "" : "s"} need
                attention
              </p>
              <p className="mt-1 text-sm text-amber-200/80">
                Start renewals now — border posts turn back expired paperwork. Call the
                office on {company.phone} for help.
              </p>
            </div>
          </div>
        </PortalSection>
      ) : null}

      {documents.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {documents.map((document) => {
            const state = expiryState(document.expiresAt);

            return (
              <li key={document.id}>
                <PortalSection className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-blue-300">
                        <FileText className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground">{document.name}</p>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {documentCategoryLabels[document.category]}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${state.chip}`}
                    >
                      {state.label}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-2 text-sm">
                    {document.reference ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Reference</dt>
                        <dd className="font-semibold">{document.reference}</dd>
                      </div>
                    ) : null}
                    {document.issuedAt ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Issued</dt>
                        <dd className="font-semibold">{dateOnly(document.issuedAt)}</dd>
                      </div>
                    ) : null}
                    {document.expiresAt ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Expires</dt>
                        <dd className="font-semibold">{dateOnly(document.expiresAt)}</dd>
                      </div>
                    ) : null}
                  </dl>
                </PortalSection>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="No documents on file"
          description="Operations will upload your licence, medical and training certificates here."
        />
      )}

      <p className="text-xs text-muted-foreground">
        Document files are held by the operations desk — this list shows the record only.
        File upload arrives with the document-storage integration.
      </p>
    </div>
  );
}
