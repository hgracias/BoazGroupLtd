import { AlertTriangle } from "lucide-react";

import { MarkAllReadButton, MarkReadButton } from "@/components/driver/message-actions";
import { EmptyState, PortalHeader, PortalSection } from "@/components/driver/portal-ui";
import { listMessages } from "@/lib/data";
import { dateTime } from "@/lib/format";
import { requireDriver } from "@/lib/session";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  const driver = await requireDriver();
  const messages = await listMessages(driver.id);
  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <PortalHeader
        title="Messages"
        description={
          unread > 0
            ? `${unread} unread message${unread === 1 ? "" : "s"} from the operations desk.`
            : "Everything from the operations desk has been read."
        }
        action={<MarkAllReadButton disabled={unread === 0} />}
      />

      {messages.length ? (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li key={message.id}>
              <PortalSection
                className={
                  message.read ? "opacity-80" : "border-blue-500/40 bg-blue-500/[0.06]"
                }
              >
                <article aria-label={message.subject}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-foreground">{message.subject}</h2>
                        {!message.read ? (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            Unread
                          </span>
                        ) : null}
                        {message.priority === "HIGH" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                            High priority
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {message.from} · {message.fromRole} · {dateTime(message.sentAt)}
                      </p>
                    </div>
                    {!message.read ? <MarkReadButton messageId={message.id} /> : null}
                  </div>

                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200">
                    {message.body}
                  </p>
                </article>
              </PortalSection>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No messages"
          description="Dispatch notes and operational updates will appear here."
        />
      )}
    </div>
  );
}
