# CKO Payment Components Demo

### Installation
```
npm install
```

### Environment

CKO's PublicKey and SecretKey need to be set by the environment, for **development**, it is possible to add a `.env` file with the following content:

```
CKO_PUBLIC_KEY=pk_sbox_...
CKO_SECRET_KEY=sk_sbox_...
```

### Start
```
DEBUG=components-demo:* npm run dev
```

```
DEBUG=components-demo:* npm start
```



### Details
This project has been set up with [Express Generator](https://expressjs.com/en/starter/generator.html) and uses [twig](https://twig.symfony.com/) as a template engine.


### Structure

Note some files might need to be renamed.

```
- config/                Configuration files
  aspects.js             List of themes with name and appearance
  devices.js             List of devices for the size
  keys.js                Checkout's Sandbox Public and Secret keys
  regions.js             List of regions with country, lang and currency

- public/
  - images/
  - js/
    demo-handler.js      Module to handle all CKO PC back+front flow
    demo.js              Demo application behaviour 
  - styles/
    styles.css           General styles

- routers/               Routes/controllers
  api.js                 Controller for backend API requests
  index.js               Controller for frontend app

- views/
  error.twig             Default's express generator error page
  index.twig             Main demo's template
  layout.twig            General layout
    
```