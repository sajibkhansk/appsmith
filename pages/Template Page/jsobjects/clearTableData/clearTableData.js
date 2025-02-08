export default {
  // ... other methods and properties

  // Function to clear table data
  clearTableData: async () => {
    await storeValue("tabData", []); // Store an empty array to clear the table
  },

  // ... other methods and properties
};