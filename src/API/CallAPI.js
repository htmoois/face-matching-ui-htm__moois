import axios from "axios";
import * as Config from "./Config";

export default async function CallApi(endpoint, method = "GET", body) {
  const config = {
    method: method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    url: `${Config.API_URL}/${endpoint}`,
    data: JSON.stringify(body),
  };

  let token = sessionStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    return await axios(config).then((response) => {
      return response.data;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
