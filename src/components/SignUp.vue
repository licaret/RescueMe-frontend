<template>
    <section class="bg-white dark:bg-gray-900">
      <div class="min-h-screen flex flex-col items-center px-6 py-8 pb-16 mx-auto lg:py-0 lg:pb-16">
        <div class="w-full pt-8">
          <div class="flex justify-center space-x-4 mb-6">
            <button
              :class="{
                'text-red-600 font-bold': isAdopter,
                'text-gray-500': !isAdopter
              }"
              @click="isAdopter = true"
              class="text-sm md:text-base"
            >
              Adopter
            </button>
            <button
              :class="{
                'text-red-600 font-bold': !isAdopter,
                'text-gray-500': isAdopter
              }"
              @click="isAdopter = false"
              class="text-sm md:text-base"
            >
              Shelter
            </button>
          </div>
      
          <div class="w-full bg-white rounded-lg shadow dark:border sm:max-w-md mx-auto xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 pb-12 space-y-4 md:space-y-6 sm:p-8 sm:pb-12">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-700 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <!-- Adopter Form -->
              <form v-if="isAdopter" @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6 mb-8">
                <div>
                  <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input v-model="formData.username" type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your username" required="true">
                </div>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input v-model="formData.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="true">
                </div>
                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input v-model="formData.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                </div>
                <div>
                  <label for="phone-number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                  <input v-model="formData.phoneNumber" type="tel" name="phone-number" id="phone-number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+40 xxx xxx xxx" required="true">
                </div>
                
                <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Adopter Account</button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <a href="#" class="font-medium text-red-600 hover:underline dark:text-primary-500">Login here</a>
                </p>
              </form>
              <!-- Shelter Form -->
              <form v-else @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6 mb-8">
                <div>
                  <label for="shelter-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                  <input v-model="formData.username" type="text" name="shelter-name" id="shelter-name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Shelter's Name" required="true">
                </div>
                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input v-model="formData.email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="shelter@domain.com" required="true">
                </div>
                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input v-model="formData.password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                </div>
                <div>
                  <label for="phone-number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                  <input v-model="formData.phoneNumber" type="tel" name="phone-number" id="phone-number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+40 xxx xxx xxx" required="true">
                </div>
                <div>
                  <label for="county" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">County</label>
                  <select v-model="selectedCounty" @change="updateCities" id="county" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                    <option value="">Select County</option>
                    <option v-for="county in counties" :key="county" :value="county">{{ county }}</option>
                  </select>
                </div>
                <div>
                  <label for="city" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                  <select v-model="selectedCity" id="city" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true" :disabled="!selectedCounty">
                    <option value="">Select City</option>
                    <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
                  </select>
                </div>
                <div>
                  <label for="shelter-type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Shelter Type</label>
                  <select v-model="selectedShelterType" id="shelter-type" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="true">
                    <option value="">Select Shelter Type</option>
                    <option v-for="type in shelterTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>
                <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                      </div>
                      <div class="ml-3 text-sm">
                        <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-red-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                      </div>
                </div>
                <button type="submit" class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create Shelter Account</button>
                <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <a href="#" class="font-medium text-red-600 hover:underline dark:text-primary-500">Login here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script>
import { registerAdopter, registerShelter } from "@/services/user_service";

export default {
  data() {
    return {
      isAdopter: true,
      formData: {
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
      },
      selectedCounty: '',
      selectedCity: '',
      selectedShelterType: '',
      counties: [
        'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud', 'Botoșani', 'Brăila',
        'Brașov', 'București', 'Buzău', 'Călărași', 'Caraș-Severin', 'Cluj', 'Constanța',
        'Covasna', 'Dâmbovița', 'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
        'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș', 'Neamț', 'Olt',
        'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu', 'Suceava', 'Teleorman', 'Timiș', 'Tulcea',
        'Vâlcea', 'Vaslui', 'Vrancea'
      ],
      citiesByCounty: {
        "Alba": ["Alba Iulia", "Blaj", "Cugir", "Ocna Mureș", "Sebeș", "Teiuș", "Zlatna"],
        "Arad": ["Arad", "Chișineu-Criș", "Curtici", "Ineu", "Lipova", "Nădlac", "Pecica", "Sântana", "Sebis"],
        "Argeș": ["Pitești", "Câmpulung", "Costești", "Curtea de Argeș", "Mioveni", "Ștefănești", "Topoloveni"],
        "Bacău": ["Bacău", "Comănești", "Dărmănești", "Moinești", "Onești", "Slănic-Moldova", "Târgu Ocna"],
        "Bihor": ["Oradea", "Alesd", "Beiuș", "Marghita", "Salonta", "Săcueni", "Ștei", "Valea lui Mihai", "Vașcău"],
        "Bistrița-Năsăud": ["Bistrița", "Beclean", "Năsăud", "Sângeorz-Băi"],
        "Botoșani": ["Botoșani", "Bujoreni", "Darabani", "Flămânzi", "Ștefănești", "Dorohoi"],
        "Brăila": ["Brăila", "Făurei", "Ianca", "Însurăței"],
        "Brașov": ["Brașov", "Codlea", "Făgăraș", "Ghimbav", "Predeal", "Râșnov", "Rupea", "Săcele", "Victoria", "Zărnești"],
        "București": ["Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6"],
        "Buzău": ["Buzău", "Nehoiu", "Pătârlagele", "Pogoanele", "Râmnicu Sărat"],
        "Călărași": ["Călărași", "Budești", "Fundulea", "Lehliu Gară", "Oltenița"],
        "Caraș-Severin": ["Reșița", "Anina", "Băile Herculane", "Bocșa", "Caransebeș", "Moldova Nouă", "Oțelu Roșu", "Oravița"],
        "Cluj": ["Cluj-Napoca", "Câmpia Turzii", "Dej", "Gherla", "Huedin", "Turda"],
        "Constanța": ["Constanța", "Băneasa", "Cernavodă", "Eforie", "Hârșova", "Mangalia", "Medgidia", "Murfatlar", "Năvodari", "Negru Vodă", "Ovidiu", "Techirghiol"],
        "Covasna": ["Sfântu Gheorghe", "Baraolt", "Covasna", "Târgu Secuiesc", "Întorsura Buzăului"],
        "Dâmbovița": ["Târgoviște", "Fieni", "Găești", "Morenii", "Pucioasa", "Răcari", "Titu"],
        "Dolj": ["Craiova", "Băilești", "Bechet", "Calafat", "Dăbuleni", "Filiași", "Segarcea"],
        "Galați": ["Galați", "Berești", "Târgu Bujor", "Tecuci"],
        "Giurgiu": ["Giurgiu", "Bolintin Vale", "Mihăilești"],
        "Gorj": ["Târgu Jiu", "Bumbești-Jiu", "Motru", "Novaci", "Rovinari", "Târgu Cărbunești", "Tismana", "Țicleni", "Turceni"],
        "Harghita": ["Miercurea Ciuc", "Bălan", "Borsec", "Cristuru Secuiesc", "Gheorgheni", "Odorheiu Secuiesc", "Vlăhița", "Toplița"],
        "Hunedoara": ["Deva", "Aninoasa", "Brad", "Călan", "Geoagiu", "Hațeg", "Hunedoara", "Lupeni", "Orăștie", "Petrila", "Petroșani", "Simeria", "Uricani", "Vulcan"],
        "Ialomița": ["Slobozia", "Amara", "Căzănești", "Fetești", "Fierbinți-Târg", "Țăndărei", "Urziceni"],
        "Iași": ["Iași", "Hârlău", "Pașcani", "Podu Iloaiei", "Târgu Frumos"],
        "Ilfov": ["Bragadiru", "Buftea", "Chitila", "Măgurele", "Otopeni", "Pantelimon", "Popești-Leordeni", "Voluntari"],
        "Maramureș": ["Baia Mare", "Borșa", "Cavnic", "Dragomirești", "Săliștea de Sus", "Seini", "Sighetu Marmației", "Târgu Lăpuș", "Ulmeni", "Vișeu de Sus"],
        "Mehedinți": ["Drobeta-Turnu Severin", "Baia de Aramă", "Orșova", "Strehaia", "Vânju Mare"],
        "Mureș": ["Târgu Mureș", "Iernut", "Luduș", "Reghin", "Sărmașu", "Sângeorgiu de Pădure", "Sovata", "Târnăveni"],
        "Neamț": ["Piatra Neamț", "Bicaz", "Roman", "Roznov", "Târgu Neamț"],
        "Olt": ["Slatina", "Balș", "Caracal", "Corabia", "Drăgănești-Olt", "Piatra-Olt", "Potcoava", "Scornicești"],
        "Prahova": ["Ploiești", "Azuga", "Băicoi", "Boldești-Scăeni", "Breaza", "Bușteni", "Comarnic", "Mizil", "Plopeni", "Sinaia", "Slănic", "Urlați", "Vălenii de Munte"],
        "Sălaj": ["Zalău", "Cehu Silvaniei", "Jibou", "Șimleu Silvaniei"],
        "Satu Mare": ["Satu Mare", "Ardud", "Carei", "Livada", "Tășnad", "Negrești-Oaș"],
        "Sibiu": ["Sibiu", "Agnita", "Avrig", "Cisnădie", "Copșa Mică", "Dumbrăveni", "Miercurea Sibiului", "Ocna Sibiului", "Săliște", "Tălmaciu"],
        "Suceava": ["Suceava", "Cajvana", "Dolhasca", "Fălticeni", "Frasin", "Gura Humorului", "Liteni", "Milișăuți", "Rădăuți", "Siret", "Solca", "Vicovu de Sus", "Vatra Dornei"],
        "Teleorman": ["Alexandria", "Roșiorii de Vede", "Turnu Măgurele", "Zimnicea", "Videle"],
        "Timiș": ["Timișoara", "Buziaș", "Ciacova", "Deta", "Făget", "Gătaia", "Jimbolia", "Recaș", "Sânnicolau Mare"],
        "Tulcea": ["Tulcea", "Babadag", "Isaccea", "Măcin", "Sulina"],
        "Vâlcea": ["Râmnicu Vâlcea", "Băbeni", "Băile Olănești", "Bălcești", "Berbești", "Brezoi", "Călimănești", "Drăgășani", "Horezu", "Ocnele Mari"],
        "Vaslui": ["Vaslui", "Bârlad", "Huși", "Murgeni"],
        "Vrancea": ["Focșani", "Adjud", "Mărășești", "Odobești", "Panciu"]
      },
      shelterTypes: [
        'Municipal Shelter',
        'Private Shelter',
        'Rescue Organization',
        'Foster-based Rescue',
        'Sanctuary',
        'Veterinary Clinic with Shelter',
        'Specialized Shelter (specific breeds/species)',
        'Emergency/Temporary Shelter'
      ]
    };
  },
  computed: {
    availableCities() {
      return this.selectedCounty ? (this.citiesByCounty[this.selectedCounty] || []) : [];
    }
  },
  methods: {
    updateCities() {
      this.selectedCity = '';
    },
    async handleSubmit() {
        try {
            if (this.isAdopter) {
                const response = await registerAdopter({
                    username: this.formData.username,
                    email: this.formData.email,
                    phoneNumber: this.formData.phoneNumber,
                    password: this.formData.password,
                });
                alert(response.message); 
            } else {
                const response = await registerShelter({
                    username: this.formData.username,
                    email: this.formData.email,
                    phoneNumber: this.formData.phoneNumber,
                    password: this.formData.password,
                    county: this.selectedCounty,
                    city: this.selectedCity,
                    shelterType: this.selectedShelterType,
                });
                alert(response.message); 
            }
        } catch (error) {
            alert("Registration failed: " + error.message);
        }
    },
  },
};
</script>

<style scoped>
</style>