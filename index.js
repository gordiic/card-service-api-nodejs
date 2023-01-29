const express = require('express');
const app = express();
const dbRepo=require('./dbRepository');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var axios = require('axios');
const cors = require('cors');
const { createLogger, format, transports } = require("winston");

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
app.use(cors({
    origin: '*'
}));
const logger = createLogger({
  levels:logLevels,
  transports: [new transports.File({ filename: "file.log" })],
  exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "rejections.log" })],
});
app.listen(9000, () => console.log(`Server Started on ${9000}`));

//PCC evidentira zahtev, proverava ga i usmerava ka servisu banke izdavaoca spram PAN-a.
//Dolazni podaci od banke
  // {
  //   acquirer_order_id,
  //   acquirer_timestamp,
  //   pan,
  //   csc,
  //   card_h_name,
  //   exp_date
  // }

  //Odlazni podaci - zahtjev ka banci drugoj
  // {
  //   acquirer_order_id,
  //   acquirer_timestamp,
  //   pan,
  //   csc,
  //   card_h_name,
  //   exp_date
  // }
  //Dolazni podaci od druge banke
  // {
  //   successful,
  //   acquirerer_order_id,
  //   acquirerer_timestamp,
  //   issuer_order_id,
  //   issuer_timestamp
  // }
  //Odgovor ka banci prvoj
   //Odlazni podaci
  // {
  //   acquirer_order_id,
  //   acquirer_timestamp,
  //   issuer_order_id,
  //   issuer_timestamp
  // }
app.post('/payment-request', jsonParser, async(req, res) => 
{
    console.log("body ",req.body)

    try{
      //dobavljanje id banke i url banke
      //ispraviti tabelu u bazi 
      
      const bank= await dbRepo.getBankByPan(req.body.pan.substring(0,6)); 
      console.log(bank);
      const addResp= await dbRepo.addRequest(req.body);
       const data=await axios.post(`${bank.url}/extern-payment-request`,req.body);
        console.log(data.data);
        res.send(data.data);
      }
      catch(e)
      {
        console.log(e);
      }
    
});