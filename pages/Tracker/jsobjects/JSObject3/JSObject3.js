export default {
	function updateStatus(statusType, merchantId, statusValue) {
  const status = statusValue ? "Done" : "Not Done";  // Convert the switch value to text
  
  const updateQuery = `
    UPDATE merchants
    SET ${statusType}_status = :status
    WHERE id = :merchantId
  `;

  // Execute the update query to save the status
  return runQuery(updateQuery, {
    status: status,
    merchantId: merchantId
  }).then(response => {
    if (response.success) {
      // Optionally show success message
      showAlert(`${statusType} status updated successfully!`, "success");
    } else {
      // Handle error if query fails
      showAlert("Failed to update status", "error");
    }
  });
}

}