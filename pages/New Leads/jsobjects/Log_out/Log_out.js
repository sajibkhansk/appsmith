export default {
  logout: async () => {
    try {
      // Clear all stored values
      await storeValue("authToken", null);  // Clear the access token
      await storeValue("userName", null);  // Clear the username
      await storeValue("userEmail", null); // Clear the email

      // Log for debugging purposes
      console.log("Authentication data cleared successfully.");

      // Navigate the user to the login page
      navigateTo("dashboard");

      // Show a success message to the user
      showAlert("Logged out successfully");
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Logout Error:", error);

      // Show an error alert to the user
      showAlert("Logout failed. Please try again.", "error");
    }
  }
};
