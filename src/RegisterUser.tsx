import { useState } from "react";
import { baseUrl, temporaryApiKey } from "./App";
import axios, { AxiosResponse } from "axios";

export const Register = () => {
  const [name, setUsername] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response: AxiosResponse = await axios.post(
        baseUrl + "/tenants",
        {
          name,
          password,
        },
        {
          headers: {
            "X-API-KEY": temporaryApiKey,
          },
        }
      );
      if (response.status === 200) {
        const RegisterData = response.data;
        const authKey = RegisterData.access_token;
        setApiKey(RegisterData.apiKey);
        return authKey;
      }
    } catch (error) {
      setError("Invalid username or password");
    }
    return null;
  };

  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleRegisterSubmit}>
        <label htmlFor="username">Email</label>

        <input
          type="text"
          value={name}
          id="username"
          autoComplete="off"
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Password</label>

        <input
          type="password"
          value={password}
          id="password"
          autoComplete="off"
          onChange={(event) => setPassword(event.target.value)}
        />
        <p>
          Please save your Api-Key:
          <p className="apikey">
          {apiKey}
          </p>
        </p>
        <div className="buttonWrap">
          <input className="smallButton" type="submit" value="Register" />
        </div>
      </form>
      {error && <p>{error}</p>}
    </>
  );
};
