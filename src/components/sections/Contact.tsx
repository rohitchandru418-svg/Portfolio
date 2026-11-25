"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    const next: Record<string, string> = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email address.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");

    // Wired for Web3Forms: add NEXT_PUBLIC_WEB3FORMS_KEY to .env.local to enable.
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) {
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          name,
          email,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer id="contact" className="section flex flex-col gap-6">
      {/* CTA card */}
      <Reveal>
        <div className="rounded-[56px] border border-line bg-card px-3 pt-8 pb-3">
          <div className="mx-auto flex w-full max-w-[672px] flex-col items-center gap-8 rounded-[48px] bg-card-soft px-6 py-10 shadow-[0_10px_48px_0_rgba(0,0,0,0.15)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/figma/logo.svg" alt="" className="h-[55px] w-[55px]" />

            <div className="flex w-full max-w-[460px] flex-col items-center gap-9">
              <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="text-[32px] leading-[1.06] font-medium tracking-display sm:text-[40px] lg:text-[48px]">
                  Let&rsquo;s build
                  <br />
                  something people love.
                </h2>
                <p className="max-w-[400px] text-base text-muted">
                  If you&rsquo;re looking to elevate your brand or create
                  something meaningful, I&rsquo;d love to collaborate.
                </p>
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-center gap-3 rounded-[24px] bg-white p-6 text-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-live/15 text-live">
                    <Check size={20} />
                  </span>
                  <p className="font-medium">Message sent.</p>
                  <p className="text-sm text-muted">
                    Thanks — I&rsquo;ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="flex w-full flex-col gap-2.5"
                  noValidate
                >
                  <Field
                    name="name"
                    placeholder="Enter your name"
                    error={errors.name}
                  />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your e-mail"
                    error={errors.email}
                  />
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-dark mt-1 inline-flex h-10 items-center justify-center rounded-[10px] text-sm font-medium text-white disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : "Submit"}
                  </button>
                  {status === "error" ? (
                    <p role="alert" className="text-sm text-danger">
                      Something went wrong. Please email{" "}
                      <a className="underline" href={`mailto:${site.email}`}>
                        {site.email}
                      </a>{" "}
                      directly.
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Contact card */}
      <Reveal>
        <div className="flex flex-col gap-10 rounded-[32px] bg-card p-6 sm:gap-16 sm:rounded-[56px] sm:p-10 lg:px-10 lg:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <a
              href={`mailto:${site.email}`}
              className="min-w-0 text-[24px] leading-[1.125] font-medium tracking-[-0.02em] break-all sm:text-[32px]"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="shrink-0 text-[24px] leading-[1.125] font-medium tracking-[-0.02em] sm:text-right sm:text-[32px]"
            >
              {site.phone}
            </a>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-x-14 gap-y-8 lg:pr-20">
              <LinkGroup
                title="Links"
                items={[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                  { label: "Contact", href: "/#contact" },
                ]}
              />
              <LinkGroup
                title="Resource"
                items={[
                  { label: "Services", href: "/services" },
                  { label: "Works", href: "/works" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2 lg:items-end">
              <div className="flex items-center gap-2 text-sm">
                <a href="#" className="inline-block py-1 hover:underline">
                  Privacy Policy
                </a>
                <span className="h-1 w-1 rounded-full bg-faint" />
                <a href="#" className="inline-block py-1 hover:underline">
                  Terms of Service
                </a>
              </div>
              <p className="text-sm text-muted">
                © {new Date().getFullYear()} {site.name}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}

function Field({
  name,
  type = "text",
  placeholder,
  error,
}: {
  name: string;
  type?: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only" htmlFor={name}>
        {placeholder}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`rounded-[10px] border bg-white px-4 py-3 text-sm outline-none ${
          error ? "border-danger" : "border-line focus:border-ink"
        }`}
      />
      {error ? (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function LinkGroup({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="flex gap-6">
      <p className="text-sm text-muted">{title}</p>
      <ul className="flex flex-col gap-0.5">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="inline-block py-1 text-sm font-medium hover:underline"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}