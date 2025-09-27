export default {
  submitLogin: async () => {
    try {
      // Run the auth API
      const response = await auth_api.run();

      console.log("API Response:", response);

      if (response && response.access_token) {
        // Store token
        storeValue("authToken", response.access_token);

        // Store user info if available
        if (response.user) {
          storeValue("userName", response.user.name);
          storeValue("userEmail", response.user.email);
        }

        console.log(
          "User stored:",
          response.user ? response.user.name : "No user name",
          response.user ? response.user.email : "No email"
        );

        // Navigate
        navigateTo("New Leads");

        // Show custom toast for 3 seconds
        storeValue("toastMessage", "Login successful. Redirecting to Dashboard.");
        storeValue("showToast", true);
        setTimeout(() => {
          storeValue("showToast", false);
          storeValue("toastMessage", ""); // clear message
        }, 3000);

      } else {
        console.error("Access token missing in response:", response);

        storeValue("toastMessage", "Login failed. No access token received.");
        storeValue("showToast", true);
        setTimeout(() => {
          storeValue("showToast", false);
          storeValue("toastMessage", "");
        }, 3000);
      }
    } catch (error) {
      console.error("Login Error:", error);

      storeValue("toastMessage", "Login failed. Please check your credentials.");
      storeValue("showToast", true);
      setTimeout(() => {
        storeValue("showToast", false);
        storeValue("toastMessage", "");
      }, 3000);
    }
  }
};
