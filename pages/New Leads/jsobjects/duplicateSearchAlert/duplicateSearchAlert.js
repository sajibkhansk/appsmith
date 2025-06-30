export default {
  buttonPhoneNumberSearchonClick: async () => {
    // Run Query2 first
    const query2Result = await Query2.run();

    // Check if Query2 returned a valid result and 'new_onboards'
    if (query2Result && query2Result[0] && query2Result[0].source === 'new_onboards') {
      // Handle case where Query2 returns 'new_onboards'
      showAlert('Merchant is under chasing by an Acquisition Member', 'info');
      return; // Exit the function early if condition is met
    }

    // Proceed with existing logic if 'new_onboards' is not found
    if (duplicateMerchantCheck.data.length > 0) {
      showAlert('Data loaded successfully!', 'success');
    } else {
      showAlert('No merchant found against this number', 'error');
    }
  }
};
