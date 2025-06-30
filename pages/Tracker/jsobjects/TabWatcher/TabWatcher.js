export default {
	// Function to map new statuses with the query
  tabStatuses: {
    "Need Followup": "need_followup",
    "Registration Pending": "Registration Pending",
    "Information Pending": "Info Pending",
    "Orders Pending": "First Order Pending",
    "Orders Ongoing": "Incubation",
  },

  // Function to clear table data
  clearTableForTab: async (tabName) => {
    const normalizedTabName = tabName.replace(/\s+/g, "").toLowerCase();
    const storeKey = `${normalizedTabName}Data`;

    console.log(`Clearing data for tab: ${tabName} with store key: ${storeKey}`);
    await storeValue(storeKey, []); // Clear the table data
  },

  // Function to fetch data for a specific tab
  fetchDataForTab: async (tabName) => {
    try {
      const normalizedTabName = tabName.replace(/\s+/g, "").toLowerCase();
      const storeKey = `${normalizedTabName}Data`;
      const loadingKey = `${normalizedTabName}Loading`;

      console.log(`Fetching data for tab: ${tabName} with store key: ${storeKey}`);

      // Clear the table before fetching new data
      await this.clearTableForTab(tabName);

      // Show loading state
      await storeValue(loadingKey, true);

      // Determine the status for the tab
      const status = this.tabStatuses[tabName];
      if (!status) {
        showAlert("Invalid tab selected or status not defined.", "error");
        await storeValue(loadingKey, false);
        return;
      }

      // Fetch user details
      const userDetails = getUserDetailsByEmail.data;
      if (!userDetails || userDetails.length === 0 || !userDetails[0]?.id) {
        showAlert("Failed to fetch user details. User ID not found.", "error");
        await storeValue(loadingKey, false);
        return;
      }

      const userId = userDetails[0].id;
						console.log(typeof userId);;

      // Execute the query
      const result = await dynamicQuery.run({
        user_id: userId,
        status: status,
      });
			console.log(status);
      // Populate the table data
      if (result && result.length > 0) {
        await storeValue(storeKey, result);
        showAlert(`Data loaded successfully for ${tabName}.`, "success");
      } else {
        await storeValue(storeKey, []);
        showAlert(`No data found for ${tabName}.`, "warning");
      }
    } catch (error) {
      console.error(`Error fetching data for ${tabName}:`, error);
      showAlert(`Failed to fetch data: ${error.message}`, "error");
    } finally {
      const loadingKey = `${tabName.replace(/\s+/g, "").toLowerCase()}Loading`;
      await storeValue(loadingKey, false);
    }
  },
};