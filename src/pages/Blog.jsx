import { MoveRight } from "lucide-react";

const Blog = ({ posts, onReadMore }) => {
  return (
    <div className="blog">
      <h2>My Developer Blog</h2>

      <div className="space-y-8">
        {posts.map((post) => (
          <div key={post.id} className="blog-post">
            <div className="col-span-2">
              <img src={post.image} alt={post.title} />
            </div>

            <div className="content">
              <p>{post.date}</p>
              <h3>{post.title}</h3>
              <p className="description">
                  {post.description}
              </p>
              <button
                className="read-more"
                onClick={() => onReadMore(post)}
              >
                Read More
                <MoveRight className="icon-hover" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;