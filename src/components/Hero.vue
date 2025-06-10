<template>
  <section class="hero">
    <h1 class="hero-title">
      AD<span class="highlight invisible-o">O</span>PT
    </h1>
    <img src="@/assets/dog.png" alt="Dog" class="hero-image" />
    <div class="button-container">
      <button class="action-button" @click="navigateToSignUp" :disabled="isLoading">
        <span v-if="!isLoading">JOIN US</span>
        <span v-else class="spinner"></span>
      </button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    navigateToSignUp() {
      this.isLoading = true;
      setTimeout(() => {
        this.$router.push("/signup")
          .catch(() => {
            this.isLoading = false;
          });
      }, 800);
    },
  },
};
</script>

<style scoped>
h1, img, .hero {
  user-select: none;
}

.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: 1;
  background-color: white;
  margin: 0;
  padding: 0;
  height: auto;
  overflow: hidden;
}

.hero-title {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(10rem, 15vw, 35rem);
  font-weight: bold;
  letter-spacing: 2rem;
  z-index: 1;
  opacity: 0.7;
  
  color: #484848;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

@supports (-webkit-background-clip: text) or (background-clip: text) {
  .hero-title {
    color: transparent;
    background: url("@/assets/bck-adopt2.jpg") no-repeat center;
    background-size: cover;
    background-attachment: fixed;
    -webkit-background-clip: text;
    background-clip: text;
    text-shadow: none;
  }
}

@-moz-document url-prefix() {
  .hero-title {
    color: #606060;
    background: none;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    -webkit-background-clip: unset;
    background-clip: unset;
  }
}

.hero-image {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-height: 100%;
  z-index: 2;
}

.button-container {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.action-button {
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: red;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  min-width: 120px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover:not(:disabled) {
  transform: scale(1.1);
  background-color: darkred;
}

.action-button:disabled {
  background-color: #cc3333;
  cursor: default;
}

button {
  user-select: none; 
  cursor: pointer; 
}

.invisible-o {
  opacity: 0; 
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(5rem, 10vw, 15rem);
  }

  .hero-image {
    max-height: 60%;
  }

  .action-button {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
  }

  .button-container {
    bottom: 15%;
  }
}
</style>