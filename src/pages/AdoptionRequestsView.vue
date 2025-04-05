<template>
    <div class="adoption-container">
      <h1 class="page-title">Adopt {{ pet ? pet.name : 'a Pet' }}</h1>
      
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
      
      <div v-else-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
        <button @click="$router.push('/')" class="btn btn-secondary">Back to Home</button>
      </div>
      
      <div v-else-if="successMessage" class="success-message">
        <h2>Thank You!</h2>
        <p>{{ successMessage }}</p>
        <div class="action-buttons">
          <button @click="$router.push('/my-adoptions')" class="btn btn-primary">View My Adoption Requests</button>
          <button @click="$router.push('/')" class="btn btn-secondary">Back to Home</button>
        </div>
      </div>
      
      <div v-else-if="pet" class="adoption-form-container">
        <div class="pet-preview">
          <div class="pet-image" v-if="pet.photos && pet.photos.length > 0">
            <img :src="pet.photos[0].url" :alt="pet.name">
          </div>
          <div class="pet-details">
            <h2>{{ pet.name }}</h2>
            <p><strong>Species:</strong> {{ pet.species }}</p>
            <p><strong>Breed:</strong> {{ pet.breed }}</p>
            <p><strong>Age:</strong> {{ pet.age }} years</p>
            <p><strong>Sex:</strong> {{ pet.sex }}</p>
            <p><strong>Size:</strong> {{ pet.size }}</p>
            <p><strong>Time in Shelter:</strong> {{ pet.timeSpentInShelter }}</p>
            <p v-if="pet.story"><strong>Story:</strong> {{ pet.story }}</p>
          </div>
        </div>
        
        <form @submit.prevent="submitAdoptionRequest" class="adoption-form">
          <h3>Your Information</h3>
          
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.contactInfo.name" 
              required
              :disabled="isSubmitting"
            >
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.contactInfo.email" 
              required
              :disabled="isSubmitting"
            >
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.contactInfo.phone" 
              required
              :disabled="isSubmitting"
            >
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="county">County</label>
              <input 
                type="text" 
                id="county" 
                v-model="formData.contactInfo.county" 
                required
                :disabled="isSubmitting"
              >
            </div>
            
            <div class="form-group half">
              <label for="city">City</label>
              <input 
                type="text" 
                id="city" 
                v-model="formData.contactInfo.city" 
                required
                :disabled="isSubmitting"
              >
            </div>
          </div>
          
          <h3>Experience & Expectations</h3>
          
          <div class="form-group">
            <label for="experience">Describe your experience with pets</label>
            <select 
              id="experience" 
              v-model="formData.experience" 
              required
              :disabled="isSubmitting"
            >
              <option value="professional">Professional experience (vet, trainer, etc.)</option>
              <option value="experienced">Experienced pet owner</option>
              <option value="moderate">Some experience with pets</option>
              <option value="first-time">First-time pet owner</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="activityLevel">How active is your lifestyle?</label>
            <select 
              id="activityLevel" 
              v-model="formData.activityLevel" 
              required
              :disabled="isSubmitting"
            >
              <option value="sedentary">Mostly sedentary</option>
              <option value="moderate">Moderately active</option>
              <option value="active">Very active</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="hoursAlone">How many hours will the pet be alone during a typical day?</label>
            <select 
              id="hoursAlone" 
              v-model="formData.hoursAlone" 
              required
              :disabled="isSubmitting"
            >
              <option value="0-2">0-2 hours</option>
              <option value="3-5">3-5 hours</option>
              <option value="6-8">6-8 hours</option>
              <option value="8+">More than 8 hours</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="reason">Why do you want to adopt this pet?</label>
            <textarea 
              id="reason" 
              v-model="formData.reason" 
              rows="4" 
              required
              :disabled="isSubmitting"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="additionalInfo">Is there anything else you'd like to share with the shelter?</label>
            <textarea 
              id="additionalInfo" 
              v-model="formData.additionalInfo" 
              rows="4"
              :disabled="isSubmitting"
            ></textarea>
          </div>
          
          <div class="form-group checkbox">
            <input 
              type="checkbox" 
              id="agreeTerms" 
              v-model="agreeTerms" 
              required
              :disabled="isSubmitting"
            >
            <label for="agreeTerms">
              I agree to the terms and conditions
              <div class="terms-detail">
                I confirm that all information provided is accurate and complete. I understand that providing false information may result in my application being rejected.
              </div>
            </label>
          </div>
          
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="$router.go(-1)"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="btn btn-primary" 
              :disabled="!agreeTerms || isSubmitting"
            >
              <span v-if="isSubmitting">Processing...</span>
              <span v-else>Submit Adoption Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdoptionRequestView',
    // Get petId from route params if not provided directly
    props: {
      petId: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      return {
        pet: null,
        loading: true,
        isSubmitting: false,
        errorMessage: '',
        successMessage: '',
        agreeTerms: false,
        formData: {
          contactInfo: {
            name: '',
            email: '',
            phone: '',
            city: '',
            county: ''
          },
          experience: 'moderate',
          activityLevel: 'moderate',
          hoursAlone: '3-5',
          reason: '',
          additionalInfo: ''
        }
      };
    },
    computed: {
      // Safely extract petId from props or route params
      currentPetId() {
        return this.petId || (this.$route && this.$route.params && this.$route.params.petId);
      }
    },
    async created() {
      // Ensure we have a petId to work with
      if (!this.currentPetId) {
        this.loading = false;
        this.errorMessage = 'No pet specified for adoption. Please select a pet first.';
        return;
      }
      
      // Load pet details
      try {
        await this.loadPetData();
        await this.loadUserData();
      } catch (error) {
        console.error('Error loading adoption data:', error);
        this.errorMessage = 'Unable to load pet information. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    methods: {
      async loadPetData() {
        try {
          // Using the consistent URL format from your API
          const response = await fetch(`/pets/${this.currentPetId}`);
          
          if (!response.ok) {
            // Log the full response text if not JSON
            const text = await response.text();
            console.error('API response is not OK:', text);
            throw new Error(`Failed to load pet data: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          this.pet = data;
          
          // Check if pet is available for adoption
          if (this.pet.status !== 'AVAILABLE') {
            throw new Error(`This pet is not available for adoption. Current status: ${this.pet.status}`);
          }
        } catch (error) {
          console.error('Pet data fetch error:', error);
          throw error;
        }
      },
      
      async loadUserData() {
        if (!this.$store || !this.$store.state.user) {
          return;
        }
        
        const user = this.$store.state.user;
        this.formData.contactInfo = {
          name: user.username || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          city: user.city || '',
          county: user.county || ''
        };
      },
      
      async submitAdoptionRequest() {
        if (!this.agreeTerms) {
          this.errorMessage = 'You must agree to the terms and conditions.';
          return;
        }
        
        if (!this.currentPetId) {
          this.errorMessage = 'Pet ID is missing. Please try again.';
          return;
        }
        
        this.isSubmitting = true;
        this.errorMessage = '';
        
        try {
          const userId = this.$store?.state?.user?.id;
          if (!userId) {
            throw new Error('You must be logged in to submit an adoption request');
          }
          
          // Create a simplified request object to avoid circular references
          const requestData = {
            userId: userId,
            petId: parseInt(this.currentPetId),
            requestDetails: {
              contactInfo: this.formData.contactInfo,
              experience: this.formData.experience,
              activityLevel: this.formData.activityLevel,
              hoursAlone: this.formData.hoursAlone,
              reason: this.formData.reason,
              additionalInfo: this.formData.additionalInfo || ''
            }
          };
          
          console.log('Submitting adoption request:', JSON.stringify(requestData));
          
          const response = await fetch('/api/v1/adoptions/requests', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.$store.state.token || ''}`
            },
            body: JSON.stringify(requestData)
          });
          
          if (!response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Failed to submit adoption request');
            } else {
              const text = await response.text();
              console.error('API error response:', text);
              throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
          }
          
          this.successMessage = `Your adoption request for ${this.pet.name} has been submitted successfully! The shelter will review your application and contact you soon.`;
          
        } catch (error) {
          console.error('Error submitting adoption request:', error);
          this.errorMessage = error.message || 'An error occurred while submitting your request. Please try again.';
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .adoption-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .page-title {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #4f46e5;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .error-message, .success-message {
    background-color: #fef2f2;
    border: 1px solid #f87171;
    color: #b91c1c;
    padding: 1.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  
  .success-message {
    background-color: #ecfdf5;
    border-color: #6ee7b7;
    color: #047857;
  }
  
  .error-message p, .success-message p {
    margin-bottom: 1rem;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .adoption-form-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  @media (min-width: 1024px) {
    .adoption-form-container {
      grid-template-columns: 1fr 2fr;
    }
  }
  
  .pet-preview {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .pet-image {
    width: 100%;
    height: 250px;
    overflow: hidden;
  }
  
  .pet-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .pet-details {
    padding: 1.5rem;
  }
  
  .pet-details h2 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  .pet-details p {
    margin-bottom: 0.5rem;
  }
  
  .adoption-form {
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .adoption-form h3 {
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e5e7eb;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
  }
  
  .form-group.half {
    width: 50%;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .checkbox {
    display: flex;
    align-items: flex-start;
  }
  
  .checkbox input {
    margin-top: 0.25rem;
    margin-right: 0.75rem;
    min-width: 1rem;
  }
  
  .terms-detail {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    gap: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-primary {
    background-color: #4f46e5;
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #4338ca;
  }
  
  .btn-secondary {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  .btn-secondary:hover {
    background-color: #e5e7eb;
  }
  
  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  </style>