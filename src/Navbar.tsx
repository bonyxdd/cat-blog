import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Login } from "./Login";

export const Navbar = () => {
  const [loggedInUsername, setLoggedInUsername] = useState("");
  const { authKey, setAuthKey } = useAuth();
  const handleLoginSuccess = (authKey: string | null, username: string) => {
    setAuthKey(authKey);
    setLoggedInUsername(username);
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
              <Link to="/my-articles">My Articles</Link>
            </li>
            <li>
              <Link to="/create">Create Article</Link>
            </li>
            <li>
              <Link to="/profile">{loggedInUsername}</Link>
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
