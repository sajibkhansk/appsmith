export default {
  logout: async () => {
    try {
      await storeValue("authToken", null);
      await storeValue("userName", null);  
      await storeValue("userEmail", null); 

      console.log("Authentication data cleared successfully.");

      navigateTo("dashboard");

      showAlert("Logged out successfully");
    } catch (error) {

      console.error("Logout Error:", error);

      showAlert("Logout failed. Please try again.", "error");
    }
  }
};
