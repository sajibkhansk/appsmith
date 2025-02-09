export default {
  validateAuthToken: async () => {
    const token = appsmith.store.authToken;

    if (token) {
      console.log("Token Found:");

    } else {
      console.error("No token found in store.");
      showAlert("Session expired. Please log in again.", "error");

      
      navigateTo("Log In");
    }
  },
};