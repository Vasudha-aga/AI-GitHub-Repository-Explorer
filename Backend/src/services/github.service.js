import axios from "axios";

export const searchRepositories = async (query) => {
  const response = await axios.get(
    `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`
  );

  return response.data.items;
};

export const getRepository = async (owner, repo) => {
  const response = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}`
  );

  return response.data;
};