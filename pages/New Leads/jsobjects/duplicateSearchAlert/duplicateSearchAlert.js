export default {
	buttonPhoneNumberSearchonClick () {
		if (duplicateMerchantCheck.data.length > 0) {
  showAlert('Data loaded successfully!', 'success');
} else {
  showAlert('No merchant found against this number', 'error');
}
	}
}