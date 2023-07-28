import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "./App";
import { useAuth } from "./AuthContext";

const createArticle = async (
  title: string,
  perex: string,
  content: string,
  baseUrl: string,
  apiKey: string,
  authKey: string | null
) => {
  try {
    await axios.post(
      baseUrl + "/articles",
      {
        title,
        perex,
        content,
      },
      {
        headers: {
          "X-API-KEY": apiKey,
          Authorization: authKey,
        },
      }
    );
  } catch (error: any) {
    console.error("Error:", error.response.data);
  }
};
const ArticleCreationForm = ({ authKey }: { authKey: string | null }) => {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    title: "",
    perex: "",
    content: "",
  });
  const [isArticleCreated, setIsArticleCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { title, perex, content } = formValues;

    if (!authKey) {
      setErrorMessage("Please Log In");
      setIsArticleCreated(false);
    } else if (!title || !perex || !content) {
      setErrorMessage("Please fill in all the fields");
      setIsArticleCreated(false);
    } else if (apiKey !== null) {
      try {
        await createArticle(title, perex, content, baseUrl, apiKey, authKey);
        setIsArticleCreated(true);
        setFormValues({ title: "", perex: "", content: "" });
        setErrorMessage("");
        navigate("/");
      } catch (error) {
        setIsArticleCreated(false);
        setErrorMessage("Article was not created");
      }
    } else {
      console.error("Please Log In");
    }
  };

  return (
    <div className="formWrapper">
      <div className="articlesBody">
        <form id="createArticle" onSubmit={handleSubmit}>
        <div className="createWrap">
          <h1>Create new article</h1>
          <button className="smallButton" type="submit">
            Publish Article
          </button>
        </div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="My First Article"
            value={formValues.title}
            onChange={handleChange}
          />
          <label htmlFor="perex">Perex</label>
          <textarea
            name="perex"
            id="perex"
            placeholder="Your Catchy Description"
            value={formValues.perex}
            onChange={handleChange}
            cols={30}
            rows={4}
          />
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            placeholder="Article Content"
            value={formValues.content}
            onChange={handleChange}
            cols={30}
            rows={20}
          />
          {isArticleCreated && <p>Article Created</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ArticleCreationForm;
