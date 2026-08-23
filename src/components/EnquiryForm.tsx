import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Fields = {
  name: string;
  company: string;
  email: string;
  companySize: string;
  systems: string;
  manual: string;
};

const empty: Fields = {
  name: "",
  company: "",
  email: "",
  companySize: "",
  systems: "",
  manual: "",
};

const sizes = ["1-9", "10-24", "25-49", "50-149", "150+"];

const fieldClass =
  "w-full border border-rule-dark bg-ink px-3 py-3 text-[16px] text-paper placeholder:text-muted-ink focus:border-hivis";

export function EnquiryForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [trap, setTrap] = useState("");

  const set = (key: keyof Fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.company.trim()) next.company = "Please tell us your company.";
    if (!values.email.trim()) next.email = "Please add a work email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "That does not look like a valid email address.";
    if (!values.companySize) next.companySize = "Please choose a company size.";
    if (!values.manual.trim()) next.manual = "Tell us one thing your team still does manually.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (trap) return; // honeypot filled, silently drop
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await supabase.from("enquiries").insert({
      name: values.name.trim(),
      company: values.company.trim(),
      email: values.email.trim(),
      company_size: values.companySize,
      systems: values.systems.trim() || null,
      manual_work: values.manual.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      setFormError("Something went wrong sending that. Please email hello@quietcrew.co.uk instead.");
      return;
    }
    setValues(empty);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-hivis bg-ink p-8" role="status" aria-live="polite">
        <p className="mono-label text-hivis">Enquiry received</p>
        <h3 className="mt-3 text-2xl text-paper">
          Thanks. We&rsquo;ll come back to you within one working day.
        </h3>
        <p className="mt-3 text-[16px] text-muted-ink">
          If it is easier, you can also pick a time directly using the booking option below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-rule-dark p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <input id="name" name="name" className={fieldClass} value={values.name} onChange={set("name")} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
        </Field>
        <Field id="company" label="Company" error={errors.company}>
          <input id="company" name="company" className={fieldClass} value={values.company} onChange={set("company")} autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={errors.company ? "company-error" : undefined} />
        </Field>
        <Field id="email" label="Work email" error={errors.email}>
          <input id="email" name="email" type="email" className={fieldClass} value={values.email} onChange={set("email")} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        </Field>
        <Field id="companySize" label="Company size" error={errors.companySize}>
          <select id="companySize" name="companySize" className={fieldClass} value={values.companySize} onChange={set("companySize")} aria-invalid={!!errors.companySize} aria-describedby={errors.companySize ? "companySize-error" : undefined}>
            <option value="">Please choose</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s} people
              </option>
            ))}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field id="systems" label="Which systems do you use?" error={errors.systems}>
            <input id="systems" name="systems" className={fieldClass} value={values.systems} onChange={set("systems")} placeholder="For example: Salesforce, Xero, Monday, Outlook" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field id="manual" label="What does your team still do manually?" error={errors.manual}>
            <textarea id="manual" name="manual" rows={4} className={fieldClass} value={values.manual} onChange={set("manual")} aria-invalid={!!errors.manual} aria-describedby={errors.manual ? "manual-error" : undefined} />
          </Field>
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
      </div>

      {formError && (
        <p className="mt-5 border-l-2 border-hivis pl-3 text-[15px] text-hivis" role="alert">
          {formError}
        </p>
      )}

      <button type="submit" className="btn-hivis mt-7 w-full md:w-auto" disabled={submitting}>
        {submitting ? "Sending" : "Book a free Workflow Review"}
      </button>
      <p className="mt-4 text-[15px] text-muted-ink">
        We use your details only to reply to this enquiry. See our{" "}
        <a href="/privacy" className="text-hivis underline underline-offset-4">
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mono-label mb-2 block text-muted-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mono-label mt-2 text-hivis">
          {error}
        </p>
      )}
    </div>
  );
}
