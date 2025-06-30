export default {
  async createUser() {
    try {
      // 1️⃣ Validate if all fields are filled
      if (
        !inputUserName.text.trim() ||
        !inputUserEmail.text.trim() ||
        !inputUserPhone.text.trim() ||
        !inputTeamId.selectedOptionValue ||
        !inputSupervisorId.selectedOptionValue ||
        !inputPassword.text.trim()
      ) {
        showAlert("All fields are required!", "error");
        return;
      }

      // 2️⃣ Validate phone number (must be 10 digits & numeric)
      const phoneNumber = inputUserPhone.text.trim();
      if (!/^\d{11}$/.test(phoneNumber)) {
        showAlert("Phone number must be exactly 10 digits and numeric!", "error");
        return;
      }

      // 3️⃣ Check if email already exists in database
      const emailCheckResponse = await checkDuplicateEmail.run();
      if (emailCheckResponse.length > 0) {
        showAlert("This email is already registered!", "error");
        return;
      }

      // 4️⃣ Hash the password before storing (SHA-256)
      const hashedPassword = await hashPassword(inputPassword.text.trim());

      // 5️⃣ Insert new user into the database
      const insertResponse = await createNewUser.run({
        userName: inputUserName.text.trim(),
        userEmail: inputUserEmail.text.trim(),
        userPhone: phoneNumber,
        teamId: inputTeamId.selectedOptionValue,
        supervisorId: inputSupervisorId.selectedOptionValue,
        passwordHash: hashedPassword
      });

      if (insertResponse) {
        showAlert("User created successfully!", "success");
        closeModal("createNewUser");
        resetWidget("createNewUser");  // Reset the form
      } else {
        showAlert("Failed to create user. Please try again!", "error");
      }
    } catch (error) {
      showAlert("Error: " + error.message, "error");
    }
  }
};

// Function to hash password using SHA-256 (for PostgreSQL compatibility)
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}