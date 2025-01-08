
const alertDOM = document.querySelector(".alert");
const profileDOM = document.querySelector('.profile-container')
const nameDOM = document.querySelector('.name')
const emailDOM = document.querySelector('.email')
const phoneDOM = document.querySelector('.phone')
const addressDOM = document.querySelector('.address')
const genderDOM = document.querySelector('.gender')
const dobDOM = document.querySelector('.dob')
const initialsDom = document.querySelector('.profile-div')
const updateForm = document.forms['update-profile'];
const editBtn = document.querySelector('.edit-btn')
const deleteBtn = document.querySelector('.delete-btn')

const alert = (message, status) => {
  alertDOM.textContent = message;
  alertDOM.classList.toggle(status);

  setTimeout(() => {
    alertDOM.textContent = "";
    alertDOM.classList.toggle(status);
  }, 3000);
};

// fetching patient details
const fetchPatientDetails = async () => {
  try {
    const response = await fetch("/patients/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const data = await response.json();
    const {first_name, last_name, email, phone, date_of_birth, gender, address} = data.data;
    const date = new Date(date_of_birth);
    const dob = date.toDateString();

    // displaying patient profile
    initialsDom.textContent = `${first_name[0]}${last_name[0]}`.toUpperCase() // patients initials
    nameDOM.textContent = `${first_name} ${last_name}`; //patient name
    emailDOM.textContent  = email; // patient email
    phoneDOM.textContent  = phone; // patient phone number
    addressDOM.textContent  = address; // patient address
    genderDOM.textContent = gender; // patient gender
    dobDOM.textContent = dob; //patient's date of birth

    // update profile
   
    updateForm['f-name'].value = first_name;
    updateForm['l-name'].value = last_name
    updateForm['gender'].value = gender;
    updateForm['phone'].value = phone;
    updateForm['address'].value = address;
    updateForm['dob'].value = date_of_birth
    
    
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// fetching patient's profile
window.addEventListener("DOMContentLoaded", fetchPatientDetails);

// edit-btn
const formDiv = document.querySelector('.form-div')
editBtn.addEventListener("click", ()=>{
updateForm.classList.remove('hidden');
formDiv.classList.remove('hidden')
})

// cancel-btn event
updateForm['cancel-btn'].addEventListener("click", ()=>{
  updateForm.classList.add('hidden')
  formDiv.classList.add('hidden')
  fetchPatientDetails()
  })

// update profile
updateForm.addEventListener('submit', async(e)=>{
  e.preventDefault()

  const putData = {
  first_name:  updateForm['f-name'].value,
  last_name: updateForm['l-name'].value ,
  phone: updateForm['phone'].value,
  address: updateForm['address'].value,
  dob: updateForm['dob'].value,
  gender: updateForm['gender'].value
  }
  // console.log(putData);
  try {
    const response = await fetch('/patients/profile/update', {
      method:"PATCH",
      headers:{
        "Content-type":"application/json",
      },
    body: JSON.stringify(putData) }

  )
  const serverRes = await response.json();
  const message = serverRes.msg;
  const status = serverRes.status;
  alert(message, status)
  if (response.ok) {
    formDiv.classList.add('hidden')
    updateForm.classList.add('hidden')
    fetchPatientDetails()
  }
  } catch (error) {
    if (error) {
     console.log(error);
      
    }
  }
  
})

// DELETE patient account
const deletePatientAcc = async()=>{
try {
  let userResponse = confirm('Are you sure you want to delete your account? this cannot be undone.')
  if (userResponse) {
    const response = await fetch('/patients/delete', {
      method:'DELETE',
      headers:{
        "Content-type":"application/json",
      },
    });
    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status)

    if (response.ok) {
      setTimeout(()=>{
        window.location.href = './login.html'
      }, 2000)
    }
    
  }else{
    return
  }
} catch (error) {
  if (error) {
    console.log(error);
    
  }
}
}
deleteBtn.addEventListener('click', deletePatientAcc)