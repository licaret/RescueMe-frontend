<template>
  <section class="hero">
    <h1 class="hero-title">
      AD<span class="highlight">O</span>PT
    </h1>
    <img src="@/assets/dog.png" alt="Dog" class="hero-image" />
    <div class="button-container">
      <button class="action-button">JOIN US</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: 1;
  background-color: white;
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.hero-title {
  position: absolute;
  bottom: -10%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(10rem, 15vw, 35rem);
  font-weight: bold;
  letter-spacing: 2rem;
  color: transparent;
  background: url("@/assets/bck-adopt2.jpg") no-repeat center;
  background-size: cover;
  -webkit-background-clip: text;
  background-clip: text;
  z-index: 1;
  opacity: 0.7;
}

.hero-image {
  position: absolute;
  bottom: 0;
  left: 49%;
  transform: translateX(-50%);
  width: auto;
  max-height: 110%;
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
}

.action-button:hover {
  transform: scale(1.1);
  background-color: darkred;
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
