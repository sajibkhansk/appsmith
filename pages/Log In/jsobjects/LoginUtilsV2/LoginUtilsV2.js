export default {
  submitLogin: async () => {
    try {
      // Run the auth API
      const response = await auth_api.run();

      // Log the response for debugging
      console.log("API Response:", response);

      // Check if the response contains the access token and user details
      if (response && response.access_token) {
        // Store the access token in Appsmith's store
        storeValue("authToken", response.access_token);

        // If user data is inside the response, store the name and email
        if (response.user) {
          storeValue("userName", response.user.name); // Corrected field name
          storeValue("userEmail", response.user.email); // Corrected field name
        }

        // Log to verify user details are stored
        console.log("User stored:", response.user ? response.user.name : "No user name", response.user ? response.user.email : "No email");

        // Navigate to the Dashboard page
        navigateTo("New Leads");

        // Optional: Show a success message
        showAlert("Login successful. Redirecting to Dashboard.", "success");
      } else {
        // If the access token is missing, show an error
        console.error("Access token missing in response:", response);
        showAlert("Login failed. No access token received.", "error");
      }
    } catch (error) {
      // Handle API or any other errors
      console.error("Login Error:", error);
      showAlert("Login failed. Please check your credentials.", "error");
    }
  }
};