export default {
  infoPendingCallStatusToggle() {
    {
      {
        (async () => {
          let isTexted = currentRow ? currentRow.call_status : undefined;
          const id = currentRow.id;

          // Toggle the text status
          if (isTexted === "NO") {
            isTexted = "YES";
          } else if (isTexted === "YES") {
            isTexted = "NO";
          }

          // Optimistically update the widget data immediately (locally)
          currentRow.text_status = isTexted;

          // Store the updated values
          await Promise.all([
            storeValue("isTexted", isTexted),
            storeValue("id", id),
          ]);

          try {
            // Make the API call to update the backend
            const result = await updateCallStatus.run();

            // Manually update the table data
            const updatedData = informationPending.tableData.map(row => {
              if (row.id === id) {
                row.call_status = isTexted; // Update the text status for the row
              }
              return row;
            });

            // Update the table widget with the new data
            informationPending.setData(updatedData);  // `table1` is the name of your table widget

            // Success message
            showAlert("Follow-up status updated successfully.", "success");

          } catch (error) {
            // Handle any errors
            showAlert("Failed to update follow-up status. Please try again.", "warning");
          }
        })();
      }
    }
  },
};
