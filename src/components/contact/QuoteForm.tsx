"use client";

import { useId, useRef, useState, type FormEvent } from "react";

type Option = { value: string; label: string; lang?: string };
type Branch = Option & { whatsapp: string };
type Governorate = Option & { branch: string };

export type QuoteFormLabels = {
  legend: { you: string; request: string };
  name: string;
  company: string;
  phone: string;
  phoneHint: string;
  whatsappSame: string;
  email: string;
  governorate: string;
  branch: string;
  branchHint: string;
  brand: string;
  category: string;
  product: string;
  productHint: string;
  quantity: string;
  quantityHint: string;
  project: string;
  notes: string;
  attachments: string;
  optional: string;
  choose: string;
  notSure: string;
  consent: string;
  privacy: string;
  sendWhatsapp: string;
  sendEmail: string;
  errorsTitle: string;
  errors: { name: string; phone: string; email: string; governorate: string; branch: string; request: string; consent: string };
  doneTitle: string;
  doneWhatsapp: string;
  doneEmail: string;
  again: string;
  message: { title: string; whatsappYes: string; source: string };
};

type QuoteFormProps = {
  labels: QuoteFormLabels;
  brands: Option[];
  categories: Option[];
  governorates: Governorate[];
  /** Branches whose WhatsApp receives requests (numbers as digits, international format). */
  branches: Branch[];
  email: string;
};

type Field = "name" | "phone" | "email" | "governorate" | "branch" | "request" | "consent";
type Via = "whatsapp" | "email";

const field =
  "min-h-12 w-full rounded-input border border-rule-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-steel/80 aria-[invalid=true]:border-[#b42318] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-[#b42318]";
const labelText = "text-[0.9375rem] font-medium text-ink";
const hintText = "text-sm text-steel";
const errorText = "text-sm font-medium text-[#b42318]";

/**
 * Request for quotation. Nothing is stored or sent by this website: the visitor's own
 * WhatsApp or email app opens with the request written out, addressed to AtlasPlast, and
 * they press send there (where they can also attach a BOQ, drawing or product list).
 * There is no server endpoint, so there is nothing to spam and no lead database to secure.
 */
