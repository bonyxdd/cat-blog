import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { baseUrl, apiKey } from "./App";
import { Article } from "./DisplayAllArticles";
import deleteArticle from "./DeleteArticle";

const DisplaySingleArticle = ({ authKey }: { authKey: string | null }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const { articleId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchArticle(apiKey, authKey);
  }, [authKey]);

  function formatDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 10);
  }

  const fetchArticle = async (apiKey: string, authKey: string | null) => {
    try {
      const response: AxiosResponse<Article> = await axios.get(
        baseUrl + "/articles/" + `${articleId}`,
        {
          headers: {
            "X-API-KEY": apiKey,
            Authorization: authKey,
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

  const handleDelete = async () => {
    if (authKey && article) {
      try {
        await deleteArticle(article.articleId, baseUrl, apiKey, authKey);
        navigate("/");
      } catch (error) {
        console.error("Error deleting article:", error);
      }
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
            {authKey ? (
              <button onClick={handleDelete}>Delete Article</button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
export default DisplaySingleArticle;
