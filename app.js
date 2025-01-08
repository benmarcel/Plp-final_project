const express = require('express')
const session = require('express-session');

const app = express()
require('dotenv').config()

// setting up middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./public'))

// session management 
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000, // 1 hour
        }
      
}))


// routes 
const patientsRoute = require('./routers/patientroute');
const doctorsRoute = require('./routers/doctorsroute')
const appointmentRoute = require('./routers/appointmentroute')
const adminRoute = require('./routers/adminroute')

// patients route
app.use('/patients', patientsRoute)
app.use('/doctors', doctorsRoute)
app.use('/appointments', appointmentRoute)
app.use('/admin', adminRoute)


const PORT = process.env.PORT || 5000;
app.listen(PORT, (err)=>{
    if (err) {
        console.log(err)
    }
   
    console.log(`server listening on ${PORT}`);
    
})
