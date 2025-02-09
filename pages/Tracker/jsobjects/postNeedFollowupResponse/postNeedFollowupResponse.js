export default {
	onConfirmClick: async () => {
		try {
			const currentTab = appsmith.store.currentTab || 0;

			const newOnboardsId = NeedFollowupTextBox.text.trim();

			if (!newOnboardsId) {
				throw new Error("No valid New Onboard ID found in the modal. Please try again.");
			}

			const mandatoryFields = [
				{field: followupCallStatusDropdown.value, message: "Call Status is required"},
				{field: dateOfNextCall.value, message: "Date for Next Call is required"},
				{field: isBusinessActive.value, message: "Business Active status is required"},
				{field: orderLowDropdown.value, message: "Order Low Reason is required"},
				{field: followupCompDropdown.value, message: "Move to competitor status is required"},
				{field: poorPerformanceDropdown.value, message: "Poor Delivery Performance status is  required"},
				{field: deliveryZoneDropdown.value, message: "Delivery Zone field is required"},
				{field: isDissatisfiedDropdown.value, message: "Merchant dissatisfaction status is  required"},
				{field: disNegoDropdown.value, message: "Discount Negotiation status is required"},


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
			const business_active_reason_test = isBusinessActive.value === "No" 
			? reasonForBusinessInactive.value 
			: null;
			// Prepare the form data
			const formData = {
				call_status: followupCallStatusDropdown.value,
				date_for_next_followup_call: dateOfNextCall.value,
				is_business_active: isBusinessActive.value,
				reason_for_business_being_inactive:business_active_reason_test ,
				reason_for_low_order_volume: orderLowDropdown.value,
				did_the_merchant_move_to_competitor: followupCompDropdown.value,
				name_of_the_competitor: followupCompDropdown.value === "Yes" ? selectCompetition.value : null,
				poor_delivery_performance: poorPerformanceDropdown.value,
				poor_delivery_zones: poorPerformanceDropdown.value == "Yes" ? deliveryZoneDropdown.value : null,
				is_the_merchant_dissatisfied: isDissatisfiedDropdown.value,
				dissatisfaction_reasons: isDissatisfiedDropdown.value === "Yes" ? dissatisfactionReason.value : null,
				is_discount_negotiation_needed: disNegoDropdown.value, 
				reason_for_further_discount_negotation: disNegoDropdown.value === "Yes" ? discountNegotiationReason.value:null
			};

			const userResult = await getUserDetailsByEmail.run({ email: appsmith.user.email });
			if (!userResult?.length) {
				throw new Error("Failed to fetch business team user details");
			}

			storeValue("businessTeamUserId", userResult[0].id);
			storeValue("newOnboardsId", newOnboardsId);
			storeValue("trackerScope", "Need Followup");
			storeValue("formData", formData);

			// Run the query to save data
			const insertResult = await saveFollowupResponseQuery.run({
				business_team_user_id: userResult[0].id,
				new_onboards_id: newOnboardsId,
				tracker_scope: "Need Followup",
				response: formData
			});

			if (!insertResult) {
				throw new Error("Failed to save to database");
			}

			showAlert("Form submitted successfully!", "success");

			// Reset the form widget or close modal if required
			resetWidget("followupCallStatusDropdown", true);
			resetWidget("dateOfNextCall", true);
			resetWidget("isBusinessActive", true);
			resetWidget("poorPerformanceDropdown",true);
			resetWidget("reasonForBusinessInactive",true);
			resetWidget("orderLowDropdown", true);
			resetWidget("followupCompDropdown", true);    
			resetWidget("selectCompetition", true);
			resetWidget("isDissatisfiedDropdown", true);
			resetWidget("dissatisfactionReason", true);    
			resetWidget("discountNegoDropdown", true);
			resetWidget("discountNegotiationReasonaso", true);



			closeModal(needFollowupModal.name);

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