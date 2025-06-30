export default {
  storeSelectedRows: async () => {
    const selectedRows = Table1.selectedRows;
    const activeUsers = activeUserForSelfSignup.selectedOptionValues;

    if (!activeUsers || activeUsers.length === 0) {
      showAlert('No active users selected.', 'warning');
      return;
    }

    const normalize = (p) => String(p || '').trim().replace(/^0+/, '');

    // Fetch phone numbers from Google Sheet
    let sheetPhones = [];
    try {
      sheetPhones = Total_record_Data1.data
        .map(row => normalize(row.phone))
        .filter(p => p.length > 0);

      console.log('✅ Normalized Sheet Phones:', sheetPhones);
    } catch (err) {
      showAlert('Failed to fetch phone numbers from Google Sheet.', 'error');
      console.error('❌ Error fetching sheet data:', err);
      return;
    }

    // Group merchants by account_status
    const statusGroups = {
      Incubation: [],
      'First Order Pending': [],
      'Info Pending': []
    };

    selectedRows.forEach(row => {
      const status = row.account_status;
      if (statusGroups[status]) {
        statusGroups[status].push(row);
      }
    });

    const assignedRows = [];
    const numUsers = activeUsers.length;

    Object.entries(statusGroups).forEach(([status, group]) => {
      group.sort((a, b) => a.id - b.id);

      for (let i = 0; i < group.length; i++) {
        const userIndex = i % numUsers;
        const assignedUser = activeUsers[userIndex];

        const merchantPhone = normalize(group[i].phone);
        const isInSheet = sheetPhones.includes(merchantPhone);
        const onboardType = isInSheet ? 'MKT' : 'Organic';

        console.log(`Merchant: ${group[i].phone} (normalized: ${merchantPhone}) | onboard_type: ${onboardType}`);

        assignedRows.push({
          ...group[i],
          business_team_user_id: assignedUser,
          onboard_type: onboardType
        });
      }
    });

    // Insert assigned rows in parallel
    const results = await Promise.allSettled(
      assignedRows.map(async (row) => {
        try {
          // Validate required fields
          if (!row.id || !row.phone || !row.business_team_user_id || !row.onboard_type) {
            console.warn('⚠️ Skipping row due to missing required fields:', row);
            throw new Error('Missing required fields');
          }

          await insertSelfSignUp.run({
            merchant_id: row.id,
						business_name:row.name,
            merchant_created_at: row.merchant_created_at,
            phone: row.phone,
            account_status: row.account_status,
            onboard_type: row.onboard_type,
            business_team_user_id: row.business_team_user_id,
            assigner_user_id: getUserDetailsByEmail.data[0]?.id
          });
        } catch (error) {
          console.error(`❌ Insert failed for merchant_id: ${row.id}`);
          console.error('Full Row Data:', JSON.stringify(row, null, 2));
          console.error('Error:', error);
          throw error;
        }
      })
    );

    const failed = results.filter(r => r.status === 'rejected').length;
    const succeeded = results.length - failed;

    const failedRows = assignedRows.filter((_, i) => results[i].status === 'rejected');
    if (failedRows.length > 0) {
      console.error('🛑 Failed Inserts:', JSON.stringify(failedRows, null, 2));
    }

    if (results.length === 0) {
      showAlert('No rows processed.', 'warning');
    } else if (failed > 0) {
      showAlert(`${succeeded} rows inserted successfully. ${failed} rows failed. Check console for errors.`, 'error');
    } else {
      closeModal(AssignUsersModal.name);
      showAlert(`${succeeded} rows inserted successfully. All inserts succeeded.`, 'success');
    }
  }
};
