export default {
  validateAuthToken: async () => {
    const token = appsmith.store.authToken;

    if (!token) {
      console.error("No token found in store.");
      showAlert("Session expired. Please log in again.", "error");
      navigateTo("Log In");
      return;
    }

    console.log("Token found. Validating user role...");

    try {
      const userDetails = await getUserDetailsByEmail.run(); // Run the query

      // ✅ Check if user is NOT an admin
      if (!userDetails[0]?.is_admin) {
        console.warn("Access denied. User is not an admin.");
        showAlert("Access denied. Admins only.", "error");
        navigateTo("Log In");
        return;
      }

      console.log("Access granted. User is admin.");

    } catch (error) {
      console.error("Failed to validate user role:", error);
      showAlert("Failed to validate session. Please log in again.", "error");
      navigateTo("Log In");
    }
  },
};