export default {
    myVar1: [],
    myVar2: {},
    async myFun1() {
      // Check if a file is selected
      if (FilePicker1.files.length === 0) {
        showAlert('Please upload a CSV file first.', 'error');
        return;
      }
  
      // Get the file object from the FilePicker widget
      const file = FilePicker1.files[0];
  
      // Log the file object for debugging
      console.log('File Object:', file);
  
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        showAlert('Invalid file type. Please upload a valid CSV file.', 'error');
        return;
      }
  
      // Check if the file data is in the expected format
      if (!file.data || !Array.isArray(file.data)) {
        showAlert('Invalid file data format. Please try again.', 'error');
        return;
      }
  
      // Fetch active users
      let activeUsers = [];
      try {
        const activeUsersResponse = await activeMember.run(); // Run the query to fetch active users
        console.log('Active Users Response:', activeUsersResponse); // Log the full response for debugging
  
        // Check if the response contains the active users and map over the response
        if (activeUsersResponse && Array.isArray(activeUsersResponse)) {
          // Assuming each object in the array contains the 'id' field
          activeUsers = activeUsersResponse.map(user => user.id); // Extract the user IDs
  
          if (activeUsers.length === 0) {
            showAlert('No active users found. Please check the ActiveUsers query.', 'error');
            return;
          }
        } else {
          // If the structure is unexpected or no data is returned
          showAlert('Error fetching active users. Please check the query or data structure.', 'error');
          return;
        }
      } catch (error) {
        // Log any errors that occur while fetching the active users
        console.error('Error fetching active users:', error);
        showAlert('Error fetching active users. Please try again.', 'error');
        return;
      }
  
      // Ensure there are active users before proceeding
      if (activeUsers.length === 0) {
        showAlert('No active users available for assignment.', 'error');
        return;
      }
  
      // Process the file data
      const parsedData = file.data; // The data is already an array of objects
      console.log('Parsed Data:', parsedData); // Debugging: Log the parsed data
  
      // Round Robin Index
      let userIndex = 0;
  
      // Insert each row into the database
      for (const row of parsedData) {
        // Log the row data for debugging
        console.log('Row Data:', row);
  
        // Convert all fields to strings and trim them
        const business_name = String(row.business_name || '').trim();
        const business_owner_name = String(row.business_owner_name || '').trim();
        const phone = String(row.phone || '').trim();
        const website = String(row.website || '').trim();
        const product_category_id = String(row.product_category_id || '').trim();
        const competitor_id = String(row.competitor_id || '').trim();
        const estimated_volume = parseFloat(row.estimated_volume) || 0;
  
        // Validate required fields
        if (!business_name) {
          console.error('Missing or empty business_name in row:', row);
          showAlert('Missing or empty business_name in one or more rows. Please check the CSV file.', 'error');
          continue; // Skip this row and proceed to the next one
        }
  
        // Log the values being processed
        console.log('Processing Row:', {
          business_name,
          business_owner_name,
          phone,
          website,
          estimated_volume,
          product_category_id,
          competitor_id
        });
  
        // Round robin assignment of business_team_user_id
        const business_team_user_id = activeUsers[userIndex];
  
        // Increment the userIndex to distribute users in round-robin fashion
        userIndex = (userIndex + 1) % activeUsers.length;
  
        // Store values in Appsmith store
        storeValue('business_name', business_name);
        storeValue('business_owner_name', business_owner_name || 'Unknown Owner');
        storeValue('phone', phone || '');
        storeValue('website', website || '');
        storeValue('estimated_volume', estimated_volume);
        storeValue('product_category_id', product_category_id || '1');
        storeValue('competitor_id', competitor_id || '1');
        storeValue('business_team_user_id', business_team_user_id); // Assigning the user in round-robin
        storeValue('status', 'Active'); // Default status
  
        try {
          // Execute the query with parameters (Insert the data into the database)
          await InsertQuery.run();
          console.log('Data inserted successfully:', row);
        } catch (error) {
          console.error('Error inserting data:', error);
          showAlert(`Error inserting data: ${error.message}`, 'error');
        }
      }
  
      // Reset the file picker widget after the process is completed
      resetWidget('FilePicker1', true);
    },
  };
  