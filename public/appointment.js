const appointmentRescheduleDOM = document.querySelector(".reschedule-div");
const appointmentTable = document.querySelector(".appointment-table");
const alertDOM = document.querySelector(".alert");

// alert message
const alert = (message, status) => {
  alertDOM.textContent = message;
  alertDOM.classList.toggle(status);

  setTimeout(() => {
    alertDOM.textContent = "";
    alertDOM.classList.toggle(status);
  }, 3000);
};

// reschedule function
const rescheduleAppoint = async (form, id) => {
  const postData = {
    appointment_date: form["date"].value,
    appointment_time: form["time"].value,
    appointment_id: id,
  };

  try {
    const response = await fetch("/appointments/update", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const serverRes = await response.json();
    const message = serverRes.msg;
    const status = serverRes.status;
    alert(message, status);

    if (response.ok) {
     
      appointmentRescheduleDOM.innerHTML=''
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};

// patients appointment
const getAppointment = async () => {
  try {
    const response = await fetch("/appointments/appointment");
    const serverRes = await response.json();
    console.log(serverRes.data);
    const appointments = serverRes.data;
    if (response.ok) {
      appointmentTable.innerHTML += `<thead>
                    <tr>
                        <th>S/N</th><th>appointment date</th> <th>appointment time</th> <th>Doctors Name</th>
                    </tr>
                </thead>`;
      appointmentTable.innerHTML +=
        appointments && appointments.length > 0
          ? appointments
              .map((appointment, index) => {
                const {
                  appointment_date,
                  appointment_id,
                  appointment_time,
                  doctor_f_name,
                  doctor_l_name,
                } = appointment;
                return `
          <tbody>
              <tr>
                 <td>${
                   index + 1
                 }</td> <td>${appointment_date}</td><td>${appointment_time}</td><td>${doctor_f_name} ${doctor_l_name}</td> <td>
              <button type="button" id="${appointment_id}" class="reschedule-btn">Reschedule</button>   
              <button type="button" id="${appointment_id}" class="cancel-btn">Cancel</button></td>
              </tr>
          </tbody>`;
              })
              .join("")
          : `<h2>You have no appointments</h2>`;

      //   alert message if there is an error
      const message = serverRes.msg;
      alert(message, "failed");

      //   cancel appointment
      const cancelBtns = document.querySelectorAll(".cancel-btn");
      cancelBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("id");
          try {
            const response = await fetch("/appointments/appointment", {
              method: "DELETE",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ appointment_id: id }),
            });
            const message = serverRes.msg;
            const status = serverRes.status;
            alert(message, status);

            if (response.ok) {
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            }
          } catch (error) {
            if (error) {
              console.log(error);
            }
          }
        });
      });

      // reschedule appointment
      const rescheduleBtns = document.querySelectorAll(".reschedule-btn");
      rescheduleBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
         
          const id = e.target.getAttribute("id");
         
          
          appointmentRescheduleDOM.innerHTML = `<form name="reschedule-form" id="reschedule-form" class="reschedule">
            <label for="date">Date</label>
            <input type="date" id="date">
            <label for="time">Time</label>
            <input type="time" name="time" id="time">
            <button type="submit">Reschedule</button>
            <button type="button" class="cancel-reschedule">cancel</button>
        </form>`;


          if (appointmentRescheduleDOM.innerHTML !== "" ) {

            const rescheduleForm = document.forms["reschedule-form"];
            // send new time and date to the server
            rescheduleForm.addEventListener("submit", (e) =>{
              e.preventDefault()
              rescheduleAppoint(rescheduleForm, id)}
            );
            // canceling process if user decide not to reschedule
            document
              .querySelector(".cancel-reschedule")
              .addEventListener("click", () => {
                appointmentRescheduleDOM.innerHTML = "";
              });
          }
        });
      });
    }
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
};
window.onload = getAppointment();
