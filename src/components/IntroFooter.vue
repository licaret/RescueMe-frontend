<template>
  <footer class="footer">
    <p class="footer-text">2024 © RescueMe | All rights reserved</p>
  </footer>
</template>

<style scoped>
.footer {
  width: 100%;
  padding: 1rem;
  background-color: white;
  color: grey;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  margin: 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 1rem 15rem;
}

.footer-text {
  font-size: clamp(0.8rem, 1vw, 0.9rem);
  color: gray;
  margin: 0;
}

@media (max-width: 768px) {
  .footer {
    padding: 0.5rem 0;
  }

  .footer-text {
    font-size: 0.8rem;
    padding-left: 15px;
  }
}
</style>
