export default {
    onConfirmClick: async () => {
      try {
        const currentTab = appsmith.store.currentTab || 0;
  
        const newOnboardsId = newOnboardsTextBoxInfoPending.text.trim();
  
        if (!newOnboardsId) {
          throw new Error("No valid New Onboard ID found in the modal. Please try again.");
        }
  
        const mandatoryFields = [
          {field: InfoPendingReason.value, message: "Incomplete Registration Reason is required"}
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
                  reason_for_incomplete_registration:InfoPendingReason.value,
                  additional_reason: followupInfoPendingReason.value ? followupInfoPendingReason.value : null				
        };
  
        // Get business user details
        const userResult = await getUserDetailsByEmail.run({ email: appsmith.user.email });
        if (!userResult?.length) {
          throw new Error("Failed to fetch business team user details");
        }
  
        storeValue("businessTeamUserId", userResult[0].id);
        storeValue("newOnboardsId", newOnboardsId);
        storeValue("trackerScope", "Information Pending");
        storeValue("formData", formData);
  
        // Run the query to save data
        const insertResult = await saveFollowupResponseQuery.run({
          business_team_user_id: userResult[0].id,
          new_onboards_id: newOnboardsId,
          tracker_scope: "Info Pending",
          response: formData
        });
  
        if (!insertResult) {
          throw new Error("Failed to save to database");
        }
  
        showAlert("Form submitted successfully!", "success");
              
        resetWidget("newOnboardsTextBoxInfoPending", true);
        resetWidget("InfoPendingReason", true);
        resetWidget("followupInfoPendingReason", true);
        closeModal(followupInfoPending.name);
 
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