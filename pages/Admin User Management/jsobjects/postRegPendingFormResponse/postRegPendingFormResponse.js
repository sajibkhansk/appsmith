export default {
  onConfirmClick: async () => {
    try {
      const currentTab = appsmith.store.currentTab || 0;

      const newOnboardsId = newOnboardsTextBox.text.trim();

      if (!newOnboardsId) {
        throw new Error("No valid New Onboard ID found in the modal. Please try again.");
      }

      const mandatoryFields = [
        {field: callStatus.value, message: "Call Status is required"},
        {field: isBusinessActiveDropdown.value, message: "Business Active status is required"},
        {field: isInterestedInCreatingAccount.value, message: "Account interest is required"},
        {field: needsFurtherDiscount.value, message: "Discount requirement is needed"},
        {field: isLoyaltoOtherCouriers.value, message: "Loyalty status is required"},
        {field: hasOwnDeliveryFleet.value, message: "Delivery fleet info is required"}
      ];

      for (const {field, message} of mandatoryFields) {
        if (!field) {
          showAlert(message, "error");
          return;  // Exits the function if any field is not filled
        }
      }

      // Log for debugging purposes
      console.log("businessActiveReason VALUE:", businessActiveReasonText.value);
      console.log("businessActiveReason TEXT:", businessActiveReasonText.text);

      // Validate conditional fields
      if (isBusinessActiveDropdown.value === "No" && !businessActiveReasonText.value) {
        showAlert("Business inactive reason is required", "error");
        return;
      }
// Example of conditionally assigning the business_active_reason value
const business_active_reason_test = isBusinessActiveDropdown.value === "No" 
  ? businessActiveReasonText.value 
  : null;
      // Prepare the form data
      const formData = {
        call_status: callStatus.value,
        is_business_active: isBusinessActiveDropdown.value,
        business_active_reason:business_active_reason_test ,
        account_interest: isInterestedInCreatingAccount.value,
        account_reason: isInterestedInCreatingAccount.value === "No" ? businessAccountReason.value : null,
        discount_need: needsFurtherDiscount.value,
        discount_reason: needsFurtherDiscount.value === "Yes" ? furtherDiscountReason.value : null,
        courier_loyalty: isLoyaltoOtherCouriers.value,
        competitor: isLoyaltoOtherCouriers.value === "Yes" ? competitor.value : null,
        delivery_fleet: hasOwnDeliveryFleet.value
      };

      // Get business user details
      const userResult = await getUserDetailsByEmail.run({ email: appsmith.user.email });
      if (!userResult?.length) {
        throw new Error("Failed to fetch business team user details");
      }

      storeValue("businessTeamUserId", userResult[0].id);
      storeValue("newOnboardsId", newOnboardsId);
      storeValue("trackerScope", "Registration Pending");
      storeValue("formData", formData);

      // Run the query to save data
      const insertResult = await saveFollowupResponseQuery.run({
        business_team_user_id: userResult[0].id,
        new_onboards_id: newOnboardsId,
        tracker_scope: "Registration Pending",
        response: formData
      });

      if (!insertResult) {
        throw new Error("Failed to save to database");
      }

      showAlert("Form submitted successfully!", "success");

      // Reset the form widget or close modal if required
			resetWidget("regPendingfollowupModal", true);
			closeModal(regPendingfollowupModal.name);

      // Returning success status or value
return {
  success: true,
  message: "Form submitted successfully!",
  businessActiveReason: businessActiveReasonText.value  // Assigning it to a key
};
			

    } catch (error) {
      console.error("Submission Error:", error);
      showAlert(error.message || "An error occurred during submission", "error");
      
      // Returning failure status or value
      return { success: false, message: error.message };
    }
  }
};
