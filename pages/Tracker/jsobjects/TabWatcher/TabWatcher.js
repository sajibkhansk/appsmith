export default {
  tabStatuses: {
    "Need Followup": "need_followup",
    "Registration Pending": "registration_pending",
    "Information Pending": "information_pending",
    "Orders Pending": "orders_pending",
    "Orders Ongoing": "ongoing_merchant",
  },

  fetchFilteredData: async (selectedTab) => {
    try {
      // Clear existing table data
      await storeValue("tabData", []);
      await storeValue("isLoading", true);

      // Retrieve the status associated with the selected tab
      const status = TabWatcher.tabStatuses[selectedTab];
      if (!status) {
        showAlert("Invalid tab selected or status not defined.", "error");
        return;
      }

      // Fetch user details
      const userDetails = getUserDetailsByEmail.data;
      if (!userDetails || userDetails.length === 0 || !userDetails[0]?.id) {
        showAlert("Failed to fetch user details. User ID not found.", "error");
        return;
      }

      const userId = userDetails[0].id;

      // Execute the query with the user ID and tab-specific status
      const result = await dynamicQuery.run({
        user_id: userId,
        status: status,
      });

      // Update the table data and show alerts based on results
      if (result && result.length > 0) {
        await storeValue("tabData", result); // Store data for the table
        showAlert("Data loaded successfully.", "success");
      } else {
        await storeValue("tabData", []); // Store empty array if no data
        showAlert("No data found for the selected tab.", "warning");
      }
    } catch (error) {
      console.error("Error fetching data for the tab:", error);
      showAlert(`Failed to fetch data: ${error.message}`, "error");
    } finally {
      // Turn off loading state
      await storeValue("isLoading", false);
    }
  },
};