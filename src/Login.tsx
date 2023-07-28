import { useState } from "react";
import { baseUrl } from "./App";
import axios, { AxiosResponse } from "axios";
import { Register } from "./RegisterUser";

interface LoginProps {
  onLoginSuccess: (
    authKey: string | null,
    username: string,
    apiKey: string
  ) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [register, setRegister] = useState(false);

  const toggleDialog = () => {
    setIsDialogOpen((prev) => !prev);
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(apiKey);
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
        onLoginSuccess(authKey, username, apiKey);
        return authKey;
      }
    } catch (error) {
      setError("Invalid username or password");
    }
    return null;
  };

  const handleLoginRegisterSwitch = () => {
    setRegister((prev) => !prev);
  };
  return (
    <>
      <input
        className="smallButton"
        type="button"
        value="Log In / Register"
        onClick={toggleDialog}
      />
      {isDialogOpen && (
        <>
          <div className="dialogMenuBcg">
            <div className="dialogMenu">
              {register ? (
                <Register />
              ) : (
                <>
                  <h2>Log In</h2>
                  <form id="login" onSubmit={handleLoginSubmit}>
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
                    <label htmlFor="apiKey">Api-Key</label>
                    <input
                      type="text"
                      value={apiKey}
                      id="apiKey"
                      onChange={(event) => setApiKey(event.target.value)}
                    />
                    <div className="buttonWrap">
                      <input
                        className="smallButton"
                        type="submit"
                        value="Log In"
                      />
                    </div>
                  </form>
                  {error && <p>{error}</p>}
                </>
              )}
              <div className="buttonWrap">
                <input
                  className="linkButton"
                  type="button"
                  value={register ? "Login" : "Register"}
                  onClick={handleLoginRegisterSwitch}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
