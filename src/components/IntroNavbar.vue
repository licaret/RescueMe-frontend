<script>
export default {
  name: "IntroNavbar",
  data() {
    return {
      isMenuOpen: false, 
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      RESCUE<span>ME</span>
    </div>
    <div class="hamburger" @click="toggleMenu">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <ul :class="['nav-links', { 'nav-active': isMenuOpen }]">
      <li><a href="#">HOME</a></li>
      <li><a href="#">ABOUT</a></li>
      <li><a href="#">CONTACT</a></li>
      <li><a href="#" class="login-button">LOGIN</a></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 15rem;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.7rem;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.7);
  cursor: default;
}

.logo span {
  color: red;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  transition: transform 0.3s ease-in-out;
}

.nav-links li {
  margin-left: 4rem;
}

.nav-links a {
  text-decoration: none;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: red;
}

.login-button {
  border: 3px solid red;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: red;
  font-weight: bold;
  transition: background-color 0.3s, color 0.3s;
}

.login-button:hover {
  background-color: red !important;
  color: white !important;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 0.3rem;
}

.hamburger .line {
  width: 2rem;
  height: 0.2rem;
  background-color: rgba(0, 0, 0, 0.8);
}

.nav-active {
  transform: translateX(0);
}

@media (max-width: 768px) {
  .navbar {
    padding: 1.5rem 2rem;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: calc(100vh - 4rem);
    padding: 2rem;
    transform: translateX(100%);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .nav-links li {
    margin: 1rem 0;
  }

  .hamburger {
    display: flex;
  }
}
</style>
