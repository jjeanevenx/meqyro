import QuizLandingPage, { generateMetadata as baseGenerateMetadata } from "../[slug]/page";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return baseGenerateMetadata({ params: Promise.resolve({ locale, slug: "brainrank" }) });
}

export default async function BrainRankShell({ params }: Props) {
  const { locale } = await params;
  return QuizLandingPage({ params: Promise.resolve({ locale, slug: "brainrank" }) });
}
