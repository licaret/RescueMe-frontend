<template>
    <div class="dashboard-container">
      <!-- Top Navigation Bar -->
      <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button @click="toggleSidebar" data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Toggle sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <a class="flex items-center ml-2">
                <span class="self-center text-2xl font-medium whitespace-nowrap">
                  <span class="text-gray-700">RESCUE</span>
                  <span class="text-red-600 font-bold">ME</span>
                </span>
              </a>
            </div>
            <div class="flex items-center">
              <!-- Notifications -->
              <div class="flex items-center mr-4 relative notifications-container">
                <button @click="toggleNotifications" type="button" class="relative p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                  <span class="sr-only">View notifications</span>
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  <div v-if="unreadNotifications > 0" class="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                    {{ unreadNotifications }}
                  </div>
                </button>
                <!-- Dropdown menu -->
                <div v-if="showNotifications" class="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                  <div class="p-3 border-b border-gray-200">
                    <h5 class="text-sm font-semibold text-gray-700">Notifications</h5>
                  </div>
                  <div class="max-h-60 overflow-y-auto">
                    <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                      No notifications yet
                    </div>
                    <a v-for="(notification, index) in notifications" :key="index" href="#" class="flex px-4 py-3 border-b hover:bg-gray-50">
                      <div class="flex-shrink-0">
                        <div :class="notification.icon.bg" class="w-10 h-10 rounded-full flex items-center justify-center">
                          <svg class="w-5 h-5 text-white" :fill="notification.icon.fill" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path :d="notification.icon.path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="w-full pl-3">
                        <div class="text-gray-500 text-sm mb-1.5">
                          {{ notification.message }}
                        </div>
                        <div class="text-xs text-blue-600">
                          {{ notification.time }}
                        </div>
                      </div>
                    </a>
                  </div>
                  <a href="#" class="block py-2 text-sm font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100">
                    View all notifications
                  </a>
                </div>
              </div>
              <!-- User Menu -->
              <div class="flex items-center ms-3 user-menu-container">
                <div>
                  <router-link to="/shelter-dashboard/edit-profile">
                    <button type="button" class="flex items-center px-4 py-2 text-sm font-medium bg-red-700 text-white rounded-full">
                      {{ shelterUsername }}
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Sidebar -->
      <aside :id="'logo-sidebar'" :class="{'sm:translate-x-0': true, '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen}" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul class="space-y-2 font-medium">
            <li>
              <router-link 
                to="/shelter-dashboard/" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/manage-pets" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/manage-pets') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Manage Pets</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/adoption-requests" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/adoption-requests') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Adoption Requests</span>
                <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">{{ pendingAdoptionCount }}</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/manage-events" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/manage-events') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Manage Events</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/messages" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/messages') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/donations" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/donations') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Donations</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/reports" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/reports') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Reports & Analytics</span>
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shelter-dashboard/edit-profile" 
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                :class="{ 'bg-gray-100': isActive('/shelter-dashboard/edit-profile') }"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Settings</span>
              </router-link>
            </li>
            <li>
              <a @click="showLogoutConfirmation" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
  
      <!-- Main Content -->
      <div class="p-4 sm:ml-64 pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div v-if="route.path === '/shelter-dashboard/'">
          <!-- Dashboard Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-blue-100">
                  <svg class="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Total Pets</p>
                  <h3 class="text-2xl font-bold">{{ stats.total }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-red-100">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v8m0 4h.01"></path>
                    </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Urgent Adoption Needed</p>
                  <h3 class="text-2xl font-bold">{{ stats.urgent }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-green-100">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Available</p>
                  <h3 class="text-2xl font-bold">{{ stats.available }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-yellow-100">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Pending</p>
                  <h3 class="text-2xl font-bold">{{ stats.pending }}</h3>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="rounded-full p-3 bg-gray-200">
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12m0-12L6 18"></path>
                    </svg>
                </div>
                <div class="ml-4">
                  <p class="text-gray-500 text-sm">Adopted</p>
                  <h3 class="text-2xl font-bold">{{ stats.adopted }}</h3>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Main Dashboard Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Recent Activity Section -->
            <div class="lg:col-span-2 bg-white rounded-2xl shadow h-full flex flex-col">
              <div class="p-4 border-b flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <router-link to="/shelter-dashboard/reports" class="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all activity
                </router-link>
              </div>
              <div class="p-4">
                <ul class="divide-y">
                  <li class="py-3">
                    <div class="flex items-start">
                      <div class="bg-blue-100 p-2 rounded-full">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                          </path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium">New adoption request for <span class="font-semibold">Max</span></p>
                        <p class="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                      <div class="ml-auto">
                        <span class="text-xs font-medium text-white bg-blue-500 px-2 py-1 rounded-full">Pending</span>
                      </div>
                    </div>
                  </li>
                  <li class="py-3">
                    <div class="flex items-start">
                      <div class="bg-green-100 p-2 rounded-full">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                          </path>
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium">Updated profile for <span class="font-semibold">Luna</span></p>
                        <p class="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div class="ml-auto">
                        <span class="text-xs font-medium text-white bg-green-500 px-2 py-1 rounded-full">Completed</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>


            <!-- Upcoming Events Section -->
            <div class="bg-white rounded-2xl shadow  h-full flex flex-col">
              <div class="p-4 border-b flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-800">Upcoming Events</h2>
                <router-link to="/shelter-dashboard/manage-events" class="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View all
                </router-link>
              </div>
              <div class="p-4">
                <ul class="divide-y" v-if="upcomingEvents.length > 0">
                  <li
                    v-for="event in upcomingEvents.slice(0, 2)"
                    :key="event.id"
                    class="py-3"
                  >
                    <div class="flex items-center">
                      <div class="bg-indigo-100 p-2 rounded text-center w-12">
                        <div class="text-xs text-indigo-600 font-medium">
                          {{ new Date(event.startDateTime).toLocaleString('en-US', { month: 'short' }).toUpperCase() }}
                        </div>
                        <div class="text-indigo-800 font-bold">
                          {{ new Date(event.startDateTime).getDate() }}
                        </div>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-semibold text-gray-800">
                          {{ event.title }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }} - 
                          {{ new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <p v-else class="text-sm text-gray-500 text-center py-6">
                  No upcoming events scheduled.
                </p>
              </div>
            </div>

          </div>

          <div>
              <PetAdoptionPieChart :stats="stats" />
          </div>

        <!-- Additional Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <!-- Urgent Adoptions Needed -->
          <div class="bg-white rounded-2xl shadow flex flex-col">
            <div class="p-4 border-b flex items-center justify-between">
              <h2 class="text-lg font-semibold text-red-600 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Urgent Adoptions Needed
              </h2>
              <router-link to="/shelter-dashboard/manage-pets" class="text-sm font-medium text-blue-600 hover:text-blue-800">
                View all
              </router-link>
            </div>
            <div class="p-4">
              <div v-if="urgentPets.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PetCard
                  v-for="pet in urgentPets.slice(0, 2)"
                  :key="pet.id"
                  :pet="pet"
                />
              </div>
              <p v-else class="text-sm text-gray-500 text-center py-4">
                No urgent pets at the moment.
              </p>
            </div>
          </div>



          <!-- Recent Donations -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-4 border-b">
              <h2 class="text-lg font-semibold text-gray-800">Recent Donations</h2>
            </div>
            <div class="p-4">
              <ul class="divide-y">
                <li class="py-2 flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium">Sarah Johnson</p>
                    <p class="text-xs text-gray-500">Yesterday</p>
                  </div>
                  <span class="font-semibold text-green-600">$120.00</span>
                </li>
                <li class="py-2 flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium">Anonymous</p>
                    <p class="text-xs text-gray-500">2 days ago</p>
                  </div>
                  <span class="font-semibold text-green-600">$50.00</span>
                </li>
                <li class="py-2 flex justify-between items-center">
                  <div>
                    <p class="text-sm font-medium">Robert Williams</p>
                    <p class="text-xs text-gray-500">3 days ago</p>
                  </div>
                  <span class="font-semibold text-green-600">$75.00</span>
                </li>
              </ul>
              <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex justify-between items-center">
                  <p class="text-sm font-medium">Month Total</p>
                  <p class="text-lg font-bold text-green-600">$1,245.00</p>
                </div>
                <div class="mt-2">
                  <div class="h-2 bg-gray-200 rounded-full">
                    <div class="h-2 bg-green-500 rounded-full" style="width: 45%"></div>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">45% of monthly goal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-6 bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <router-link to="/shelter-dashboard/manage-pets" class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span class="text-sm font-medium">Add New Pet</span>
            </router-link>
            <router-link to="/shelter-dashboard/manage-events" class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span class="text-sm font-medium">Create Event</span>
            </router-link>
            <a href="#" class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-sm font-medium">Generate Report</span>
            </a>
            <a href="#" class="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-gray-50 transition">
              <svg class="w-8 h-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span class="text-sm font-medium">Send Updates</span>
            </a>
          </div>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>

      <!-- Logout Confirmation Modal -->
      <div v-if="logoutModalVisible" class="fixed inset-0 flex items-center justify-center z-50">
        <!-- Modal backdrop with blur effect -->
        <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" @click="hideLogoutConfirmation"></div>
        
        <!-- Modal content -->
        <div class="bg-white rounded-2xl shadow-2xl w-96 p-8 z-10 relative transform transition-all duration-300 ease-in-out scale-100">
          <button @click="hideLogoutConfirmation" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="text-center mb-6">
            <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-50 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Are you sure you want to logout?</h3>
            <p class="text-gray-500 mt-3">You will be redirected to the login page.</p>
          </div>
          
          <div class="flex justify-center space-x-4 mt-8">
            <button 
              @click="hideLogoutConfirmation"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-3xl font-medium hover:bg-gray-200 transition-colors duration-200 border border-gray-200 shadow-sm"
            >
              Cancel
            </button>
            <button 
              @click="confirmLogout"
              class="px-5 py-2.5 bg-red-600 text-white rounded-3xl font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import {fetchShelterPetStats, fetchShelterPets} from '@/services/pet_service.js';
import { getShelterAdoptionRequests } from '@/services/adoption_service';
import PetAdoptionPieChart from '@/components/PetAdoptionPieChart.vue';
import { fetchUpcomingEventsForShelter } from '@/services/event_service';
import PetCard from '@/components/PetCard.vue';

export default {
  name: 'ShelterDashboardLayout',

  components: {
    PetAdoptionPieChart,
    PetCard
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const shelterUsername = ref("Shelter");
    const sidebarOpen = ref(window.innerWidth >= 768); 
    const showNotifications = ref(false);
    const unreadNotifications = ref(3);
    const pendingAdoptionCount = ref(0);
    const logoutModalVisible = ref(false);
    const upcomingEvents = ref([]);
    const urgentPets = ref([]);

    const loadUrgentPets = async () => {
      const shelterId = localStorage.getItem("Id");
      try {
        const pets = await fetchShelterPets(shelterId);
        urgentPets.value = pets.filter(pet => pet.urgentAdoptionNeeded === true);
      } catch (err) {
        console.error("Failed to fetch urgent pets:", err);
        urgentPets.value = [];
      }
    };
    
    const loadUpcomingEvents = async () => {
      const shelterId = localStorage.getItem("Id");
      try {
        upcomingEvents.value = await fetchUpcomingEventsForShelter(shelterId);
      } catch (error) {
        upcomingEvents.value = []; // fallback
      }
    };

    onMounted(() => {
      loadStats();
      loadPendingAdoptionCount();
      loadUpcomingEvents(); 
      loadUrgentPets();
    });

    onBeforeRouteUpdate((to, from, next) => {
      if (to.path === "/shelter-dashboard/") {
        loadStats();
      }
      next();
    });

    const stats = ref({
      total: 0,
      urgent: 0,
      adopted: 0,
      available: 0,
      pending: 0
    });

    const loadPendingAdoptionCount = async () => {
      const shelterId = localStorage.getItem("Id");
      try {
        const allRequests = await getShelterAdoptionRequests(shelterId);
        pendingAdoptionCount.value = allRequests.filter(r => r.status === 'PENDING').length;
      } catch (err) {
        console.error('Failed to load adoption requests:', err);
      }
    };

    const loadStats = async () => {
      const shelterId = localStorage.getItem("Id");
      const data = await fetchShelterPetStats(shelterId);
      if (data) {
        stats.value.total = data.total;
        stats.value.urgent = data.urgent;
        stats.value.adopted = data.adopted;
        stats.value.available = data.available;
        stats.value.pending = data.pending;
      }
    };
    
    const notifications = ref([
      {
        message: "New adoption request for Max",
        time: "A few moments ago",
        icon: {
          bg: "bg-blue-600",
          fill: "none",
          path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        }
      },
      {
        message: "Donation received: $250.00",
        time: "2 hours ago",
        icon: {
          bg: "bg-green-500",
          fill: "none",
          path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      },
      {
        message: "Document approved: Vet Authorization",
        time: "Yesterday",
        icon: {
          bg: "bg-green-500",
          fill: "none",
          path: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        }
      }
    ]);


    const isActive = (path) => {
      if (path === '/shelter-dashboard/' && route.path === '/shelter-dashboard/') {
        return true;
      }
      return path !== '/shelter-dashboard/' && route.path.startsWith(path);
    };


    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };


    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };


    const blockBackButton = () => {
      history.pushState(null, "", location.href);
    };


    const showLogoutConfirmation = () => {
      logoutModalVisible.value = true;
    };

    const hideLogoutConfirmation = () => {
      logoutModalVisible.value = false;
    };

    const confirmLogout = () => {
      localStorage.clear();
      router.push("/login");
    };

    const handleLogout = () => {
      showLogoutConfirmation();
    };


    const handleClickOutside = (event) => {
      if (showNotifications.value && !event.target.closest('.notifications-container')) {
        showNotifications.value = false;
      }
    };


    const handleResize = () => {
      if (window.innerWidth < 768) {
        sidebarOpen.value = false;
      } else {
        sidebarOpen.value = true;
      }
    };

    onMounted(() => {
      const username = localStorage.getItem("Username");
      if (username) {
        shelterUsername.value = username;
      } else {
        console.error("Username not found in localStorage.");
      }

      window.addEventListener('adoption-status-updated', loadPendingAdoptionCount);


      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", blockBackButton);
      
      document.addEventListener('click', handleClickOutside);
      
      window.addEventListener('resize', handleResize);

      window.addEventListener('pet-updated', loadUrgentPets);

      window.addEventListener('event-updated', loadUpcomingEvents);


      handleResize();
    });


    onUnmounted(() => {
      window.removeEventListener("popstate", blockBackButton);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('adoption-status-updated', loadPendingAdoptionCount);
      window.removeEventListener('pet-updated', loadUrgentPets);
      window.removeEventListener('event-updated', loadUpcomingEvents);

    });


    return {
      shelterUsername,
      sidebarOpen,
      showNotifications,
      unreadNotifications,
      notifications,
      isActive,
      toggleSidebar,
      toggleNotifications,
      handleLogout,
      route,
      stats,
      loadStats,
      pendingAdoptionCount,
      logoutModalVisible,
      showLogoutConfirmation,
      hideLogoutConfirmation,
      confirmLogout,
      loadUpcomingEvents,
      upcomingEvents,
      loadUrgentPets,
      urgentPets

    };
  }
};
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dashboard-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>