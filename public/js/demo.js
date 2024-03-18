import { DemoHandler } from './demo-handler.js'

const demoHandler = DemoHandler
demoHandler.init('payments')

let region;
let aspect;
let device;

/**
 * Functions
 */

// Loads or reloads the componed based on all selectors' values
const reloadDemo = () => {
  console.log(`[Demo] Reload Components: Region=${region} Aspect=${aspect}`)
  demoHandler.load({ region, aspect })
}

/**
 * Selectors
 */
document.getElementsByName('region-selector').forEach(function (item) {
  item.addEventListener('click', function (event) {
    event.preventDefault()
    console.log(`[Demo] Region Selection Click: ${event.target.getAttribute('data-value')}`)
    region = event.target.getAttribute('data-value')
    document.getElementById('dropdown-region').innerHTML = event.target.innerHTML
    reloadDemo()
  })
})

document.getElementsByName('aspect-selector').forEach(function (item) {
  item.addEventListener('click', function (event) {
    event.preventDefault()
    console.log(`[Demo] Aspect Selection Click: ${event.target.getAttribute('data-value')}`)
    aspect = event.target.getAttribute('data-value')
    document.getElementById('dropdown-aspect').innerHTML = event.target.innerHTML
    reloadDemo();
  });
});

const componentsWrapperElement = document.getElementById('components-wrapper')
document.getElementsByName('device-selector').forEach(function (item) {
  item.addEventListener('click', function (event) {
    event.preventDefault()
    console.log(`[Demo] Device Selection Click: ${event.target.getAttribute('data-value')}`)
    device = event.target.getAttribute('data-value')

    componentsWrapperElement.classList.forEach((name) => name.startsWith('device-') ? componentsWrapperElement.classList.remove(name) : null)
    componentsWrapperElement.classList.add(device)
    document.getElementById('dropdown-device').innerHTML = event.target.innerHTML
    //reloadDemo();
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
let aspectModalTextarea = aspectModalElement.querySelector('textarea')

const updateAspectModal = (key) => {
  let aspect = aspectData[key]
  aspectModalElement.querySelector('.modal-title').innerHTML = aspect.name
  aspectModalTextarea.value = JSON.stringify(aspect.value, null, 4).replace(/"([^"]+)":/g, '$1:').replace(/\\"/g, "'")
  aspectModal.show()
}

aspectModalTextarea.addEventListener('click', (e) => e.target.select())

// Add listener for every data-action=aspect
// Expecting: data-aspect-name data-aspect-code
document.querySelectorAll('[data-action="aspect"]').forEach((element, key) => {
  element.addEventListener('click', (e) => {
    e.preventDefault()
    updateAspectModal(element.getAttribute('data-aspect-key'),)
  })
})

/**
 * Demo events
 */

// Session has been successfully created
demoHandler.addEventHandler(DemoHandler.Events.SessionSuccess, (e) => {
  console.log('[Demo]', e.type, e.detail)

  // Reset UI messages
  successModal.hide()
  failureAlertElement.classList.add('d-none')
  failureAlertElement.innerHTML = ''
})

// Components has been loaded or reloaded
demoHandler.addEventHandler(DemoHandler.Events.ComponentLoaded, (e) => {
  console.log('[Demo]', e.type, e.detail)
})

// A demo payment attempt has been completed (depends on demo's criteria)
demoHandler.addEventHandler(DemoHandler.Events.PaymentSuccess, (e) => {
  console.log('[Demo]', e.type, e.detail)

  // Show success message
  successModal.show()
})

// A demo payment attempt has failed
demoHandler.addEventHandler(DemoHandler.Events.PaymentFailure, (e) => {
  console.log('[Demo]', e.type, e.detail)

  // Show failure alert
  failureAlertElement.classList.remove('d-none')
  failureAlertElement.innerHTML = 'Something went wrong...'
})
