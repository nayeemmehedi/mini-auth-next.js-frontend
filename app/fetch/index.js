import axios from "axios";
import Cookies from "js-cookie";

export class responseValue {
  constructor(value, loading, success, error) {
    this.value = value;
    this.loading = loading;
    this.success = success;
    this.error = error;
  }
}

export const apiValue = axios.create({
  baseURL: "https://muslim-sweets-backend.onrender.com/api/v1", // Replace with your apiValue base URL
  headers: {
    // "Content-Type": 'multipart/form-data',
    "Content-Type": "application/json",
  },
});
const apiValue2 = axios.create({
  baseURL: "https://muslim-sweets-backend.onrender.com/api/v1", // Replace with your apiValue base URL
  headers: {
    "Content-Type": "multipart/form-data",
    // "Content-Type": 'application/json'
  },
});
const my_access_token = Cookies.get("accessToken");
console.log("my access token", my_access_token);
// const my_refresh_token = Cookies.get('refreshToken');

// Request interceptor
apiValue.interceptors.request.use(
  (config) => {
    // You can modify the request configuration here
    // For example, you can add an authorization token
    const accessToken = my_access_token;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
apiValue.interceptors.response.use(
  (response) => {
    // You can modify the response data here
    return response;
  },
  async (error) => {
    // Handle response error
    if (error.response && error.response.status === 401) {
      // Token expired, attempt to refresh
      const newAccessToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiValue.request(error.config);
    }
    return Promise.reject(error);
  }
);

// Function to refresh the access token
async function refreshAccessToken() {
  try {
    // Make a request to your authentication endpoint with the refresh token
    const response = await axios.get(
      "https://muslim-sweets-backend.onrender.com/api/v1/newGenerateAccessToken"
    );

    // Update the access token with the new one
    return response.data.accessTokenValue;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

const fetchData = async () => {
  try {
    const response = await apiValue.get("/endpoint"); // Make a GET request
    return new responseValue({}, true, true, false);
  } catch (error) {
    console.error("GET Request Error:", error);
    return new responseValue({}, true, false, true);
  }
};

const postDataSignup = async (value) => {
  try {
    const response = await apiValue2.post("/signup", value);
    console.log("response data", response.data);

    return response.data;
  } catch (error) {
    return new responseValue({}, false, false, true);
  }
};

const postDataLogin = async (value) => {
  try {
    const response = await apiValue.post("/login", value);
    console.log("response data", response.data);

    return response.data;
  } catch (error) {
    return new responseValue(
      {
        error: error,
      },
      false,
      false,
      true
    );
  }
};

export { fetchData, postDataSignup, postDataLogin };
