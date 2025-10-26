export default {
    onConfirmClickForRejectLead: async () => {
      try {
        const currentTab = appsmith.store.currentTab || 0;
  
        const newOnboardsId = new_onboard_id.text;
  
        if (!newOnboardsId) {
          throw new Error("No valid New Onboard ID found in the modal. Please try again.");
        }
  
        const mandatoryFields = [
          {field: rejectLeadReasonInfoPending.text, message: "Rejection Reason Required"}
        ];
  
        for (const {field, message} of mandatoryFields) {
          if (!field) {
            showAlert(message, "error");
            return;  // Exits the function if any field is not filled
          }
        }
  
  
        // Validate conditional fields
        if (!rejectLeadReasonInfoPending.text) {
          showAlert("Rejection Reason Required", "error");
          return;
        }
 
        // Prepare the form data
        const formData = {
                  reasonForRejectLead:rejectLeadReasonInfoPending.text,
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
              
        resetWidget("rejectLeadReasonInfoPending", true);
 
  return {
    success: true,
    message: "Form submitted successfully!",
  };
  
      } catch (error) {
        console.error("Submission Error:", error);
        showAlert(error.message || "An error occurred during submission", "error");
   
        // Returning failure status or value
        return { success: false, message: error.message };
              
              
      }
    }
  };