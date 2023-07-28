import axios from "axios";

export default async function deleteArticle(
  articleId: string,
  baseUrl: string,
  apiKey: string,
  authKey: string
) {
  try {
    await axios.delete(
      baseUrl + `/articles/${articleId}`,
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
  return null;
}
