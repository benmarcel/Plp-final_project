
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

// patient login
const loginForm = document.forms["login-form"]; // patient's login form
const patientEmail = loginForm["email"];
const patientPassword = loginForm["password"];


// login event
const patientLogin = ()=>{
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const postData = {
      email: patientEmail.value,
      password: patientPassword.value,
    }
    // console.log(postData); for debugging purpose
    
    try {
      const response = await fetch("/patients/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(postData)
      });
      const serverRes = await response.json();
      const message = serverRes.msg;
      const status = serverRes.status;
      alert(message, status);
    
     
      
      if (response.ok) {
        patientEmail.value = "";
        patientPassword.value = "";
        setTimeout(() => {
          window.location.href = "./patients.html";
         
        }, 2000);
      }
  
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  });
}

patientLogin() // calling the patient login function
console.log(patientPassword.value, patientEmail.value);

