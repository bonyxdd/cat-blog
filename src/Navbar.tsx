import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Login } from "./Login";

export const Navbar = () => {
  const { authKey, setAuthKey, userName, setUserName, apiKey, setApiKey } = useAuth();
  const handleLoginSuccess = (authKey: string | null, username: string, apiKey:string) => {
    setAuthKey(authKey);
    setUserName(username);
    setApiKey(apiKey);
  };
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <img src={require("./cat-logo.png")} alt="Main Page" />
          </Link>
        </li>
        {authKey ? (
          <div className="personalizedSec">
            <li>
              <Link to="/myArticles">My Articles</Link>
            </li>
            <li>
              <Link to="/create">Create Article</Link>
            </li>
            <li>
              <Link to="/profile">{userName} ({apiKey})</Link>
            </li>
          </div>
        ) : (
          <></>
        )}
        {authKey ? null : (
          <li>
            <Login onLoginSuccess={handleLoginSuccess} />
          </li>
        )}
      </ul>
    </nav>
  );
};
