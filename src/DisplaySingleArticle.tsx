import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { baseUrl } from "./App";
import { Article } from "./DisplayAllArticles";
import { useAuth } from "./AuthContext";

const DisplaySingleArticle = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const { apiKey, userName } = useAuth();
  const { articleId } = useParams();
  useEffect(() => {
    if (apiKey !== null) {
      fetchArticle(apiKey);
    } else {
      console.error("Please Log In");
    }
  }, []);

  function formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 10);
  }

  const fetchArticle = async (apiKey: string) => {
    try {
      const response: AxiosResponse<Article> = await axios.get(
        baseUrl + "/articles/" + `${articleId}`,
        {
          headers: {
            "X-API-KEY": apiKey,
          },
        }
      );

      if (response.status === 200) {
        setArticle(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching articles:", error.response.data);
    }
  };

  return (
    <div className="articlesWrapper">
      <div className="articlesBody">
        {article ? (
          <div key={articleId}>
            <h1>{article.title}</h1>
            <div className="date">{userName} | {formatDate(article.createdAt)}</div>
            <p>{article.content}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      <div className="commentsWrapper">
        <h2>Comments (#)</h2>
      </div>
      </div>
    </div>
  );
};
export default DisplaySingleArticle;
