export default {
	submitLogin: async () => {
		try {
			// Run the auth API
			const response = await auth_api.run();

			// Log the response for debugging
			console.log("API Response:", response);

			// Check if the response contains the access token
			if (response && response.access_token) {
				// Store the access token in Appsmith's store
				await storeValue("authToken", response.access_token);

        storeValue("userName", response.user_name); // Ensure correct field
        storeValue("userEmail", response.email); 
				
				// Navigate to the Dashboard page
				navigateTo("New Leads");

				// Optional: Show a success message
				showAlert("Login successful. Redirecting to 			Dashboard.", "success");
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