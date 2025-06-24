<template>
    <AlertDialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
      <AlertDialogContent class="bg-white rounded-lg shadow-lg sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-xl font-semibold text-gray-900">
            {{ title }}
          </AlertDialogTitle>
          <AlertDialogDescription class="mt-2 text-sm text-gray-500">
            {{ description }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter class="mt-6 flex gap-3">
          <AlertDialogCancel 
            class="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            @click="handleCancel"
          >
            {{ cancelButtonText }}
          </AlertDialogCancel>
          
          <AlertDialogAction 
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            @click="handleConfirm"
          >
            {{ confirmButtonText }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </template>
  
  <script>
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog";
  
  export default {
    name: "ConfirmationModal",
    components: {
      AlertDialog,
      AlertDialogContent,
      AlertDialogHeader,
      AlertDialogFooter,
      AlertDialogTitle,
      AlertDialogDescription,
      AlertDialogAction,
      AlertDialogCancel,
    },
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: "Delete Pet"
      },
      description: {
        type: String,
        default: "Are you sure you want to delete this pet? This action cannot be undone."
      },
      confirmButtonText: {
        type: String,
        default: "Yes, delete it"
      },
      cancelButtonText: {
        type: String,
        default: "Cancel"
      }
    },
    emits: ['confirm', 'cancel', 'update:isOpen'],
    
    setup(_, { emit }) {
      const handleConfirm = () => {
        emit('confirm');
        emit('update:isOpen', false);
      };
  
      const handleCancel = () => {
        emit('cancel');
        emit('update:isOpen', false);
      };
  
      return {
        handleConfirm,
        handleCancel
      };
    }
  };
  </script>