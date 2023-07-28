import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { baseUrl } from "./App";

export interface Article {
  articleId: string;
  title: string;
  perex: string;
  content: string;
  createdAt: string;
  lastUpdatedAt: string;
  imageId: string;
}

const DisplayAllArticles = ({ authKey }: { authKey: string | null }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { apiKey, userName } = useAuth();

  useEffect(() => {
    if (apiKey !== null) {
      fetchArticles(apiKey);
    } else {
      console.error("Please Log In");
    }
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
        console.log(response.data.items);
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
              <div className="imageArticleWrap" key={article.articleId}>
                {/*<img src={`${baseUrl}/images/${article.imageId}`} alt="" />*/}
              <div className="articleBody" key={article.articleId}>
                <h2>{article.title}</h2>
                <div className="date">{ userName} | {formatDate(article.createdAt)}</div>
                <p>{article.perex}</p>
                <div className="bottomArticleBody">
                  <Link to={`/${article.articleId}`}>Read whole article</Link>
                  <p># Comments</p>
                  </div>
                </div>
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
