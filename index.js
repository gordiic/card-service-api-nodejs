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
const port=9000;
app.listen(port, () => {
  console.log(`Server Started on ${port}`);
  logger.info(`Server started on ${port}. Time: ${new Date()}`);
});
app.post('/payment-request', jsonParser, async(req, res) => 
{
  logger.info(`Payment request. Time: ${new Date()}`);
    console.log("body ",req.body)

    try{
      //dobavljanje id banke i url banke
      //ispraviti tabelu u bazi 
      
      const bank= await dbRepo.getBankByPan(req.body.pan.substring(0,6)); 
      console.log(bank);
      const addResp= await dbRepo.addRequest(req.body);
      logger.info(`Sending request to ${bank.url}. Time: ${new Date()}`);
      const data=await axios.post(`${bank.url}/extern-payment-request`,req.body);
      console.log(data.data);
      res.send(data.data);
      }
      catch(e)
      {
        console.log(e);
      }
    
});