export default {
  buttonDashboardonClick() {
    // Navigate to the Dashboard page
    navigateTo('Dashboard');  // This navigates to the 'Dashboard' page
    
    // Execute the query assigned_merchant_list_by_user before navigation
    assigned_merchant_list_by_user.run();  // This runs the query on the current page before navigating
  }
};