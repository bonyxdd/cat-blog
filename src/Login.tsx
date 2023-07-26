import { useState } from "react";
import { baseUrl, apiKey } from "./App";
import axios, { AxiosResponse } from "axios";

interface LoginProps {
  onLoginSuccess: (authKey: string | null, username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleDialog = () => {
    setIsDialogOpen((prev) => !prev);
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response: AxiosResponse = await axios.post(
        baseUrl + "/login",
        {
          username,
          password,
        },
        {
          headers: {
            "X-API-KEY": apiKey,
          },
        }
      );
      if (response.status === 200) {
        const LoginData = response.data;
        const authKey = LoginData.access_token;
        onLoginSuccess(authKey, username);
        return authKey;
      }
    } catch (error) {
      setError("Invalid username or password");
    }
    return null;
  };

  return (
    <>
      <input
        className="smallButton"
        type="button"
        value="Log In"
        onClick={toggleDialog}
      />
      {isDialogOpen && (
        <>
          <div className="dialogMenuBcg">
            <div className="dialogMenu">
              <h2>Log In</h2>
              <form onSubmit={handleLoginSubmit}>
                <label htmlFor="username">Email</label>

                <input
                  type="text"
                  value={username}
                  id="username"
                  onChange={(event) => setUsername(event.target.value)}
                />

                <label htmlFor="password">Password</label>

                <input
                  type="password"
                  value={password}
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                />

                <div className="buttonWrap">
                  <input className="smallButton" type="submit" value="Log In" />
                </div>
              </form>
              {error && <p>{error}</p>}
            </div>
          </div>
        </>
      )}
    </>
  );
};
