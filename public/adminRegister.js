const alertDOM = document.querySelector('.alert')
const alert = (message, status) =>{
    alertDOM.textContent = message
    alertDOM.classList.toggle(status)

    setTimeout(()=>{
        alertDOM.textContent = ''
        alertDOM.classList.toggle(status) 
    }, 3000)
}

const registrationForm = document.forms['registration-form']

const registerAdmin = async(e)=>{
  e.preventDefault()
    const userName = registrationForm['username'].value;
    const password = registrationForm['password'].value;
    const role = registrationForm['role'].value;

        const postData = {
           userName, password, role
        }
        console.log(postData);
        
        try {
            const response = await fetch('/admin/register', {
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
             window.location.href = './admin-login.html'
           }, 3000)
            
          }
    
        } catch (error) {
           if (error) {
            console.log(error)
           }
        }
}

registrationForm.addEventListener('submit', (e)=>{
    registerAdmin(e);
})
