import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { baseUrl, apiKey } from "./App";
import { Article } from "./DisplayAllArticles";

const DisplaySingleArticle = () => {
  const [article, setArticle] = useState<Article | null>(null);
  const { articleId } = useParams();
  useEffect(() => {
    fetchArticle(apiKey);
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
        console.log(response.data);
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
            <h2>{article.title}</h2>
            <div className="date">{formatDate(article.createdAt)}</div>
            <p>{article.content}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
export default DisplaySingleArticle;
