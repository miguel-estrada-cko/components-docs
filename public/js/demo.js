import { DemoHandler } from './demo-handler.js'

const demoHandler = DemoHandler
demoHandler.init('payments')

/**
 * Functions
 */

// Loads or reloads the componed based on all selectors' values
const reloadDemo = () => {
  console.log('onSelectorsChange')
  let region = regionSelectorElement.value
  let aspect = aspectSelectorElement.value
  demoHandler.load({ region, aspect })
}

/**
 * Selectors
 */

let regionSelectorElement = document.getElementById('region-selector')
let aspectSelectorElement = document.getElementById('aspect-selector')

// Handle selectors changes
regionSelectorElement.addEventListener('change', reloadDemo)
aspectSelectorElement.addEventListener('change', reloadDemo)

/**
 * Success and failure messages
 */

let successModalElement = document.getElementById('success-modal')
let successModal = new bootstrap.Modal(successModalElement,)
let failureAlertElement = document.getElementById('failure-alert')

// Handle modal closure flow
successModalElement.addEventListener('hide.bs.modal', reloadDemo)

/**
 * Demo events
 */

// Session has been successfully created
demoHandler.addEventHandler(DemoHandler.Events.SessionSuccess, (e) => {
  console.log('SessionSuccess', e.type, e.detail)

  // Reset UI messages
  successModal.hide()
  failureAlertElement.classList.add('d-none')
  failureAlertElement.innerHTML = ''
})

// Components has been loaded or reloaded
demoHandler.addEventHandler(DemoHandler.Events.ComponentLoaded, (e) => {
  console.log('ComponentLoaded', e.type, e.detail)
})

// A demo payment attempt has been completed (depends on demo's criteria)
demoHandler.addEventHandler(DemoHandler.Events.PaymentSuccess, (e) => {
  console.log('PaymentSuccess', e.type, e.detail)

  // Show success message
  successModal.show()
})

// A demo payment attempt has failed
demoHandler.addEventHandler(DemoHandler.Events.PaymentFailure, (e) => {
  console.log('PaymentFailure', e.type, e.detail)

  // Show failure alert
  failureAlertElement.classList.remove('d-none')
  failureAlertElement.innerHTML = 'Something went wrong...'
})
