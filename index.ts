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



// check() is a middleware used to validate
app.post('/', [
    check('Driver_ID', 'Driver_ID length should be 1 to 4 characters')
                    .isLength({ min: 1, max: 4 }),
    check('name', 'Name length should be 4 to 20 characters')
                    .isLength({ min: 4, max: 20 }),
  //  check('DriverDOB', ' Driver_DOB should be 8 to 8 characters')
    //              .isLength({ min: 8, max: 8 }),
    check('DriverAdrNO', ' DriverAdrNO should be 5 to 5 characters')
                    .isLength({ min: 5, max: 5 }),
    check('DriverLicense', ' DriverLicense should be 4 to 4 characters')
                    .isLength({ min: 4, max: 4 }),
], (req: express.Request, res: express.Response) => {

    // validationResult function checks whether
    // any occurs or not and return an object
    const errors = validationResult(req);

    // If some error occurs, then this block of code will run
    if (!errors.isEmpty()) {
        res.json(errors)
    }

    else {
        res.send("Successfully validated")
    }
});


//Get all Drivers
   app.get('/:drivers',  async (req, res) => {
    const DriverID = req.body.DriverID;
    const Name = req.body.Name;
    const DriverAdrNO = req.body.DriverAdrNO;
    const DriverLicense = req.body.DriverLicense;

           mysqlConnection.query('SELECT * FROM Driver', (err, rows, fields)=>{
            req.params.drivers
            try {
                res.send(rows);
           } catch (error) {
               console.error(error);
            }
          })
       });


//Get 
app.get('/DriverID/:driverid/Name/:name/DriverAdrNO/:driveradrno/DriverLicense/:driverlicense',
(req, res) => {
     
   mysqlConnection.query('SELECT * FROM  driver WHERE  driverid = ?', [req.params.driverid], function(err : any, rows : any){

    res.send({
        DriverID: req.params.driverid,
        Name: req.params.name,
        DriverAdrNO: req.params.driveradrno,
        DriverLicense: req.params.driverlicense
    });
})
});


//Delete
app.delete('/drivers/:id',(req,res)=>{
    const DriverID = req.body.DriverID;
    const Name = req.body.Name;
    const DriverAdrNO = req.body.DriverAdrNO;
    const DriverLicense = req.body.DriverLicense;

    mysqlConnection.query('DELETE  FROM Driver WHERE DriverID = ?' ,[req.params.id], (err, rows, fields)=>{
        req.params.id
        if(!err)
        res.send('Deleted successfully.');
        else
        console.log(err);
    })

});


/*
//Post
app.post('/DriverID/:driverid/Name/:name/DriverAdrNO/:driveradrno/DriverLicense/:driverlicense', (req, res) => {
    
    res.send({
        data: req.body,
        params:{
        DriverID: req.params.driverid,
        Name: req.params.name,
        DriverAdrNO: req.params.driveradrno,
        DriverLicense: req.params.driverlicense
        }
      })
    })
    */


//post
app.post("/drivers", (req, res) => {
    const DriverID = req.body.DriverID;
    const Name = req.body.Name;
    const DriverAdrNO = req.body.DriverAdrNO;
    const DriverLicense = req.body.DriverLicense;

         
    mysqlConnection.query(
        "INSERT INTO driver (DriverID, Name,  DriverAdrNO, DriverLicense) VALUES (?,?,?,?)",
        [DriverID, Name, DriverAdrNO, DriverLicense],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Values Inserted");
            }  
        }
   );

});

/*
//Put
app.put('/drivers/:id' , (req, res) => {
    const DriverID = req.params.id;
    const Name = req.body.Name;
    const DriverAdrNO = req.body.DriverAdrNO;
    const DriverLicense = req.body.DriverLicense;

    var query = 'UPDATE Driver SET  Name = ?, DriverAdrNO = ?, DriverLicense = ?, WHERE DriverID = ?';
    mysqlConnection.query(query,[Name, DriverAdrNO, DriverLicense, DriverID], (error, result) => {       
                    if (error) {
                        console.log(error);
                    } else {
                        res.send("Values updated");
                    }
                }
            );

        });
  */          
       
//put
   app.put('/DriverID/:driverid/Name/:name/DriverAdrNO/:driveradrno/DriverLicense/:driverlicense', (req, res) => {
  
    var query = 'UPDATE Driver SET  Name = ?, DriverAdrNO = ?, DriverLicense = ?, WHERE DriverID = ?';
    mysqlConnection.query(query,[req.body, req.params], (error, rows) => {    
    
        res.send({
        data: req.body,
        params:{
        DriverID: req.params.driverid,
        Name: req.params.name,
        DriverAdrNO: req.params.driveradrno,
        DriverLicense: req.params.driverlicense
      }
   })

 }) 
 
});
             

app.listen(3000,() => console.log('Express Server is running at port on  3000'));
