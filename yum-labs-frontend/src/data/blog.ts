import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";

// Type definition for metadata extracted from MDX front matter
type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

// Recursively get all .mdx files from the directory and subdirectories
function getMDXFiles(dir: string): string[] {
  let results: string[] = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively get files from subdirectories
      results = results.concat(getMDXFiles(filePath));
    } else if (path.extname(file) === ".mdx") {
      // Only add .mdx files
      results.push(filePath);
    }
  });

  return results;
}

// Convert markdown content to HTML
export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

// Function to get a specific post using its slug (supports nested slugs)
export async function getPost(slug: string) {
  // Join the slug with the content directory to form the file path
  const filePath = path.join("content", `${slug}.mdx`); // slug can include subdirectories
  let source = fs.readFileSync(filePath, "utf-8");

  // Parse the front matter and content from the MDX file
  const { content: rawContent, data: metadata } = matter(source);

  // Convert Markdown content to HTML
  const content = await markdownToHTML(rawContent);

  return {
    source: content,
    metadata,
    slug,
  };
}

// Recursively get all posts and generate slugs with subdirectories
async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir); // Recursively gets all .mdx files, including from subdirectories

  return Promise.all(
    mdxFiles.map(async (file) => {
      // Generate the slug based on the relative path
      let relativePath = path.relative(dir, file);
      let slug = relativePath.replace(/\\/g, "/").replace(".mdx", ""); // Replace backslashes on Windows

      let { metadata, source } = await getPost(slug);
      return {
        metadata,
        slug, // Slug includes directories
        source,
      };
    })
  );
}

// Get all blog posts (recursively from subdirectories)
export async function getBlogPosts() {
  return getAllPosts(path.join(process.cwd(), "content"));
}

// Generate all blog post slugs (including subdirectories) for static generation
export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => {
    // Split the slug into an array of segments for nested routing
    return { slug: post.slug.split("/") };
  });
}

