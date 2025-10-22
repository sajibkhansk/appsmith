export default {
  buttonSubmitonClick() {
    // Check if the user team is defined
    if (!getUserDetailsByEmail.data[0] || getUserDetailsByEmail.data[0].user_name === 'No user found') {
      showAlert("User team is not defined, please contact an admin", "error");
      return;
    }

    // Check if all required fields are filled
    if (
      !inputBusinessName.text.trim() ||
      !inputBusinessOwnerName.text.trim() ||
      !inputBusinessPhone.text.trim() ||
      !inputBusinessWebsite.text.trim() ||
      !inputEstimatedValue.value ||
      !selectOtherCourier.value ||
      !selectProductCategory.value ||
      !is_Churn.text.trim()
    ) {
      showAlert("Please fill all the fields before submitting.", "error");
      return;
    }

    // Validate that the phone number starts with "01"
    if (!inputBusinessPhone.text.startsWith("01")) {
      showAlert("Phone number must start with '01'.", "error");
      return;
    }

    // Validate that the phone number is exactly 11 digits
    if (inputBusinessPhone.text.length !== 11) {
      showAlert("Phone number must be exactly 11 digits.", "error");
      return;
    }

    // Run the checkDuplicatePhone query
    CheckPhoneInMerchants.run()
      .then(phoneData => {
        if (phoneData[0].count > 0) {
          showAlert("A merchant with this phone number already exists.", "error");
          return;
        }

        // Run the checkDuplicateNewOnboards query
        checkDuplicateNewOnboards.run()
          .then(leadData => {
            if (leadData[0].count > 0) {
              showAlert("A merchant with this phone number is already onboarded as a lead", "error");
              return;
            }

            // Proceed with insertion
            insertNewOnboards.run()
              .then(() => {
                showAlert("Merchant Created Successfully", "success");
                resetWidget("modalAddNewLead", true);
                closeModal(modalAddNewLead.name);
                refreshFetchNewOnboardsData.buttonRefreshClick();
              })
              .catch(() => {
                showAlert("Failed to create Merchant. Please try again.", "error");
              });
          })
          .catch(() => {
            showAlert("Error checking for duplicate business. Please try again.", "error");
          });
      })
      .catch(() => {
        showAlert("Error checking for duplicate phone number. Please try again.", "error");
      });
  }
};
