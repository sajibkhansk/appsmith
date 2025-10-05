export default {
    onConfirmClick: async () => {
      try {
        const currentTab = appsmith.store.currentTab || 0;
  
        const newOnboardsId = OrderPendingTextPassingID.text.trim();
  
        if (!newOnboardsId) {
          throw new Error("No valid New Onboard ID found in the modal. Please try again.");
        }
  
          const mandatoryFields = [
          {field: callStatusDropdown.value, message: "Call Status is required"},
          // {field: businessActiveDropdown.value, message: "Business Active status is required"},
          // {field: commitedDateDropdown.value, message: "Commited Date is required"},
          // {field: discountNegoDropdown.value, message: "Loyalty status is required"}
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
  const business_active_reason_test = businessActiveDropdown.value === "No" 
    ? businessInactiveReason.value 
    : null;
        // Prepare the form data
         const formData = {
          call_status: callStatusDropdown.value,
          is_business_active: businessActiveDropdown.value,
          reason_for_business_being_inactive:business_active_reason_test ,
          commited_date_for_order_creation: commitedDateDropdown.value,
          is_discount_needed: discountNegoDropdown.value,
          reason_for_further_discount: discountNegoDropdown.value === "Yes" ? discountNegoReason.value : null,
          is_api_integration: apiDropdown.value
        };
        // Get business user details
        const userResult = await getUserDetailsByEmail.run({ email: appsmith.user.email });
        if (!userResult?.length) {
          throw new Error("Failed to fetch business team user details");
        }
  
        storeValue("businessTeamUserId", userResult[0].id);
        storeValue("newOnboardsId", newOnboardsId);
        storeValue("trackerScope", "Orders Pending");
        storeValue("formData", formData);
  
        // Run the query to save data
        const insertResult = await saveFollowupResponseQuery.run({
          business_team_user_id: userResult[0].id,
          new_onboards_id: newOnboardsId,
          tracker_scope: "Orders Pending",
          response: formData
        });
  
        if (!insertResult) {
          throw new Error("Failed to save to database");
        }
  
        showAlert("Form submitted successfully!", "success");
              
        resetWidget("callStatusDropdown", true);
        resetWidget("businessActiveDropdown", true);
        resetWidget("followupInfoPendingReason", true);
                   closeModal(ordersPendingModal.name);
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