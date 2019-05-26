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