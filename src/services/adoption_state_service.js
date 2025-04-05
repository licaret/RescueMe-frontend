
let currentPet = null;

function setCurrentAdoptionPet(petData) {
  console.log('Setting current adoption pet:', petData);
  currentPet = petData ? { ...petData } : null;
}


function getCurrentAdoptionPet() {
  console.log('Getting current adoption pet:', currentPet);
  return currentPet;
}


function clearCurrentAdoptionPet() {
  console.log('Clearing current adoption pet');
  currentPet = null;
}


export { 
  setCurrentAdoptionPet,
  getCurrentAdoptionPet,
  clearCurrentAdoptionPet
};