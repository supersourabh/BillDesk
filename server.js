const express = require("express")
const app = express()
const cors = require("cors")
const dateTime = require("date-and-time")
const path = require("path")
const fs = require("fs")
const mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost', //mysql database name
    user: 'root', //mysql database username
    password: 'Sourabh@2000', //mysql database password
    database: '' //mysql database name
});


connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected...')
})

app.use(express.json())

app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

app.set("views", "./views")
app.set("view engine", "ejs")

//database connection
//dummy data
const today = new Date();
let date = dateTime.format(today, 'DD/MM/YYYY');
let i = 2
let employees = [
    {
        eId: 1,
        name: "sourabh sk",
        department: "security",
        address: "Ap:karoshi belagavi",
        mobile: "6362579248",
        mail: "kotagisourabh81@yahoo.com",
        country: "india",
        joined: "23/09/2018",
        tasksCompleted: 12,
        employer: true

    },
    {
        eId: 2,
        name: "sourabh k",
        department: "security",
        address: "Ap:belagavi",
        mobile: "6362579248",
        mail: "kotagisourabh81@gmail.com",
        country: "india",
        joined: "16/05/2021",
        tasksCompleted: 9,
        employer: false
    },
    {
        eId: 3,
        name: "Mohan m",
        department: "server maintanance",
        address: "bengaluru-01",
        mobile: "6362579248",
        mail: "mohanm@gmail.com",
        country: "india",
        joined: "03/01/2022",
        tasksCompleted: 2,
        employer: false
    },
    {
        eId: 4,
        name: "sohan s",
        department: "loading screen",
        address: "bengaluru-01",
        mobile: "6362579248",
        mail: "sohan.s@gmail.com",
        country: "india",
        joined: "22/01/2012",
        tasksCompleted: 200,
        employer: false
    },
    {
        eId: 5,
        name: "guru d",
        department: "server maintanance",
        address: "bengaluru-01",
        mobile: "6362579248",
        mail: "guru@gmail.com",
        country: "india",
        joined: "03/06/2021",
        tasksCompleted: 2,
        employer: false
    },
    {
        eId: 6,
        name: "vinod m",
        department: "memory manage",
        address: "bengaluru-01",
        mobile: "6362579248",
        mail: "vinod.m@gmail.com",
        country: "india",
        joined: "13/05/2019",
        tasksCompleted: 50,
        employer: false
    }
]


let tasks = [
    {
        tId: 1,
        name: "memory manage",
        lastDate: date,
        discription: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        status: "pending",
        manager: "mahesh m",
        assigned: "Not assigned"
    },
    {
        tId: 2,
        name: "security",
        lastDate: date,
        discription: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        status: "pending",
        manager: "pratham p",
        assigned: "Not assigned"
    },
    {
        tId: 3,
        name: "loading screen",
        lastDate: date,
        discription: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        status: "pending",
        manager: "mahesh m",
        assigned: "1"
    },
    {
        tId: 4,
        name: "security",
        lastDate: date,
        discription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi fugiat voluptates ipsum sunt minus, soluta esse? Molestias itaque laborum iusto aut quas id illo totam explicabo autem alias? Ducimus, natus!Some quick example text to build on the card title and make up the bulk of the card's content.",
        status: "complete",
        manager: "sourabh sk",
        assigned: "2"
    },
    {
        tId: 5,
        name: "server maintanance",
        lastDate: date,
        discription: "Some quick example text to build on the card title and make up the bulk of the card's content.",
        status: "pending",
        manager: "sourabh sk",
        assigned: "Not assigned"
    }
]

app.get("/run", (req, res) => {
    //to insert record into mysql
    for (let i = 0; i < employees.length; i++) {

        connection.query(`INSERT INTO 'employee' ('eId', 'name', 'department', 'address','mobile' ,'mail' ,'country','joined','tasksCompleted','employeer') VALUES (${employees[i].eId}, '${employees[i].name}' , '${employees[i].department}' , '${employees[i].address}',${employees[i].mobile},'${employees[i].mail}','${employees[i].country}','${date}',${employees[i].tasksCompleted},${employees[i].employer})`, function (error, results, fields) {
            if (error) throw error;
            console.log('The response is: ', results);
        });
    }   
    res.send(JSON.stringify(connection.query("select * from  'employee'")))
})


//home
app.get("/", (req, res) => {

    res.render("demo")

})


//login
app.post("/", async (req, res) => {
    const eId = req.body.password
    const name = req.body.username
    try {

        let logdata = employees.find(e => e.name == name && `${e.eId}` == eId)
        if (logdata) {
            if (logdata.employer == true) {
                res.redirect(`/employeer/tasks/${logdata.eId}`)
            }
            else {
                res.redirect(`/employee/${eId}/findTask`)

            }
        }

    } catch (error) {
        res.render("error", { error })

    }

})


