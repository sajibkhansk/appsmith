export default {
  openModalOnLoad: () => {
   if(!appsmith.store.modalShown){
      showModal("Modal1");
  }
}
}