export function QuoteForm({ labels: l, brands, categories, governorates, branches, email }: QuoteFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [done, setDone] = useState<Via | null>(null);
  // The branch follows the governorate (its nearest branch) until the visitor picks one themselves.
  const [branch, setBranch] = useState("");
  const [branchPicked, setBranchPicked] = useState(false);

  const fid = (name: string) => `${id}-${name}`;

  function validate(data: FormData) {
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const next: Partial<Record<Field, string>> = {};
    if (value("name").length < 2) next.name = l.errors.name;
    // At least 7 digits; spaces, dashes, brackets and a leading + are fine.
    const phone = value("phone");
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone) || phone.replace(/\D/g, "").length < 7) next.phone = l.errors.phone;
    const mail = value("email");
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) next.email = l.errors.email;
    if (!value("governorate")) next.governorate = l.errors.governorate;
    if (!branches.some((b) => b.value === value("branch"))) next.branch = l.errors.branch;
    if (!value("brand") && !value("category") && !value("product")) next.request = l.errors.request;
    if (!data.get("consent")) next.consent = l.errors.consent;
    return next;
  }

  function compose(data: FormData) {
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const pick = (options: Option[], k: string) => options.find((o) => o.value === value(k))?.label ?? "";
    const rows: [string, string][] = [
      [l.name, value("name")],
      [l.company, value("company")],
      [l.phone, value("phone") + (data.get("whatsappSame") ? ` (${l.message.whatsappYes})` : "")],
      [l.email, value("email")],
      [l.governorate, pick(governorates, "governorate")],
      [l.branch, pick(branches, "branch")],
      [l.brand, value("brand") === "unsure" ? l.notSure : pick(brands, "brand")],
      [l.category, pick(categories, "category")],
      [l.product, value("product")],
      [l.quantity, value("quantity")],
      [l.project, value("project")],
      [l.notes, value("notes")],
    ];
    return [l.message.title, "", ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", l.message.source].join("\n");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const via: Via = submitter?.value === "email" ? "email" : "whatsapp";
    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const text = compose(data);
    if (via === "whatsapp") {
      const to = branches.find((b) => b.value === String(data.get("branch")))!.whatsapp;
      const href = `https://wa.me/${to}?text=${encodeURIComponent(text)}`;
      // A new tab keeps the filled form; if the browser blocks it, go there directly.
      // ("noopener" in the features would make open() return null even on success.)
      const tab = window.open(href, "_blank");
      if (tab) tab.opener = null;
      else window.location.href = href;
    } else {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(l.message.title)}&body=${encodeURIComponent(text)}`;
    }
    setDone(via);
    requestAnimationFrame(() => doneRef.current?.focus());
  }

  const errorList = Object.entries(errors) as [Field, string][];
  const describedBy = (name: Field, hint?: boolean) =>
    [hint ? fid(`${name}-hint`) : "", errors[name] ? fid(`${name}-error`) : ""].filter(Boolean).join(" ") || undefined;
  const firstField: Record<Field, string> = {
    name: "name",
    phone: "phone",
    email: "email",
    governorate: "governorate",
    branch: "branch",
    request: "brand",
    consent: "consent",
  };

  if (done) {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        role="status"
        className="grid gap-4 rounded-card bg-surface p-6 shadow-[0_1px_2px_rgb(20_40_74/0.06)] md:p-10"
      >
        <h2 className="section-title">{l.doneTitle}</h2>
        <p className="max-w-[60ch] text-lg text-steel">{done === "whatsapp" ? l.doneWhatsapp : l.doneEmail}</p>
        <div>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="pressable inline-flex min-h-12 items-center rounded-full bg-ink/6 px-6 font-medium text-ink hover:bg-ink/10"
          >
            {l.again}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-8" aria-describedby={fid("privacy")}>
      {errorList.length ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="grid gap-2 rounded-card border border-[#b42318]/40 bg-[#fef3f2] p-5 text-ink"
        >
          <p className="font-semibold">{l.errorsTitle}</p>
          <ul className="grid list-disc gap-1 ps-5">
            {errorList.map(([name, message]) => (
              <li key={name}>
                <a href={`#${fid(firstField[name])}`} className="underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <fieldset className="grid gap-5 rounded-card bg-surface p-6 md:grid-cols-2 md:p-8">
        <legend className="float-start mb-1 w-full text-xl font-semibold text-ink md:col-span-2">{l.legend.you}</legend>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("name")} className={labelText}>
            {l.name}
          </label>
          <input id={fid("name")} name="name" required autoComplete="name" maxLength={100} className={field}
            aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />
          {errors.name ? <p id={fid("name-error")} className={errorText}>{errors.name}</p> : null}
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("company")} className={labelText}>
            {l.company} <span className="font-normal text-steel">{l.optional}</span>
          </label>
          <input id={fid("company")} name="company" autoComplete="organization" maxLength={120} className={field} />
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("phone")} className={labelText}>
            {l.phone}
          </label>
          <input id={fid("phone")} name="phone" type="tel" required inputMode="tel" autoComplete="tel" maxLength={20} dir="ltr"
            className={`${field} text-start`} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone", true)} />
          <p id={fid("phone-hint")} className={hintText}>{l.phoneHint}</p>
          {errors.phone ? <p id={fid("phone-error")} className={errorText}>{errors.phone}</p> : null}
          <label className="mt-1 inline-flex min-h-11 items-center gap-3 text-[0.9375rem] text-ink">
            <input type="checkbox" name="whatsappSame" defaultChecked className="size-5 accent-atlas-blue" />
            {l.whatsappSame}
          </label>
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("email")} className={labelText}>
            {l.email} <span className="font-normal text-steel">{l.optional}</span>
          </label>
          <input id={fid("email")} name="email" type="email" autoComplete="email" maxLength={120} dir="ltr"
            className={`${field} text-start`} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />
          {errors.email ? <p id={fid("email-error")} className={errorText}>{errors.email}</p> : null}
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("governorate")} className={labelText}>
            {l.governorate}
          </label>
          <select id={fid("governorate")} name="governorate" required defaultValue="" className={field}
            aria-invalid={Boolean(errors.governorate)} aria-describedby={describedBy("governorate")}
            onChange={(e) => {
              const nearest = governorates.find((g) => g.value === e.target.value)?.branch;
              if (nearest && !branchPicked) setBranch(nearest);
            }}>
            <option value="" disabled>
              {l.choose}
            </option>
            {governorates.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.governorate ? <p id={fid("governorate-error")} className={errorText}>{errors.governorate}</p> : null}
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("branch")} className={labelText}>
            {l.branch}
          </label>
          <select id={fid("branch")} name="branch" required value={branch} className={field}
            onChange={(e) => {
              setBranch(e.target.value);
              setBranchPicked(true);
            }}
            aria-invalid={Boolean(errors.branch)} aria-describedby={describedBy("branch", true)}>
            <option value="" disabled>
              {l.choose}
            </option>
            {branches.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <p id={fid("branch-hint")} className={hintText}>{l.branchHint}</p>
          {errors.branch ? <p id={fid("branch-error")} className={errorText}>{errors.branch}</p> : null}
        </div>
      </fieldset>

      <fieldset className="grid gap-5 rounded-card bg-surface p-6 md:grid-cols-2 md:p-8" aria-describedby={describedBy("request")}>
        <legend className="float-start mb-1 w-full text-xl font-semibold text-ink md:col-span-2">{l.legend.request}</legend>
        {errors.request ? (
          <p id={fid("request-error")} className={`${errorText} md:col-span-2`}>
            {errors.request}
          </p>
        ) : null}
        <div className="grid content-start gap-2">
          <label htmlFor={fid("brand")} className={labelText}>
            {l.brand}
          </label>
          <select id={fid("brand")} name="brand" defaultValue="" className={field} aria-invalid={Boolean(errors.request)}>
            <option value="">{l.choose}</option>
            <option value="unsure">{l.notSure}</option>
            {brands.map((b) => (
              <option key={b.value} value={b.value} lang={b.lang}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("category")} className={labelText}>
            {l.category}
          </label>
          <select id={fid("category")} name="category" defaultValue="" className={field} aria-invalid={Boolean(errors.request)}>
            <option value="">{l.choose}</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid content-start gap-2 md:col-span-2">
          <label htmlFor={fid("product")} className={labelText}>
            {l.product}
          </label>
          <input id={fid("product")} name="product" maxLength={200} className={field} aria-describedby={fid("product-hint")} />
          <p id={fid("product-hint")} className={hintText}>{l.productHint}</p>
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("quantity")} className={labelText}>
            {l.quantity} <span className="font-normal text-steel">{l.optional}</span>
          </label>
          <input id={fid("quantity")} name="quantity" maxLength={120} className={field} aria-describedby={fid("quantity-hint")} />
          <p id={fid("quantity-hint")} className={hintText}>{l.quantityHint}</p>
        </div>
        <div className="grid content-start gap-2">
          <label htmlFor={fid("project")} className={labelText}>
            {l.project} <span className="font-normal text-steel">{l.optional}</span>
          </label>
          <input id={fid("project")} name="project" maxLength={160} className={field} />
        </div>
        <div className="grid content-start gap-2 md:col-span-2">
          <label htmlFor={fid("notes")} className={labelText}>
            {l.notes} <span className="font-normal text-steel">{l.optional}</span>
          </label>
          <textarea id={fid("notes")} name="notes" rows={5} maxLength={1200} className={`${field} resize-y`} />
          <p className={hintText}>{l.attachments}</p>
        </div>
      </fieldset>

      <div className="grid gap-5">
        <div className="grid gap-2">
          <label className="inline-flex items-start gap-3 text-[0.9375rem] text-ink">
            <input id={fid("consent")} type="checkbox" name="consent" required className="mt-0.5 size-5 shrink-0 accent-atlas-blue"
              aria-invalid={Boolean(errors.consent)} aria-describedby={describedBy("consent")} />
            <span>{l.consent}</span>
          </label>
          {errors.consent ? <p id={fid("consent-error")} className={errorText}>{errors.consent}</p> : null}
        </div>
        <p id={fid("privacy")} className={`${hintText} max-w-[70ch]`}>
          {l.privacy}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="via"
            value="whatsapp"
            className="pressable inline-flex min-h-12 items-center rounded-full bg-atlas-blue px-6 text-[0.9375rem] font-medium text-white hover:bg-atlas-navy"
          >
            {l.sendWhatsapp}
          </button>
          <button
            type="submit"
            name="via"
            value="email"
            className="pressable inline-flex min-h-12 items-center rounded-full bg-ink/6 px-6 text-[0.9375rem] font-medium text-ink hover:bg-ink/10"
          >
            {l.sendEmail}
          </button>
        </div>
      </div>
    </form>
  );
}
