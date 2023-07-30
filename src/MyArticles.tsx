import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { baseUrl } from "./App";
import deleteArticle from "./DeleteArticle";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

interface Article {
  articleId: string;
  title: string;
  perex: string;
  author: string;
}
const MyArticles = ({ authKey }: { authKey: string | null }) => {
  const { userName, apiKey } = useAuth();
  useEffect(() => {
    if (apiKey !== null) {
      fetchArticles(apiKey);
    } else {
      console.error("Please Log In");
    }
  }, [authKey]);
  const [articles, setArticles] = useState<Article[]>([]);
  const fetchArticles = async (apiKey: string) => {
    try {
      const response: AxiosResponse<{ items: Article[] }> = await axios.get(
        baseUrl + "/articles",
        {
          headers: {
            "X-API-KEY": apiKey,
          },
        }
      );

      if (response.status === 200) {
        setArticles(response.data.items);
      }
    } catch (error: any) {
      console.error("Error fetching articles:", error.response.data);
    }
  };

  const handleDelete = async (articleId: string) => {
    try {
      if (authKey !== null && apiKey !== null) {
        await deleteArticle(articleId, baseUrl, apiKey, authKey);
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.articleId !== articleId)
        );
      } else {
        console.error(
          "Authentication key not available. Cannot delete the article."
        );
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };
  return (
    <div className="articlesWrapper">
      {authKey ? (
        <div className="articlesBody">
          <div className="myArticleWrap">
            <h1>My Articles</h1>
            <div className="smallButton">
              <Link to="/cat-blog/create">Create Article</Link>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Article title</th>
                <th>Perex</th>
                <th>Author</th>
                <th># of comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map((article) => (
                  <tr key={article.articleId}>
                    <td>
                      <Link to={`/cat-blog/article/${article.articleId}`}>
                        {article.title.substring(0, 30) + "..."}
                      </Link>
                    </td>
                    <td>{article.perex.substring(0, 50) + "..."}</td>
                    <td>{userName}</td>
                    <td>#</td>{" "}
                    <td id="actions">
                      <button type="button" id="action">
                        <img src={require("./edit.png")} alt="Edit" />
                      </button>
                      <button
                        type="button"
                        id="action"
                        onClick={() => {
                          handleDelete(article.articleId);
                        }}
                      >
                        <img src={require("./trash.png")} alt="Delete" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No articles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Please Log In</p>
      )}
    </div>
  );
};
export default MyArticles;
