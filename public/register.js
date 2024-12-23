
const form = document.forms['registration-form'] // registration form
console.log(form); // for debugging purpose

// getting patient's data
const selectedGender = form['gender'];
const firstName = form['first_name'];
const lastName = form['last_name'];
const dateOfBirth = form['dob'];
const email = form['email'];
const password = form['password'];
const phone = form['phone'];
const address = form['address'];

// alert message function
const alertDOM = document.querySelector('.alert')
const alert = (message, status) =>{
    alertDOM.textContent = message
    alertDOM.classList.toggle(status)

    setTimeout(()=>{
        alertDOM.textContent = ''
        alertDOM.classList.toggle(status) 
    }, 3000)
}

// // form validation
const validateEmail = (email) =>{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(emailRegex.test(email)){}
}

// patient registration
form.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const postData = {
        first_name:firstName.value,
        last_name:lastName.value,
        gender:selectedGender.value,
        email:email.value,
        password:password.value,
        phone:phone.value,
        address:address.value,
        dob:dateOfBirth.value

    }
    
    try {
        const response = await fetch('/patients/register', {
            method:'POST',
            headers:{
                'Content-type':'application/json',
            },
            body: JSON.stringify(postData)
        })
        const serverRes = await response.json()
        const message = serverRes.msg;
        const status = serverRes.status;
        alert(message, status)
      if(response.ok){
       setTimeout(()=> {
         window.location.href = './login.html'
       }, 3000)
        
      }

    } catch (error) {
        console.log(error)
    }
    
})



