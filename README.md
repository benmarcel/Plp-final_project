# **gozie-telemed**: Telemedicine Web App

**gozie-telemed** is a telemedicine platform designed to facilitate the management of patients and doctors, including appointment scheduling and profile management. This web app allows patients to register, manage appointments, and update their profiles, while admins can manage doctor profiles and appointments.

## **Table of Contents**

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Technologies Used](#technologies-used)


---

## **Features**

### **Core Features Implementation:**

#### **Patient Management:**
- **Create**: Patients can register and create an account with personal details.
- **Read**: Admins can view a list of all registered patients, with the ability to search and filter.
- **Update**: Patients can update their profile information (e.g., name, contact details, etc.).
- **Delete**: Patients have the ability to delete their accounts, removing their data from the system.

#### **Doctor Management:**
- **Create**: Admins can add new doctors to the platform, including information about their specialization and availability schedules.
- **Read**: A list of doctors is displayed for patients to choose from, showing their specialization and available times.
- **Update**: Doctors or admins can update doctor profiles and schedules as necessary.
- **Delete**: Admins have the option to deactivate or delete doctor profiles from the system.

#### **Appointment Booking:**
- **Create**: Patients can book appointments by selecting a doctor, date, and time slot.
- **Read**: Patients and doctors can view upcoming appointments with a detailed list of scheduled times and statuses.
- **Update**: Patients can reschedule or modify appointments, and doctors can adjust their availability.
- **Delete**: Patients can cancel appointments, with the status updated to “canceled.”

---

## **Installation**

To set up **gozie-telemed** locally, follow these steps:

### Prerequisites:
- Node.js (v14 or higher)
- Mysql or other compatible databases (for persistent data storage)

### Steps:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/benmarcel/Plp-final_project.git
   cd gozie-telemed
   Install Dependencies: Run the following command to install the required dependencies:

bash
Copy code
npm install
Set Up the Environment: Create a .env file in the root directory to store sensitive information (e.g., database connection strings, JWT secrets). Example:

makefile
Copy code
DB_HOST = your_db host
DB_USER= db_username
DB_PASSWORD= your_db_password
DB_NAME= telemedicine 
SESSION_SECRET= your_session secret
PORT= 5000 or any other port of your choice

bash
Copy code
npm start
This will start the app locally on port 5000 or the port of your choice.

Access the Application: Open your browser and go to http://localhost:your_port to access the gozie-telemed application.

Usage
Admin Dashboard: Admin users can log in to view and manage patients, doctors, and appointments. Admins can create, read, update, and delete doctor and patient profiles, as well as manage doctor schedules.

Patient Portal: Patients can create accounts, view doctors, book appointments, and manage their personal information. Patients can also cancel or reschedule their appointments.

Technologies Used
Frontend: HTML, CSS, JavaScript 
Backend: Node.js, Express.js
Database: Mysql
Authentication: JSON Web Tokens (JWT), Session
Other Tools: bcrypt (for password hashing), Postman for testing API
