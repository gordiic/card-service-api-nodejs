const express = require('express');
const app = express();

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()




var axios = require('axios');

const cors = require('cors');

const { createClient } =require("@supabase/supabase-js");

const { createLogger, format, transports } = require("winston");

//database pw:12345678910nebojsa
const supabaseUrl = 'https://kmvvsovezjeqmtobddtk.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdnZzb3ZlemplcW10b2JkZHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4NDk1ODEsImV4cCI6MTk4ODQyNTU4MX0.O5kOMXcOJr_mfNqoOOoXCkRpbX_ywd5l51pbhdWjlJI"
const supabase = createClient(supabaseUrl, supabaseKey)
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
app.listen(7000, () => console.log(`Server Started on ${7000}`));

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
  
  //Odgovor ka banci prvoj
   //Odlazni podaci
  // {
  //   acquirer_order_id,
  //   acquirer_timestamp,
  //   issuer_order_id,
  //   issuer_timestamp
  // }
app.get('/get-bank-of-card', jsonParser, async(req, res) => 
{
    console.log("body",req.body)

    try{
        //dobavljanje id banke i url banke
        //ispraviti tabelu u bazi 
        const {data, error}= await supabase
        .from('credit-cards')
        .select('bank_url', 'bank_id')
        .eq('pan', req.body.pan)
       
        console.log(data)
        logger.info(`from:${req.url}. sending response: ${data}`);

        //treba poslati na data.url zahtjev za transakciju, i tu poslati podatke o kartici i 
        //parama koje treba da se skinu 
        //kad se to obavi odgovor poslati banci od prodavnice da je odradjeno 
        //dakle sve isto treba da se posalje toj drugoj banci kao sto se poslalo prvoj banci, jer treba da budu iste aplikacije, samo razliciti portovi
        // isti endpoint gadja kao front banke
        res.send(data);
      }
      catch(e)
      {
        console.log(e);
      }
    
});