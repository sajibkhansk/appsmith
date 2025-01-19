export default {
  changePassword: async (currentPassword, newPassword) => {
    try {
      // Run the password change API
      const response = await changePasswordzz.run({
        current_password: currentPassword,
        new_password: newPassword
      });

      // Log the response for debugging
      console.log("API Response:", response);

      // Check if the response indicates success
      if (response && response.success) {
        // Optional: Log the user out or update UI as needed
        console.log("Password change successful:", response);

        // Optional: Clear any stored sensitive information if needed
        // await removeValue("authToken");

        // Show a success message
        showAlert("Password changed successfully.", "success");

        // Optional: Navigate to a specific page (e.g., Login or Profile)
        // navigateTo("Login");
      } else {
        // If the response indicates failure, show an error
        console.error("Password change failed:", response);
        showAlert(response.message || "Password change failed.", "error");
      }
    } catch (error) {
      // Handle API or any other errors
      console.error("Password Change Error:", error);
      showAlert("An error occurred while changing the password. Please try again.", "error");
    }
  }
};
