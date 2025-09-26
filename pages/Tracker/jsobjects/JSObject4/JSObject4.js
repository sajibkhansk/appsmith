export default {
  // individual tasks (same things your buttons should run)
  async refreshInfoPending() { return GetInfoPending.run(); },
  async refreshOngoingOrders() { return GetOngoingOrders.run(); },
  async refreshOrdersPending() { return GetOrdersPending.run(); },

  // run them sequentially
  async runAll() {
    try {
      await this.refreshInfoPending();
      await this.refreshOngoingOrders();
      await this.refreshOrdersPending();
      showAlert("All actions completed!");
    } catch (e) {
      showAlert(e.message || "Something failed", "error");
    }
  },

  // or run them in parallel (faster, independent)
  async runAllParallel() {
    const results = await Promise.allSettled([
      this.refreshInfoPending(),
      this.refreshOngoingOrders(),
      this.refreshOrdersPending(),
    ]);
    const hasError = results.some(r => r.status === "rejected");
    showAlert(hasError ? "Some actions failed." : "All actions completed!");
  }
};
