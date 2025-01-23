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
      !selectProductCategory.value
    ) {
      showAlert("Please fill all the fields before submitting.", "error");
      return; 
    }

    // Run the checkDuplicatePhone query to see if the phone number exists
    checkDuplicatePhone.run()
      .then(data => {
        // If the phone number already exists, show an error
        if (data[0].count > 0) {
          showAlert("A merchant with this phone number already exists.", "error");
          return;
        }

        // Proceed with insertion if no duplicates
        insertNewOnboards.run()
          .then(() => {
            showAlert("Merchant Created Successfully", "success");
            closeModal('modalAddNewLead');
            this.clearFormInputs();
          })
          .catch((error) => {
            showAlert("Failed to create Merchant. Please try again.", "error");
          });
      })
      .catch((error) => {
        showAlert("Error checking for duplicate phone number. Please try again.", "error");
      });
  },

  clearFormInputs() {
    inputBusinessName.setValue('');
    inputBusinessOwnerName.setValue('');
    inputBusinessPhone.setValue('');
    inputBusinessWebsite.setValue('');
    inputEstimatedValue.setValue(0);  
    selectOtherCourier.setOptions([]);
    selectProductCategory.setOptions([]); 
  }
};