app.post("/login", async (req, res) => {
    const eId = req.body.password
    const name = req.body.username
    try {

        let logdata = employees.find(e => e.name == name && `${e.eId}` == eId)
        if (logdata) {
            if (logdata.employer == true) {
                res.redirect(`/employeer/tasks/${logdata.eId}`)
            }
            else {
                res.redirect(`/employee/${eId}/findTask`)

            }
        }

    } catch (error) {
        res.render("error", { error: error })

    }
})


//employee details 

app.get("/employee/:eId/findTask", async (req, res) => {
    const eId = req.params.eId
    const resultTasks = tasks.filter(t => t.assigned === eId)
    const emp = employees.find(t => `${t.eId}` === eId)

    res.render("employee-details", { data: resultTasks, emp: emp },);

})

//employeer tasks

app.get("/employeer/tasks/:id", (req, res) => {
    const eId = req.params.id;
    let employeer = employees.find(a => `${a.eId}` === eId)
    let employeerTasks = tasks.filter(a => a.manager === employeer.name)
    res.render("employeeTask", { tasks: tasks, employeer: employeer, emps: employees, employerId: eId })

})

//assigning route

app.get("/employer/task/assign/:tId/:eId/:emplId", async (req, res) => {
    try {
        const tId = req.params.tId;
        const eId = req.params.eId;
        const emplrId = req.params.emplId;
        const assignedTask = tasks.find(e => `${e.tId}` === tId)
        assignedTask.assigned = eId;

        res.redirect(`/employeer/tasks/${emplrId}`)

    } catch (error) {
        console.log(error);
        res.redirect("/error")
    }

})




//task data to assign

app.get("/taskData/:tId/:emplrID", async (req, res) => {
    const tId = req.params.tId
    const emplrId = req.params.emplrID

    const task = tasks.find(e => `${e.tId}` === tId)
    const emp = employees.filter(e => e.department === task.name)
    const empSorted = emp.sort((a, b) => a.tasksCompleted > b.tasksCompleted)

    res.render("taskHandle", { task: task, emp: empSorted, emplrId: emplrId });


})


//edit employee details

app.get("/employer/edit/:eId/:emplrId", async (req, res) => {

    const eId = req.params.eId;
    const emplrId = req.params.emplrId;
    let emp = employees.find(e => `${e.eId}` === eId)

    res.render("editEmp", { emp: emp, emplrId: emplrId });

})

//getting data for edit
app.post("/employer/edit", async (req, res) => {

    try {
        const emplrId = req.body.employerId
        const emp = employees.find(e => `${e.eId}` === req.body.empId)

        emp.name = req.body.empName
        emp.department = req.body.empDepartment
        emp.address = req.body.empAddress
        emp.mobile = req.body.empMobile
        emp.mail = req.body.empMail
        emp.country = req.body.empCountry


        res.redirect(`/employeer/tasks/${emplrId}`)

    } catch (err) {
        console.log(err);
        res.redirect(`/error`)
    }




})

//add employee details post(get data)

app.post("/employer/add/", async (req, res) => {
    try {
        const newEmployee =
        {
            eId: ++i,
            name: req.body.empName,
            department: req.body.empDepartment,
            address: req.body.empAddress,
            mobile: req.body.empMobile,
            mail: req.body.empMail,
            country: req.body.empCountry,
            joined: date,
            tasksCompleted: 0,
            employeer: false,

        }


        employees.push(newEmployee)
        console.log(i);
        res.redirect(`/employeer/tasks/${req.body.employerId}`)

    } catch (error) {

        res.status(500).render("error", { error: error.message })
    }
})

//add employee details get(push template)

app.get("/employer/add/:eplrId", async (req, res) => {

    const id = req.params.eplrId
    res.render("empAdd", { empId: id })
})


//delete employee details
app.get("/employer/delete/:empId/:emplrId", async (req, res) => {

    const emplrId = req.params.emplrId
    const empId = req.params.empId
    try {
        employees.pop(e => `${e.eId}` === empId)
        res.redirect(`/employeer/tasks/${emplrId}`)
    } catch (error) {
        res.status(500).redirect("/error", { error: error })
    }



})

//employee details display
//task distribute employee display




app.get("/error", (req, res) => {
    try {
        console.log(sfsf);
    } catch (error) {

        res.render("error", { error: error })
    }
})



app.listen(4000, () => console.log("server started at http://localhost:4000"))