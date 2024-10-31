import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Generate all blog post slugs for static generation (handling nested slugs)
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug.split("/") })); // Split slugs into an array of segments
}

// Generate metadata for each post, including OpenGraph data
export async function generateMetadata({
  params,
}: {
  params: {
    slug: string[];
  };
}): Promise<Metadata | "Blog"> {
  const slug = params.slug.join("/"); // Join the slug array into a single path
  let post = await getPost(slug);

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Main Blog component for displaying the post content
export default async function Blog({
  params,
}: {
  params: {
    slug: string[];
  };
}) {
  const slug = params.slug.join("/"); // Join slug segments to form the full path
  let post = await getPost(slug);

  if (!post) {
    notFound(); // Return 404 if post is not found
  }

  return (
    <section id="blog" className="min-h-screen flex items-start justify-center"> {/* Ensure full height and centering */}
      <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 mx-auto"> {/* Ensure max width and horizontal centering */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image
                ? `${DATA.url}${post.metadata.image}`
                : `${DATA.url}/og?title=${post.metadata.title}`,
              url: `${DATA.url}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: DATA.site_title,
              },
            }),
          }}
        />
        <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px] mx-auto text-center">
          {post.metadata.title}
        </h1>
        <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px] mx-auto text-center">
          <Suspense fallback={<p className="h-5" />}>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </Suspense>
        </div>
        <article
          className="prose dark:prose-invert max-w-[650px] mx-auto"
          dangerouslySetInnerHTML={{ __html: post.source }}
        ></article>
      </div>
    </section>
  );
}

