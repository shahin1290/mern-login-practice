### MERN-LOGIN-PRACTICE GUIDE

## Install Dependencies
express, mongoose, jsonwebtoken, bcryptjs, config, express-validator 

## Create node server
```javascript
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('API running')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```

## Connect mongodb and mongoose

```javascript
const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')


const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true })
    console.log('Mongodb connected')
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
```

Add in the server.js by requring the file
```javascript 
connectDB() 
```
