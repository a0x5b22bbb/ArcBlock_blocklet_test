<template>
  <div>
    <div v-if="!isEditing">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {{ profile.username }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Phone:</strong> {{ profile.phone }}</p>
      <button @click="editProfile">Edit</button>

      <div>
        <h2>Phone Location Lookup</h2>
        <form @submit.prevent="lookupPhoneLocation">
          <div>
            <label>
              Phone Number:
              <input v-model="editableProfile.phone" type="tel" readonly/>
            </label>
          </div>
          <br />
          <button type="submit">Lookup</button>
        </form>
        <div v-if="phoneLocation">
          <h3>Location Info</h3>
          <p><strong>Province:</strong> {{ phoneLocation.province }}</p>
          <p><strong>City:</strong> {{ phoneLocation.city  || "直辖市"}}</p>
          <p><strong>Carrier:</strong> {{ phoneLocation.sp }}</p>
        </div><br/>
        <div v-if="lookupPhoneError" class="error">{{ lookupPhoneError }}</div>
      </div>
    </div>
    
    <div v-else>
      <h2>Edit Profile</h2>
      <form @submit.prevent="saveProfile">
        <div>
          <label>
            Username:
            <input v-model="editableProfile.username" type="text" :class="{ 'input-error': errors.username }" />
          </label><br/>
          <span v-if="errors.username" class="error">{{ errors.username }}</span>
        </div>
        <br />
        <div>
          <label>
            Email:
            <input v-model="editableProfile.email" type="email" :class="{ 'input-error': errors.email }" />
          </label><br/>
          <span v-if="errors.email" class="error">{{ errors.email }}</span>
        </div>
        <br />
        <div>
          <label>
            Phone:
            <input v-model="editableProfile.phone" type="tel" :class="{ 'input-error': errors.phone }" />
          </label><br/>
          <span v-if="errors.phone" class="error">{{ errors.phone }}</span>
        </div>
        <br />
        <button type="submit">Save</button>
        <button type="button" @click="cancelEdit">Cancel</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../libs/api'
import { object, string } from 'yup'

const profile = ref({
  username: '',
  email: '',
  phone: ''
})

const editableProfile = ref({ ...profile.value })
const isEditing = ref(false)
const error = ref('')
const errors = reactive({
  username: '',
  email: '',
  phone: ''
})

const profileSchema = object({
  username: string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  
  email: string().required('Email is required').email('Email must be valid'),

  phone: string().required('Phone is required').matches(/^1[0-9]{10}$/, 'Phone must be valid, 首数字1开头，一共11位')
})
 

const fetchProfile = async () => {
  try {
    const response = await api.get('/api/profile')
    profile.value = response.data
    editableProfile.value = { ...response.data }
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = 'Failed to load profile data.'
  }
}

const editProfile = () => {
  isEditing.value = true
}

const validateProfile = async () => {
  try {
    await profileSchema.validate(editableProfile.value, { abortEarly: false })
    return true
  } catch (validationErrors) {
    validationErrors.inner.forEach(err => {
      errors[err.path] = err.message
    })
    return false
  }
}

const saveProfile = async () => {
  Object.keys(errors).forEach(key => errors[key] = '') // Clear previous errors

  const isValid = await validateProfile()
  if (!isValid) return

  try {
    await api.put('/api/profile', editableProfile.value)
    profile.value = { ...editableProfile.value }
    isEditing.value = false
    error.value = ''
    lookupPhoneLocation()
  } catch (err) {
    console.error('Error saving profile:', err)
    error.value = err.response?.data?.message || 'Failed to save profile data.'
  }
}

const cancelEdit = () => {
  editableProfile.value = { ...profile.value }
  isEditing.value = false
  error.value = ''
  Object.keys(errors).forEach(key => errors[key] = '') // Clear errors
}


//新增查询手机归属地 
const lookupPhoneError = ref('')
const phoneLocation = ref(null)
const lookupPhoneLocation = async () => {
  lookupPhoneError.value = '';

  if (!profile.value.phone) {
    lookupPhoneError.value = 'Phone number is required';
    return;
  }

  try {
    const response = await api.get(`/api/phone-location?phone=${profile.value.phone}`);
    

    // chrom cache will return 304, it belong to success
    if (response.status === 304 || response.status === 200) {
      if (response.data){
        phoneLocation.value = response.data;
        console.log("This is success",response  )
      } else{
        lookupPhoneError.value = 'Failed to fetch phone location, maybe network ?';
      }
      

    } else {
      console.log("Fail is success",response.data.data, response.data.code)
      lookupPhoneError.value = 'Failed to fetch phone location';
    }
  } catch (err) {
    console.error('Error fetching phone location:', err);
    lookupPhoneError.value = 'Failed to fetch phone location';
  }
}


onMounted(fetchProfile)
</script>

<style scoped>
.error {
  color: red;
}
.input-error {
  border: 1px solid red;
}
/* div > p {
  text-align: left;
  margin: 0;
  padding: 0;
}
form > div {
  text-align: left;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
} */
</style>
