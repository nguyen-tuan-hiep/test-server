import httpRequest from "./httpRequest";

const PREFIX = "users";

const login = async (email, password) => {
  const response = await httpRequest.post(`${PREFIX}/login`, {
    email,
    password,
  });
  return response.data;
};

const signup = async (data) => {
  const response = await httpRequest.post(`${PREFIX}/signup`, data);
  return response.data;
};

const getProfile = async (token) => {
  const response = await httpRequest.get(`${PREFIX}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateProfile = async (token, profile) => {
  const response = await httpRequest.patch(`${PREFIX}/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default { login, signup, getProfile, updateProfile };
