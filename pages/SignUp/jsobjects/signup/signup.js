export default {
  signUpUser: async () => {
    const name = signUp_name.text.trim();
    const email = signUp_email.text.trim();
    const password = signUp_password.text.trim();
    const phone = signUp_phone.text.trim();
    const teamId = signUp_team.selectedOptionValue;
    const supervisorId = signUp_supervisor.selectedOptionValue;

    // Validate required fields
    if (!name || !email || !password || !phone || !teamId || !supervisorId) {
      showAlert("⚠️ Please fill in all the required fields.", "warning");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      showAlert("❌ Password must be at least 6 characters long.", "error");
      return;
    }

    try {
      // If this runs without error, treat it as success
      await auth_signUp.run();

      showAlert("✅ Signup successful! Please check your email to verify.", "success");
      navigateTo("Log In DB");

    } catch (error) {
      // No need to show failure alert per your request
      console.log("Signup failed silently:", error);
    }
  }
};