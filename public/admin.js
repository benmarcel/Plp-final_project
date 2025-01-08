const alertDOM = document.querySelector(".alert");
const logOutBtn = document.querySelector("#admin-logout-btn");
const addBtn = document.querySelector(".add-btn");
const formDiv = document.querySelector(".form-div");

const alert = (message, status) => {
  alertDOM.textContent = message;
  alertDOM.classList.toggle(status);

  setTimeout(() => {
    alertDOM.textContent = "";
    alertDOM.classList.toggle(status);
  }, 3000);
};

// get all patients
const getAllPatients = async () => {
  try {
    const response = await fetch("/admin/patients", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });

    const serverRes = await response.json();
    const data = serverRes.data;
    console.log(data);

    const patientTable = document.querySelector(".table-body");
    if (data) {
      patientTable.innerHTML =
        data.length > 0
          ? data
              .map((patient, index) => {
                const {
                  first_name,
                  last_name,
                  email,
                  gender,
                  phone,
                  date_of_birth,
                } = patient;
                const date = new Date(date_of_birth);
                const dob = date.toDateString();
                return `
              <tr>
                 <td>${index + 1}</td> 
                 <td>${first_name}</td>
                 <td>${last_name}</td>
                 <td>${email}</td>
                 <td>${gender}</td> 
                 <td>${phone}</td>
                 <td>${dob}</td>
              </tr>`;
              })
              .join("")
          : `<h2>No available Patients</h2>`;
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// deactivate or delete doctor
const deleteDoctor = async (data) => {
  try {
    const response = await fetch("/doctors/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status);
    if (response.ok) {
      getAllDoctors();
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// update doctor func
const updateDoctor = async (postData) => {
  try {
    const response = await fetch("/doctors/update", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status);
    if (response.ok) {
      getAllDoctors();
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// open the form function
const openForm = (name, title) => {
  formDiv.classList.remove("hidden");
  formDiv.innerHTML = `<form class="${name}" name="${name}">
            <h2>${title}</h2>
            <input type="text" id="first-name" placeholder=" " /><label
              for="first-name"
              >first name</label
            >
            <input type="text" id="last-name" placeholder=" " /><label
              for="last-name"
              >last name</label
            >
            <input type="email" id="email" placeholder=" " /><label for="email"
              >Email</label
            >
            <input type="text" id="Specialty" placeholder=" " /><label
              for="Specialty"
              >Specialty</label
            >
            <input type="number" id="phone" placeholder=" " /><label
              for="phone"
              >phone</label
            >
            <input type="text" id="Schedule" placeholder=" " /><label
              for="Schedule"
              >Schedule</label
            >
            <div>
              <button type="submit" id="${name}">${name}</button
              ><button type="button" id="cancel">cancel</button>
            </div>
          </form>`;
};

// close the form function
const closeForm = () => {
  formDiv.classList.add("hidden");
  formDiv.innerHTML = "";
};

// display doctors
const getAllDoctors = async () => {
  try {
    const doctorsRes = await fetch("/doctors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const serverRes = await doctorsRes.json();
    const data = serverRes.data;
    // console.log(data); for debugging purpose
    const doctorsTable = document.querySelector(".doctors-body");
    if (data) {
      doctorsTable.innerHTML =
        data.length > 0
          ? data
              .map((doctor, index) => {
                const {
                  first_name,
                  last_name,
                  email,
                  specialization,
                  doctor_id,
                  phone,
                  schedule,
                } = doctor;

                return `
              <tr>
                 <td>${index + 1}</td> 
                 <td>${first_name}</td>
                 <td>${last_name}</td>
                 <td>${email}</td>
                 <td>${specialization}</td> 
                 <td>${schedule}</td> 
                 <td>${phone}</td> 
                <td> <button type="button" id="${doctor_id}" class="update-btn">Update</button>
                <button type="button" id="${doctor_id}" class = "delete-btn">Delete</button> </td>
              </tr>`;
              })
              .join("")
          : `<h2>No available doctors</h2>`;

      // delete or deactivate doctor
      const deleteBtns = document.querySelectorAll(".delete-btn");
      if (deleteBtns) {
        deleteBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");
            const data = { doctorID: id };
            console.log(id);
            if (data) {
              deleteDoctor(data);
            }
          });
        });
      }

      // update doctors info
      const updateBtns = document.querySelectorAll(".update-btn");
      if (updateBtns) {
        updateBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("id");

            // opening update form
            openForm("update", "Update Info");

            // select form
            const form = document.forms["update"];

            // cancel the process
            form['cancel'].addEventListener('click', closeForm)

            const index = data.findIndex((obj)=> obj.doctor_id == id)
            console.log(index);
            const {
              first_name,
              last_name,
              email,
              specialization,
              doctor_id,
              phone,
              schedule,
            } = data[index]
            form["first-name"].value = first_name;
            form["last-name"].value = last_name;
            form["email"].value = email;
            form["Specialty"].value = specialization;
            form["phone"].value = phone;
            form["Schedule"].value = schedule;
            
            // submit update
            form.addEventListener('submit', (e)=>{
              e.preventDefault()
              const postData = {
                doctor_id: id,
                first_name: form["first-name"].value,
                last_name: form["last-name"].value,
                email: form["email"].value,
                specialization: form["Specialty"].value,
                phone: form["phone"].value,
                schedule: form["Schedule"].value,
              };
              
  
              updateDoctor(postData);
              closeForm()
            })
          });
        });
      }
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

const getAppointments = async () => {
  try {
    const appointmentsRes = await fetch("/appointments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });
    const serverRes = await appointmentsRes.json();
    const data = serverRes.data;
    console.log(data);
    const appointmentsTable = document.querySelector(".appointments-body");
    if (data) {
      appointmentsTable.innerHTML =
        data.length > 0
          ? data
              .map((appointment, index) => {
                const {
                  appointment_date,
                  appointment_time,
                  doctor_f_name,
                  doctor_l_name,
                  patient_f_name,
                  patient_l_name,
                  status
                } = appointment;

                return `
              <tr>
                 <td>${index + 1}</td> 
                 <td>${patient_f_name} ${patient_l_name}</td>
                 <td>${doctor_f_name} ${doctor_l_name}</td>
                 <td>${appointment_date}</td>
                 <td>${appointment_time}</td> 
                 <td>${status}</td>
              </tr>`;
              })
              .join("")
          : `<h2>No available appointments</h2>`}
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// add new doctor
const addDoctor = async (postData) => {
  try {
    const response = await fetch("/admin/doctor", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status);
    if (response.ok) {
      getAllDoctors();
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// logout admin
const logout = async () => {
  try {
    const response = await fetch("patients/logout");
    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status);

    if (response.ok) {
      setTimeout(() => {
        window.location.href = "./admin-login.html";
      }, 3000);
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

addBtn.addEventListener("click", () => {
  // open form
  openForm("add", "Add New Doctor");

  // select form
  const form = document.forms['add'];

  // cancel the process
  form['cancel'].addEventListener('click', closeForm);
  
  // submit form
  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    const postData = {
      first_name: form["first-name"].value,
      last_name: form["last-name"].value,
      email: form["email"].value,
      specialization: form["Specialty"].value,
      phone: form["phone"].value,
      schedule: form["Schedule"].value,
    }

    if (postData) {
      addDoctor(postData)
      closeForm()
    }
  })


});

// log out admin
logOutBtn.addEventListener("click", logout);

window.addEventListener("DOMContentLoaded", () => {
  getAllPatients();
  getAllDoctors();
  getAppointments();
});
