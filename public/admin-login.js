// DOM alert for feedback 
const alertDOM = document.querySelector('.alert')
const alert = (message, status) =>{
    alertDOM.textContent = message
    alertDOM.classList.toggle(status)

    setTimeout(()=>{
        alertDOM.textContent = ''
        alertDOM.classList.toggle(status) 
    }, 3000)
}
// login admin
const loginForm = document.forms['login-form']

const loginAdmin = async (e) => {
  e.preventDefault()
    const userName = loginForm['login-username'].value;
    const password = loginForm['login-password'].value;
    
        const postData = {
           userName, password
        }

        try {
            const response = await fetch("/admin/login", {
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
              
              setTimeout(() => {
                window.location.href = "./adminHome.html";
               
              }, 2000);
            }
        
          } catch (error) {
            if (error) {
              console.log(error);
            }
          }
}


loginForm.addEventListener('submit', (e)=>{
  loginAdmin(e)
})