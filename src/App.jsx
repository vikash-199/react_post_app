import React, { useEffect, useState } from "react";
import "./App.css";
import Spinner from "./components/Spinner";

function App() {
  const [posts, setPosts] = useState([]);
  const [afterCursors, setAfterCursors] = useState([""]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const POSTS_PER_PAGE = 10;

  const fetchPage = async (pageIndex) => {
    setLoading(true);
    const cursor = afterCursors[pageIndex];
    try {
      const res = await fetch(
        `https://www.reddit.com/r/reactjs.json?limit=${POSTS_PER_PAGE}${
          cursor ? `&after=${cursor}` : ""
        }`
      );
      const data = await res.json();
      const children = data.data.children || [];

      setPosts(children);
      setCurrentPage(pageIndex);
      setHasNextPage(!!data.data.after);

      if (data.data.after && afterCursors.length === pageIndex + 1) {
        setAfterCursors((prev) => [...prev, data.data.after]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(0);
  }, []);

  const handleNext = () => {
    if (hasNextPage) fetchPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 0) fetchPage(currentPage - 1);
  };

  return (
    <div className="container">
      <h1>🔥 Top Posts from React.js</h1>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="card-grid">
            {posts.map((post) => {
              const { title, selftext_html, url, score } = post.data;
              return (
                <div className="card" key={post.data.id}>
                  <h2>{title}</h2>
                  {selftext_html && (
                    <div
                      className="selftext"
                      dangerouslySetInnerHTML={{ __html: selftext_html }}
                    />
                  )}
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    🌐 Visit Post
                  </a>
                  <div className="score">👍 {score} points</div>
                </div>
              );
            })}
          </div>

          <div className="pagination simple">
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              ⬅️ Previous
            </button>
            <span>
              Page {currentPage + 1} of {afterCursors.length}
            </span>
            <button onClick={handleNext} disabled={!hasNextPage}>
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
