"use client";

import { m } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { easeOutExpo } from "@/lib/motion";

type Statement = {
  key: string;
  icon: IconName;
  title: string;
  text: string;
};

type Value = {
  key: string;
  icon: IconName;
  label: string;
};

type PurposeMotionProps = {
  eyebrow: string;
  statements: Statement[];
  valuesTitle: string;
  values: Value[];
};

const statementVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.86, ease: easeOutExpo, delay: index * 0.15 },
  }),
};

const statementIconVariants = {
  hidden: { opacity: 0.65, scale: 0.88 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.62, ease: easeOutExpo, delay: index * 0.15 + 0.14 },
  }),
};

const valuesSectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};

const valuesHeadingVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutExpo } },
};

const valuesListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.085 } },
};

const valueVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: easeOutExpo } },
};

/** Client-only motion layer for the server-translated Purpose section. */
export function PurposeMotion({ eyebrow, statements, valuesTitle, values }: PurposeMotionProps) {
  return (
    <section
      aria-labelledby="purpose-title"
      className="on-dark section-space relative isolate overflow-hidden bg-atlas-navy text-on-dark"
    >
      <div aria-hidden="true" className="caustics absolute -inset-[10%] -z-10 mix-blend-screen" />
      <div className="container-page grid gap-12 md:gap-16">
        <h2 id="purpose-title" className="eyebrow text-atlas-mist">
          {eyebrow}
        </h2>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {statements.map((statement, index) => (
            <m.div
              key={statement.key}
              data-purpose-card={statement.key}
              custom={index}
              variants={statementVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35, margin: "0px 0px -8% 0px" }}
              className="purpose-card glass-on-dark grid content-start gap-5 rounded-panel p-7 md:p-10"
            >
              <h3 className="flex items-center gap-3 text-xl font-semibold">
                <m.span
                  custom={index}
                  variants={statementIconVariants}
                  className="purpose-icon inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-atlas-mist"
                >
                  <Icon name={statement.icon} />
                </m.span>
                {statement.title}
              </h3>
              <p className="font-display-latin max-w-[30ch] text-[clamp(1.5rem,2.3vw,2rem)] font-semibold leading-[1.15] [:lang(ar)_&]:leading-[1.5] [:lang(ckb)_&]:leading-[1.5]">
                {statement.text}
              </p>
            </m.div>
          ))}
        </div>

        <m.div
          data-purpose-values
          variants={valuesSectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25, margin: "0px 0px -6% 0px" }}
          className="grid gap-5 pt-4"
        >
          <m.h3 variants={valuesHeadingVariants} className="eyebrow text-atlas-mist">
            {valuesTitle}
          </m.h3>
          <m.ul variants={valuesListVariants} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <m.li
                key={value.key}
                data-purpose-value={value.key}
                variants={valueVariants}
                className="purpose-value glass-on-dark flex items-center gap-3 rounded-card px-5 py-4 text-lg"
              >
                <Icon name={value.icon} className="purpose-value-icon text-atlas-mist" />
                {value.label}
              </m.li>
            ))}
          </m.ul>
        </m.div>
      </div>
    </section>
  );
}
