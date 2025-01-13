export default {
  signOut: async () => {
    try {

      await storeValue("authToken", null);


      navigateTo("Log In");

      showAlert("You have successfully logged out.", "success");
    } catch (error) {
      console.error("Sign Out Error:", error);
      showAlert("Error while signing out. Please try again.", "error");
    }
  },
};