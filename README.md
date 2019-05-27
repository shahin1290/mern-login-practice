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

## Sets up routes with express Router
routes-api-users.js

```Javascript
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Get Users')
})

module.exports = router
```

routes-api-auth.js
```Javascript
const express = require('express')
const router = express.Router()

router.post('/register', (req, res) => {
  res.send('Register User')
})

router.post('/login', (req, res) => {
  res.send('Login User  ')
})

module.exports = router
```
server.js
```javascript
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
```

## Creates a User model

```javascript
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', UserSchema)
```
## Completes register route
```javascript
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please provide valid email address').isEmail(),
  check('password', 'Password must be 5 characters or more').isLength({min: 5})
], async (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  
  const { name, email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if(user){
      return res.status(400).json({ errors: [{msg: 'User already exists'}]})
    }

    user = new User({ name, email, password })

    const salt = await bcrypt.genSalt(8)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user:{
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, ( err, token ) => {
      if(err) throw err
      res.json({ token })
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
```

## Completes login route
```javascript
router.post('/login', [
  check('email', 'Please include a valid email address').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req)

  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()})
  }

  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })

    if(!user){
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}]})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}]})
    }

    const payload = {
      user:{
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, ( err, token ) => {
      if(err) throw err
      res.json({ token })
    })

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})
```

## Get user data by adding custom auth middleware to verify jwt token
middleware-auth.js
```javascript
const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token')

  if(!token){
    return res.status(401).json({ msg: 'No token, authentication denied'})
  }

  try { 
    const decoded = jwt.verify(token, config.get('jwtSecret'))

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid'})
  }
}
```
users.js
```javascript
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.send(user)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
```

## React Redux set up
```
npx create-react-app client
npm i axios react-router-dom redux react-redux redux-thunk
```
package.json
```
"proxy": "http://localhost:5000"
```
