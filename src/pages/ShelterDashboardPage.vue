<template>
    <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
        <div class="flex items-center justify-between">
        <div class="flex items-center justify-start rtl:justify-end">
            <!-- <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button> -->
            <a class="flex items-center">
                <span class="self-center text-2xl font-medium whitespace-nowrap">
                <span class="text-gray-700 ">RESCUE</span>
                <span class="text-red-600 font-bold">ME</span>
                </span>
            </a>
        </div>
        <div class="flex items-center">
            <div class="flex items-center ms-3">
                <div>
                    <router-link to="/shelter-dashboard/edit-profile">
                        <button type="button" class="flex items-center px-4 py-2 text-sm font-medium bg-red-700 text-white rounded-full">
                            {{ shelterUsername }}
                        </button>
                    </router-link>
                </div>
                <!-- <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                <div class="px-4 py-3" role="none">
                    <p class="text-sm text-gray-900 dark:text-white" role="none">
                    Neil Sims
                    </p>
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                    neil.sims@flowbite.com
                    </p>
                </div>
                <ul class="py-1" role="none">
                    <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                    </li>
                    <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                    </li>
                    <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                    </li>
                    <li>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                    </li>
                </ul>
                </div> -->
            </div>
            </div>
        </div>
    </div>
    </nav>

    <aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul class="space-y-2 font-medium">
            <!-- <li>
                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/dashboard.png" alt="Dashboard icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
                </a>
            </li> -->
            <li>
                <router-link 
                    to="/shelter-dashboard/" 
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                    <img src="../assets/dashboard.png" alt="Dashboard icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
                </router-link>
            </li>
            <li>
                <router-link 
                    to="/shelter-dashboard/manage-pets" 
                    class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                    <img src="../assets/available-pets.png" alt="Dog paw icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Manage Pets</span>
                </router-link>
            </li>
            <li>
                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/adoption-requests.png" alt="Pet home icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Adoption Request</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/events.png" alt="Event icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Manage Events</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/inbox.png" alt="Inbox icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                    <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/donations.png" alt="Donate icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Donations</span>
                </a>
            </li>
            <li>
                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/settings.png" alt="Settings icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Settings</span>
                </a>
            </li>
            <li>
                <a @click="handleLogout" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <img src="../assets/signout.png" alt="Signout icon" class="w-5 h-5">
                    <span class="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                </a>
            </li>
        </ul>
    </div>
    </aside>

    <div class="p-4 sm:ml-64">
        <router-view></router-view>
    <!-- <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
        </div>
        <div class="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
            </p>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
        </div>
        <div class="flex items-center justify-center h-48 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
            <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
            </p>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
            <div class="flex items-center justify-center rounded-sm bg-gray-50 h-28 dark:bg-gray-800">
                <p class="text-2xl text-gray-400 dark:text-gray-500">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
                </p>
            </div>
        </div>
    </div> -->
    </div>
</template>



<script>
    import { ref, onMounted, onUnmounted } from "vue";
    import { useRouter } from "vue-router";
    import PetStatsChart from "@/components/PetStatsChart.vue";

    export default {
        components: { PetStatsChart },
        setup() {
            const router = useRouter();
            const shelterUsername = ref("Shelter");

            const blockBackButton = () => {
                history.pushState(null, "", location.href); 
            };

            const handleLogout = () => {
                localStorage.removeItem("token");
                localStorage.removeItem("Username");
                localStorage.removeItem("Id");
                localStorage.removeItem("shelterUsername");
                localStorage.removeItem("shelterId");

                window.removeEventListener("popstate", blockBackButton);

                router.push("/login");
            };


            onMounted(() => {
                const username = localStorage.getItem("shelterUsername");
                if (username) {
                    shelterUsername.value = username;
                } else {
                    console.error("Username not found in localStorage.");
                }

                window.history.pushState(null, "", window.location.href);
                window.addEventListener("popstate", blockBackButton);
            });

            onUnmounted(() => {
                window.removeEventListener("popstate", blockBackButton);
            });

            return {
                shelterUsername,
                handleLogout, 
            };
        },
    };
</script>
