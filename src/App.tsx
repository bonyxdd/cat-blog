import "./App.css";
import DisplayAllArticles from "./DisplayAllArticles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DisplaySingleArticle from "./DisplaySingleArticle";
import ArticleCreationForm from "./CreateArticle";
import { Navbar } from "./Navbar";
import { useAuth } from "./AuthContext";
import MyArticles from "./MyArticles";

export const baseUrl = "https://fullstack.exercise.applifting.cz";
export const temporaryApiKey = "17062279-8cd3-4916-911e-c0d5bf109ec9";
export interface AuthKeyProp {
  authKey: string | null;
}

const App = () => {
  const { authKey } = useAuth();
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DisplayAllArticles authKey={authKey} />} />
        <Route path="/:articleId" element={<DisplaySingleArticle />} />
        <Route path="/create" element={<ArticleCreationForm authKey={authKey} />}/>
        <Route path="/myArticles" element={<MyArticles authKey={authKey} />} />
      </Routes>
    </Router>
  );
};

export default App;
