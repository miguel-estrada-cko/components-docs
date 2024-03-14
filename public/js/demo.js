import { DemoHandler } from './demo-handler.js'

const demoHandler = DemoHandler
demoHandler.init('payments')

var regionValue;
var aspectValue;

/**
 * Functions
 */

// Loads or reloads the componed based on all selectors' values
const reloadDemo = () => {
  console.log('onSelectorsChange')
  let region = regionValue
  let aspect = aspectValue
  demoHandler.load({ region, aspect })
}

/**
 * Selectors
 */
document.addEventListener("DOMContentLoaded", function() {
  var dropdownItems = document.getElementsByName('region-selector');

  dropdownItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      console.log(event.target.getAttribute('data-value'));
      regionValue = event.target.getAttribute('data-value');
      reloadDemo();
      
    });
  });
});

document.addEventListener("DOMContentLoaded", function() {
  var dropdownItems = document.getElementsByName('aspect-selector');

  dropdownItems.forEach(function(item) {
    item.addEventListener('click', function(event) {
      event.preventDefault();
      console.log(event.target.getAttribute('data-value'));
      aspectValue = event.target.getAttribute('data-value');;
      reloadDemo();
      
    });
  });
});

/**
 * Success and failure messages
 */

let successModalElement = document.getElementById('success-modal')
let successModal = new bootstrap.Modal(successModalElement,)
let failureAlertElement = document.getElementById('failure-alert')

// Handle modal closure flow
successModalElement.addEventListener('hide.bs.modal', reloadDemo)


/**
 * Appearance copy&paste modal
 */
let aspectData = JSON.parse(document.getElementById('aspect-data').textContent)
let aspectModalElement = document.getElementById('aspect-modal')
let aspectModal = new bootstrap.Modal(aspectModalElement,)


const updateAspectModal = (key) => {
  let aspect = aspectData[key]
  aspectModalElement.querySelector('.modal-title').innerHTML = aspect.name
  aspectModalElement.querySelector('textarea').value = JSON.stringify(aspect.value, null, 4).replace(/"([^"]+)":/g, '$1:').replace(/\\"/g, "'")
  aspectModal.show()
}

// Add listener for every data-action=aspect
// Expecting: data-aspect-name data-aspect-code
document.querySelectorAll('[data-action="aspect"]').forEach((element, key) => {
  element.addEventListener('click', (e) => {
    e.preventDefault()
    updateAspectModal(element.getAttribute('data-aspect-key'),)
  })
})

//updateAspectModal()

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
