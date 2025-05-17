/**
 * Service for managing the current pet state in the adoption process
 * Temporarily stores information about the pet that is in the adoption process
 */

// Variable for storing information about the currently selected pet for adoption
let currentPet = null;

/**
 * Sets the current pet for the adoption process
 * @param {Object|null} petData - The pet data or null to clear selection
 */
function setCurrentAdoptionPet(petData) {
  console.log('Setting current adoption pet:', petData);
  currentPet = petData ? { ...petData } : null;
}

/**
 * Gets information about the currently selected pet for adoption
 * @returns {Object|null} The pet data or null if none is selected
 */
function getCurrentAdoptionPet() {
  console.log('Getting current adoption pet:', currentPet);
  return currentPet;
}

/**
 * Clears the current pet selection from the adoption process
 */
function clearCurrentAdoptionPet() {
  console.log('Clearing current adoption pet');
  currentPet = null;
}


export { 
  setCurrentAdoptionPet,
  getCurrentAdoptionPet,
  clearCurrentAdoptionPet
};