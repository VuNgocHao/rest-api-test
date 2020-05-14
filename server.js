let express =  require('express')
let app = express()
const bodyParser = require('body-parser')
require('dotenv').config() 
const PORT = process.env.PORT  || 3000;//set port api is 3000


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

let routes = require('./api/route');//import file route
routes(app)

app.use(function(req,res){
    res.status(404).send({url:req.originalUrl + ' not found'})
}) // check request co ton tai hay khong

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });