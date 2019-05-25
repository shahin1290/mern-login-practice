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