export default {
  getAuthToken: () => {
    // Retrieve the token from the Appsmith store
    const token = appsmith.store.authToken;

    // Return the token or a message if the token is not available
    return token ? `Token: ${token}` : "No token found";
  }
};