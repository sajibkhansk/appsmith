export default {
  buttonSubmitonClick() {


    if (!getUserDetailsByEmail.data[0] || getUserDetailsByEmail.data[0].user_name === 'No user found') {
      showAlert("User team is not defined, please contact an admin", "error");
      return; 
    }


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

    insertNewOnboards.run()
      .then(() => {
        showAlert("Merchant Created Successfully", "success");
        closeModal('modalAddNewLead');
        this.clearFormInputs();
      })
      .catch((error) => {
        showAlert("Failed to create Merchant. Please try again.", "error");
      });
  },

  clearFormInputs() {
    inputBusinessName.setValue('');
    inputBusinessOwnerName.setValue('');
    inputBusinessPhone.setValue('');
    inputBusinessWebsite.setValue('');
    inputEstimatedValue.setValue(0);  
    selectOtherCourier.setOptions([])
		selectProductCategory.setOptions([]); 
  }
};