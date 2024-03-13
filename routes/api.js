var express = require('express')
var router = express.Router()
const { Checkout } = require('checkout-sdk-node');

var keys = require('../config/keys')
var regions = require('../config/regions')
var aspects = require('../config/aspects')

const cko = new Checkout(keys.secretKey, {
  pk: keys.publicKey
})


/* GET config */
router.get('/config', async function (req, res, next) {
  res.send({
    keys: {
      publicKey: keys.publicKey,
      processingChannelId: keys.processingChannelId,
    }
  })
})

/* POST payment session */
router.post('/session', async function (req, res, next) {

  // Validate input
  let { region, aspect } = req.body

  region = region in regions ? regions[region] : regions.uk
  aspect = aspect in aspects ? aspects[aspect] : aspects.default
  //res.status(422).send( {error: "invalid_country_code"})

  // Generate a unique ID for reference and description
  const id = Math.random().toString(16).slice(2)

  // Request a Payment Session
  const request = {
    amount: 1200,
    currency: region.currency,
    reference: `CKO-PC-${id}`,
    billing: {
      address: {
        country: region.value,
      }
    },
    shipping: region.shipping,
    description: `Components Demo Payment ${id}`,
    customer: {
      name: 'John Smith',
      email: 'john.smith@example.com',
    },
    "3ds": {
      enabled: false,
    },
    success_url: 'https://example.com/payments/success',
    failure_url: 'https://example.com/payments/failure',
  }

  try {
    const response = await cko.paymentSessions.request(request);
    res.send({
      payment: response,
      appearance: aspect.value,
      locale: region.locale
    })
  }
  catch (error) {
    res.status(422).send(error)
  }
})

module.exports = router;
