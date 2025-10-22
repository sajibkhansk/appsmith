export default {
  async buttonSubmitonClick() {
    try {
      // 1) User/team guard
      const user = getUserDetailsByEmail?.data?.[0];
      if (!user || user.user_name === "No user found") {
        showAlert("User team is not defined, please contact an admin", "error");
        return;
      }

      // 2) Required fields guard
      const businessName = inputBusinessName?.text?.trim();
      const ownerName = inputBusinessOwnerName?.text?.trim();
      const phoneRaw = inputBusinessPhone?.text?.trim();
      const website = inputBusinessWebsite?.text?.trim();
      const estimatedValue = inputEstimatedValue?.value; // allow 0? adjust if needed
      const otherCourier = selectOtherCourier?.value;
      const productCategory = selectProductCategory?.value;
      const isChurn = is_Churn?.text?.trim(); // if this is boolean, replace with is_Churn?.isSwitchedOn or similar

      if (
        !businessName ||
        !ownerName ||
        !phoneRaw ||
        !website ||
        !estimatedValue ||
        !otherCourier ||
        !productCategory ||
        !isChurn
      ) {
        showAlert("Please fill all the fields before submitting.", "error");
        return;
      }

      // 3) Phone validation (must start with 01 and be exactly 11 digits)
      const phone = phoneRaw.replace(/\D/g, ""); // keep only digits; remove if you strictly want raw input
      if (!phone.startsWith("01")) {
        showAlert("Phone number must start with '01'.", "error");
        return;
      }
      if (!/^\d{11}$/.test(phone)) {
        showAlert("Phone number must be exactly 11 digits.", "error");
        return;
      }

      // 4) Duplicates checks (await ensures proper short-circuiting)
      const phoneDup = await CheckPhoneInMerchants.run();
      if (phoneDup?.[0]?.count > 0) {
        showAlert("A merchant with this phone number already exists.", "error");
        return;
      }

      const leadDup = await checkDuplicateNewOnboards.run();
      if (leadDup?.[0]?.count > 0) {
        showAlert("A merchant with this phone number is already onboarded as a lead.", "error");
        return;
      }

      // 5) Insert
      await insertNewOnboards.run();

      // 6) UX tidy-up
      showAlert("Merchant Created Successfully", "success");
      resetWidget("modalAddNewLead", true);
      closeModal(modalAddNewLead.name);
      refreshFetchNewOnboardsData.buttonRefreshClick();
    } catch (error) {
      // Centralized error handling
      showAlert("Failed to create Merchant. Please try again.", "error");
      // Optionally log: console.error(error);
    }
  },
};
