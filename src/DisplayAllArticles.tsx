import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { baseUrl, apiKey } from "./App";

export interface Article {
  articleId: string;
  title: string;
  perex: string;
  content: string;
  createdAt: string;
  lastUpdatedAt: string;
}

const DisplayAllArticles = ({ authKey }: { authKey: string | null }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticles(apiKey);
  }, [authKey]);

  function formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 10);
  }

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
        response.data.items.sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return bDate - aDate;
        });
        setArticles(response.data.items);
      }
    } catch (error: any) {
      console.error("Error fetching articles:", error.response.data);
    }
  };

  return (
    <div className="articlesWrapper">
      {authKey ? (
        <div className="articlesBody">
          <h1>Recent Articles</h1>
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article.articleId}>
                <h2>{article.title}</h2>
                <div className="date">{formatDate(article.createdAt)}</div>
                <p>{article.perex}</p>
                <p>
                  <Link to={`/${article.articleId}`}>Read more...</Link>
                </p>
              </div>
            ))
          ) : (
            <p>No articles available.</p>
          )}
        </div>
      ) : (
        <p>Please Log In</p>
      )}
    </div>
  );
};
export default DisplayAllArticles;
