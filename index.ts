import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import { check, validationResult } from 'express-validator';
import mysql from 'mysql';


var app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());


// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(express.urlencoded({extended: false}))
app.use(express.json())


 var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user : 'root',
    password: 'password@123',
    database : 'DRIVERDB',
    multipleStatements: true

});



mysqlConnection.connect((err) => {
    if(!err)
           console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' +
JSON.stringify(err, undefined, 2));

});


//Get by id 
   app.get('/drivers/:driverId',  async (req, res) => {
           mysqlConnection.query('SELECT * FROM Driver WHERE DriverID =?', [req.params.driverId], (err, rows, fields)=>{
            try {
                res.send(rows);
           } catch (error) {
               console.error(error);
            }
          })
});


//Get all drivers
app.get('/drivers',(req, res) => {
    mysqlConnection.query('SELECT * FROM  driver', [], function(err : any, rows : any){
        console.log(rows)
        res.send(rows);
    });
});


//Delete
app.delete('/drivers/:driverId',(req,res)=>{
    mysqlConnection.query('DELETE  FROM Driver WHERE DriverID = ?' ,[req.params.driverId], (err, rows, fields)=>{
        if(!err)
        res.send('Deleted successfully.');
        else
        console.log(err);
    })

});

//post
app.post("/drivers", (req, res) => {
    
    const Name = req.body.Name;
    const DriverAdrNO = req.body.DriverAdrNO;
    const DriverLicense = req.body.DriverLicense;

         
    mysqlConnection.query(
        "INSERT INTO driver (Name,  DriverAdrNO, DriverLicense) VALUES (?,?,?)",
        [Name, DriverAdrNO, DriverLicense],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }  
        }
   );

});
       
//put
   app.put('/drivers/:driverid', (req, res) => {
    const DriverID = req.params.driverid;
    const Name = req.body.Name;
    const DriverAdrNO = req.body.DriverAdrNO;
    const DriverLicense = req.body.DriverLicense;
  
    var query = 'UPDATE Driver SET  Name = ?, DriverAdrNO = ?, DriverLicense = ? WHERE DriverID = ?';
    mysqlConnection.query(query,[Name, DriverAdrNO, DriverLicense, DriverID], (error, rows) => {    
    
        res.send({
        data: req.body,
        params:{
        DriverID: DriverID,
        Name: Name,
        DriverAdrNO: DriverAdrNO,
        DriverLicense: DriverLicense
      }
   })

 }) 
 
});
             

app.listen(3000,() => console.log('Express Server is running at port on  3000'));
