# Topics in Computer Security

##### Tomer Ittah & Nimrod Zur

### Instructions:
- Clone this repo to local directory

  `$ git clone https://bitbucket.org/tcs_group/computer_security_dev/src/ comp_sec_project`

- Go to the server directory and install the package (can be skipped if not for developing purposes):

	`$ npm install`

- Go to the client directory install the package and build the client (mandatory):

	`$ npm install && npm run build`

- Open Google Chrome, choose "More tools" then "Extensions". Click on "Load Unpacked" and choose the build directory that was created in the previous step (./comp_sec_project/client/build).

### Notes:
- The server is running on Azure App Service and the client by default communicates with the production server. In order to run the server locally change "base_api" configuration in ./comp_sec_project/client/public/background.js to the local server URL (usually http://localhost:3000/api), rebuild the client, go to the server directory, then start the server:
`$ npm run start`.
