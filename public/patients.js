const logoutBtn = document.querySelector(".logout-btn"); // logout button
const welcomeDOM = document.querySelector(".welcome");
const doctorsDOM = document.querySelector(".doctors");
const logOutBtn = document.querySelector(".logout-btn");

// alert message function
const alertDOM = document.querySelector(".alert");
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
    return data.data;
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// welcome a patient
const welcomePatient = async () => {
  const patient = await fetchPatientDetails();
 
  if (patient) {
    welcomeDOM.innerHTML = `Welcome ${patient.first_name}, Get started!`;
  }
};


// Display available doctors
window.addEventListener("DOMContentLoaded", async () => {
  try {
    welcomePatient();
    const response = await fetch("/doctors");
    const data = await response.json();

    if (data) {
      const doctors = data.data.map((doctor) => {
        return `<div class="doctor" >
        <div class="initials">${doctor.first_name[0]}${doctor.last_name[0]}</div>
        <p class="name">Dr ${doctor.first_name} ${doctor.last_name}</p>
        <p class="specialty">${doctor.specialization}</p>
        <p class="schedule"><span>Available:</span> ${doctor.schedule}</p>
        <form name="appointment-form" class="appointment-form" id="${doctor.doctor_id}">
        <label for="date" >Date:</label>
        <input type="date" id ="date" placeholder=" " required>
        <label for="time" >Time:</label>
        <input type="time" id ="time" placeholder=" " required>
        <button type="submit"  class="appointment">Book Appointment</button>
        </form>
      </div>`;
      });
      // Rendering the list of doctors to the DOM
      doctorsDOM.innerHTML = doctors.join("");

      // adding appointment booking functionality
      const appointmentForm = document.querySelectorAll(".appointment-form");
     
      appointmentForm.forEach((form) => {
        
        form.addEventListener("submit", 
          async (e) => {
            e.preventDefault()
          
            const id = e.target.getAttribute("id");
            const date = e.target.querySelector('#date')
            const time = e.target.querySelector('#time')
          const postData = {
            doctor_id: id, 
            appointment_date: date.value, 
            appointment_time: time.value
          }

          // console.log(postData); for debugging purpose
          try {
            const response = await fetch('/appointments/booking', {
              method:'POST',
              headers:{
                "Content-type":"application/json",
              },
              body:JSON.stringify(postData)
            });

            const serverRes = await response.json();
            const message = serverRes.msg;
            const status = serverRes.status;
            alert(message, status)

            if (response.ok) {
              date.value = '';
              time.value = '';
            }
          } catch (error) {
            if (error) {
              console.log(error);
              
            }
          }
          
        });
      });
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

// logout function
const logout = async () => {
  try {
    const response = await fetch("patients/logout");
    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status);

    if (response.ok) {
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 3000);
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// logout patient
logOutBtn.addEventListener("click", logout);

// book appointment
