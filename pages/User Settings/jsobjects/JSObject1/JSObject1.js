export default {
  onResetClick: async () => {
    try {
      // Reset all widgets (dropdowns, text areas, etc.)
      const allWidgets = [
        "callStatus", 
        "isBusinessActive", 
        "isInterestedInCreatingAccount", 
        "needsFurtherDiscount", 
        "isLoyaltoOtherCouriers", 
        "hasOwnDeliveryFleet", 
        "businessActiveReason", 
        "businessAccountReason", 
        "futherDiscountReason", 
        "competitor", 
        "newOnboardsTextBox"
      ];

      // Reset all widgets
      allWidgets.forEach(widgetName => {
        resetWidget(widgetName, true);  // Reset each widget to default state
      });

      // Clear store values (if any)
      await clearStore(); // Reset all stored values from Appsmith store

      // Optional: Clear form data if needed
      storeValue("businessTeamUserId", null);
      storeValue("newOnboardsId", null);
      storeValue("trackerScope", null);
      storeValue("formData", null);

      showAlert("All fields and data have been reset!", "success");

    } catch (error) {
      console.error("Error during reset:", error);
      showAlert("Error during reset: " + error.message, "error");
    }
  }
};