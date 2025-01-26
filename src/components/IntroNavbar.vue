<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-8">
      <a href="#" class="flex items-center">
        <span class="self-center text-2xl font-medium whitespace-nowrap">
          <span class="text-gray-700 ">RESCUE</span>
          <span class="text-red-600 font-bold">ME</span>
        </span>
      </a>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class=" flex flex-col p-6 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-12 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <li>
            <a @click="navigateToHome" style="cursor: pointer;" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">HOME</a>
          </li>
          <li>
            <a href="#" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">ABOUT</a>
          </li>
          <li>
            <a href="#" class="block py-4 px-6 text-gray-800 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">CONTACT</a>
          </li>
          <li>
            <a @click="navigateToLogin" style="cursor: pointer;" class="block py-4 px-6 text-red-600 text-lg rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">LOGIN</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default{
  methods: {
    navigateToLogin(){
      this.$router.push("/login");
    },
    navigateToHome(){
      this.$router.push("/home");
    },
  },
};
</script>

<style>
  nav, nav * {
    user-select: none;
  }
</style>