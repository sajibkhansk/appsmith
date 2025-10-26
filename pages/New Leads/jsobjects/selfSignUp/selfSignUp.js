export default {
  storeSelectedRows: async () => {
    const selectedRows = Table1.selectedRows;
    const activeUsers = activeUserForSelfSignup.selectedOptionValues;

    if (!activeUsers || activeUsers.length === 0) {
      showAlert('No active users selected.', 'warning');
      return;
    }

    const normalize = (p) => String(p || '').trim().replace(/^0+/, '');

    // Group merchants by account_status
    const statusGroups = {
      Incubation: [],
      'First Order Pending': [],
      'Info Pending': []
    };

    selectedRows.forEach(row => {
      const status = row.account_status;
      if (statusGroups[status]) statusGroups[status].push(row);
    });

    // Helpers
    const shuffle = (arr) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const sampleWithoutReplacement = (arr, k) => {
      if (k <= 0) return [];
      const copy = [...arr];
      const picks = [];
      for (let i = 0; i < k && copy.length; i++) {
        const j = Math.floor(Math.random() * copy.length);
        picks.push(copy[j]);
        copy.splice(j, 1);
      }
      return picks;
    };

    const assignedRows = [];
    const numUsers = activeUsers.length;

    // ▶ Equal distribution per status; randomize merchants; randomize remainder recipients
    Object.entries(statusGroups).forEach(([status, group]) => {
      if (!group || group.length === 0) return;

      const shuffledGroup = shuffle(group);

      const base = Math.floor(shuffledGroup.length / numUsers);
      const remainder = shuffledGroup.length % numUsers;

      const extraUsers = new Set(sampleWithoutReplacement(activeUsers, remainder));

      const quotas = activeUsers.map(u => ({
        user: u,
        take: base + (extraUsers.has(u) ? 1 : 0)
      }));

      let cursor = 0;
      for (const { user, take } of quotas) {
        const chunk = shuffledGroup.slice(cursor, cursor + take);
        cursor += take;

        for (const row of chunk) {
          const merchantPhone = normalize(row.phone);

          // No Google Sheet check; onboard_type from row or default to 'Organic'
          const onboardType = row.onboard_type || 'Organic';

          console.log(
            `Status: ${status} | Merchant: ${row.phone} (normalized: ${merchantPhone}) | onboard_type: ${onboardType} | -> user: ${user}`
          );

          assignedRows.push({
            ...row,
            business_team_user_id: user,
            onboard_type: onboardType
          });
        }
      }
    });

    // ✅ Insert assigned rows one-by-one with retry
    let succeeded = 0;
    let failed = 0;
    const failedRows = [];

    const insertWithRetry = async (row, retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          if (!row.id || !row.phone || !row.business_team_user_id || !row.onboard_type) {
            throw new Error('Missing required fields');
          }

          await insertSelfSignUp.run({
            merchant_id: row.id,
            business_name: row.name,
            merchant_created_at: row.merchant_created_at,
            phone: row.phone,
            account_status: row.account_status,
            onboard_type: row.onboard_type,
            business_team_user_id: row.business_team_user_id,
            assigner_user_id: getUserDetailsByEmail.data[0]?.id,
          });

          return true;
        } catch (error) {
          console.warn(`⚠️ Attempt ${attempt} failed for merchant_id: ${row.id}`, error);
          if (attempt === retries) return false;
          await new Promise(res => setTimeout(res, 300));
        }
      }
    };

    for (const row of assignedRows) {
      const success = await insertWithRetry(row);
      if (success) succeeded++;
      else {
        failed++;
        failedRows.push(row);
        console.error('❌ Final failure for:', JSON.stringify(row, null, 2));
      }
    }

    // Final alerts
    if (assignedRows.length === 0) {
      showAlert('No rows processed.', 'warning');
    } else if (failed > 0) {
      showAlert(`${succeeded} rows inserted successfully. ${failed} rows failed after retries. Check console.`, 'error');
    } else {
      closeModal(AssignUsersModal.name);
      showAlert(`${succeeded} rows inserted successfully. All inserts succeeded.`, 'success');
    }
  }
};