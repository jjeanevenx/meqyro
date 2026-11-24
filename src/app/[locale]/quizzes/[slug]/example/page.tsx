import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { reportExampleCopy } from "@/lib/i18n/dictionaries";
import { buildExampleReport } from "@/features/results/example-report";

export const metadata = { robots: { index: false, follow: false } };

export default async function ReportExamplePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || (slug !== "moneydna" && slug !== "coupledna")) notFound();
  const copy = reportExampleCopy[locale];
  const report = buildExampleReport(slug, locale);
  return (
    <main className="quiz-landing-container">
      <article className="quiz-landing-card report-example">
        <h1>
          {copy.title} · {slug === "moneydna" ? "MoneyDNA" : "CoupleDNA"}
        </h1>
        <p className="assessment-offer">{copy.note}</p>
        <p>{report.executiveSummary}</p>
        {report.sections.map((section) => (
          <section key={section.id} aria-labelledby={section.id}>
            <h2 id={section.id}>{section.title}</h2>
            <p>{section.summary}</p>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <ul>
              {section.keyTakeaways.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>{copy.action}</h3>
            <ul>
              {section.actionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
        <p>{report.comparativeBenchmark.description}</p>
        <Link className="button button--primary" href={`/${locale}/quizzes/${slug}`}>
          {slug === "moneydna" ? "MoneyDNA" : "CoupleDNA"}
        </Link>
      </article>
    </main>
  );
}
