import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "./App";
import { useAuth } from "./AuthContext";
import ReactMarkdown from '@uiw/react-md-editor';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const createArticle = async (
  title: string,
  perex: string,
  content: string,
  baseUrl: string,
  apiKey: string,
  authKey: string | null,
  imageId: string
) => {
  try {
    const requestData = {
      title,
      perex,
      content,
      imageId,
    };
    const response = await axios.post(
      baseUrl + "/articles", requestData,
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

const uploadImage = async (imageFile: File, apiKey: string, authKey:string) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(baseUrl + "/images",
      formData, {
      headers: {
          "X-API-KEY": apiKey,
          Authorization: authKey,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading image:", error.response.data)
    throw error;
  }
}
const ArticleCreationForm = ({ authKey }: { authKey: string | null }) => {
  const { apiKey } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
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
    const { title, perex } = formValues;
    const content = markdownContent;


    if (!authKey) {
      setErrorMessage("Please Log In");
      setIsArticleCreated(false);
    } else if (!title || !perex || !content || !imageFile) {
      setErrorMessage("Please fill in all the fields");
      setIsArticleCreated(false);
    } else if (apiKey !== null) {
      try {
          const uploadedImageInfo = await uploadImage(imageFile, apiKey, authKey);
          console.log(uploadedImageInfo[0].imageId);
          console.log(content);
          await createArticle(title, perex, content, baseUrl, apiKey, authKey, uploadedImageInfo[0].imageId);
        setIsArticleCreated(true);
        setFormValues({ title: "", perex: "", content: "" });
        setMarkdownContent("");
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

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
          <label htmlFor="image">Featured image</label>
          <form className="smallButton fileInput">
            <p>Upload an Image</p>
            <input className="fileButton" type="file" name="image" accept="image/*"id="image"onChange={handleImageChange} />
          </form>
          {imagePreviewUrl && <img className="imgPreview" src={imagePreviewUrl} alt="Uploaded Preview" />}
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
          <MarkdownEditor
            name="content"
            id="content"
            placeholder="Article Content"
            value={markdownContent}
            onChange={(data) => setMarkdownContent(data.text)}
            style={{ height: '30rem' }}
            renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
          />
          {isArticleCreated && <p>Article Created</p>}
          {errorMessage && <p>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ArticleCreationForm;
