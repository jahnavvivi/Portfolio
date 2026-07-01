import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogPost = ({ post, onBack }) => {
    const [markdown, setMarkdown] = useState("");
    const markdownFiles = import.meta.glob(
        "../content/*.md",
        {
            query: "?raw",
            import: "default",
        }
    );

    useEffect(() => {
        const loadMarkdown = async () => {
        const loader =
            markdownFiles[`../content/${post.slug}.md`];
            if (!loader) {
                setMarkdown("# Article not found");
                return;
            }
            const content = await loader();
            setMarkdown(content);
        };
        loadMarkdown();
    }, [post]);

  return (
    <div className="blog-page">
      <img
        src={post.image}
        alt={post.title}
        className="hero-image"
      />
      <p className="date">{post.date}</p>
      <h1>{post.title}</h1>
      <div className="article">
        <ReactMarkdown remarkPlugins={[remarkGfm]} >
            {markdown}
        </ReactMarkdown>
      </div>

    </div>
  );
};

export default BlogPost;