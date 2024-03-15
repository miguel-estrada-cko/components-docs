/* global CheckoutWebComponents */

export const DemoHandler = {

  Events: {
    SessionSuccess: 'SessionSuccess',
    SessionFailure: 'SessionFailure',
    ComponentLoaded: 'ComponentLoaded',
    PaymentSuccess: 'PaymentSuccess',
    PaymentFailure: 'PaymentFailure',
  },

  _config: {},

  _element: null,

  _instance: null,

  /**
   * 
   * @public
   * @param {*} element 
   */
  init(element) {
    this._element = element

    this._requestConfig()
    this._loadComponent()
  },

  /**
   * Adds an event listener for the object
   * 
   * @public
   * @param {*} event 
   * @param {*} handler 
   */
  addEventHandler(event, handler) {
    window.addEventListener(event, handler)
  },

  /**
   * Loads or reloads the component for a given properties
   * 
   * @public
   * @param {*} props 
   */
  load(props) {
    this._loadComponent(props)
  },

  /**
   * Triggers events
   * 
   * @private
   * @param {*} event 
   * @param {*} detail 
   */
  _trigger(event, detail) {
    console.log('[DemoHandler] Event:', event, detail)
    window.dispatchEvent(new CustomEvent(event, { detail: detail }))
  },

  /**
   * Retrieves the config from the backend
   * 
   * @private
   */
  async _requestConfig() {
    this._config = await (await fetch('/api/config', { method: 'GET' })).json()
  },

  /**
   * Requests a payment session and returns an object with the session, locale and appearance
   * 
   * @private
   * @param {} props 
   * @returns 
   */
  async _requestSession(props) {
    try {
      const session = await (
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify(props)
        })
      ).json()
      this._trigger(this.Events.SessionSuccess, { paymentSessionId: session.payment.id })
      return session
    }
    catch (e) {
      this._trigger(this.Events.SessionFailure)
      throw new Error('Session Request failed')
    }
  },

  /**
   * Displays the Payment Components element
   * 
   * @private
   * @param {} props 
   */
  async _loadComponent(props) {
    // Unmount the Payment Component if exists
    this._instance?.unmount()

    // Retrieve the payment session
    const session = await this._requestSession(props)

    // Set up the Payment Component
    const checkoutWebComponents = await CheckoutWebComponents({

      publicKey: this._config.keys.publicKey,
      environment: 'sandbox',
      locale: session.locale,
      paymentSession: session.payment,
      appearance: session.appearance,

      onReady: (component) => {
        console.log('[Components] onReady', component)
      },

      onChange: (component) => {
        console.log('[Components] onChange', component)
      },

      onSubmit: (component) => {
        console.log('[Components] onSubmit', component)
      },

      handleSubmit: async (component, state) => {
        console.log('[Components] handleSubmit', component, state)
        this._trigger(this.Events.PaymentSuccess, { type: state.type })
      },

      onPaymentCompleted: (component, paymentResponse) => {
        console.log('[Components] onPaymentCompleted', component, paymentResponse)
        this._trigger(this.Events.PaymentSuccess)
        this._instance.unmount()
      },

      onError: (component, error) => {
        console.log('[Components] onError', component, error)
        this._trigger(this.Events.PaymentFailure, { error: error })
      },

    });

    // Create the Payment Component
    this._instance = checkoutWebComponents.create('payments', { showPayButton: true, })
    this._instance.mount(document.getElementById(this._element))

    this._trigger(this.Events.ComponentLoaded)
  },

}