export default {
  getTotalCount: () => {
    console.log("Query Data:", count_new_onboards.data);
    if (count_new_onboards.data && count_new_onboards.data[0]) {
      const firstRow = count_new_onboards.data[0];
      const keys = Object.keys(firstRow);
      const totalCountKey = keys.find(key => key.toLowerCase().includes("count")); // Find the key dynamically
      if (totalCountKey) {
        return firstRow[totalCountKey];
      }
    }
    console.error("No result found or invalid data structure.");
    return "No result found";
  }
};