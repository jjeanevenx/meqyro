export type BlogArticle = {
  slug: string;
  relatedQuizSlug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  publishedAt: string;
  modifiedAt?: string;
  readingTimeMinutes: number;
  sections: { heading: string; paragraphs: string[] }[];
  keyTakeaways: string[];
  cta?: { title: string; description: string; label: string };
  sources?: { label: string; url: string }[];
};
