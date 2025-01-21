export default {
  buttonRefreshClick() {
    fetchNewOnboardsUserSpecific.run()
      .then(() => {
        showAlert("Data refreshed successfully!", "success");
      })
      .catch((error) => {
        showAlert("Failed to refresh data. Please try again.", "error");
      });
  }
};