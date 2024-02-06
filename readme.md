<p align="center">
  <a href="https://github.com/imtangim/uptime-monitoring-api-raw-node">
  </a>
  <h3 align="center">Raw Node.js Project - Uptime Monitoring API</h3>
</p>

<!-- HOW TO RUN -->

## How to run

Please follow the below instructions to run this project in your machine:

1. Clone this repository
   ```sh
   git clone https://github.com/imtangim/uptime-monitoring-api-raw-node.git
   ```
2. Go into cloned directory
   ```sh
   cd uptime-monitoring-api-raw-node
   ```
3. Install dev dependencies
   ```sh
   npm install
   ```
4. Run the app
   ```sh
   npm start
   ```
5. Your app should be available in http://localhost:3000

## Configure twilio for SMS Alert

- Go to ```enviroment.js``` (path: helpers/enviroments.js) and set:

    - For ```staging```:
    
        ```sh
        enviroments.staging={
                port:3000,
                env_name :"staging",
                secretKey : "set-your-prefered-secret-key",
                maxChecks:5,
                twilio:{
                    fromPhone:'twilio-number',
                    sid:'twilio-sid',
                    token:'twilio-token',
                }
            }
        ```
    - For ```Production```:

        
        ```sh
        enviroments.production={
                port:3000,
                env_name :"staging",
                secretKey : "set-your-prefered-secret-key",
                maxChecks:5,
                twilio:{
                    fromPhone:'twilio-number',
                    sid:'twilio-sid',
                    token:'twilio-token',
                }
            }
        ```


## User Route

1. <b>```POST```</b> Method: Creating new user.

* ```Url```: http://localhost:3000/user

    ```sh
    {
        "firstName": "John",
        "lastName":"Wayne",
        "phone": "016-real-number",
        "password":"John123",
        "tosAgreement":true
    }   
    ```
2. <b>```GET```</b> Method: Get user info.

    - ```Url```: http://localhost:3000/user?phone="phone-number"

    -  You don't need to send body payload.

3. <b>```PUT```</b> Method: Updating user info.

    - ```Url```: http://localhost:3000/user?id="need-to-login-for-token"

    ```sh
    {
        "firstName": "John",
        "lastName":"Wayne",
        "phone": "016-real-number",
        "password":"John123",
    }   
    ```
    -  You can send any item for update individually or with the whole group in body.
4. <b>```DELETE```</b> Method: Delete the user.

    - Url: http://localhost:3000/user?id="need-to-login-for-token"

    -  You don't need to send body payload.
## Signin Route

1. <b>```POST```</b> Method: login user.

* ```Url```: http://localhost:3000/token

    ```sh
    {
        "phone":"01610006484",
        "password":"Jerin4103@"
    }  
    ```
    - Token has ```1 hour``` validity only.
2. <b>```GET```</b> Method: Get the token details.

    - ```Url```: http://localhost:3000/token?id="token-id"

    -  You don't need to send body payload.

3. <b>```PUT```</b> Method: Extend the token period.

    - ```Url```: http://localhost:3000/token

    ```sh
    {
        "id":"token-id-that-need-to-be-extended",
        "extend": "John",
    }   
    ```
    -  You can send any item for update individually or with the whole group in body.
4. <b>```DELETE```</b> Method: Delete token.

    - ```Url```: http://localhost:3000/token?id="token-id"

    -  You don't need to send body ```payload```.


<b>```Note:```</b> Pre-made method is available to verify the ```token```. 
## Check Route
This route is needed for adding the urls that you want to check.

1. <b>```POST```</b> Method: Creating new check.

* ```Url```: http://localhost:3000/check

    ```sh
    {
        "protocol": "https",
        "url": "tangim.me",
        "method": "PUT",
        "successCode": [
            200,
            201
        ],
        "timeoutSecond": 2
    }   
    ```
    - Add the all the success code that your desired website has defined as successful request.
    - Add the method of your request.
    - Add the protocol of your request.
    - Your desired timeout but not more than ```4 sec```.
    - You can only add ```5 checks``` at a time.
    
2. <b>```GET```</b> Method: Get check info.

    - ```Url```: http://localhost:3000/check?id="your-check-id"

    -  You don't need to send body ```payload```.

3. <b>```PUT```</b> Method: Updating Check.

    - ```Url```: http://localhost:3000/check

    ```sh
    {
        "id": "id-of-that-check-which-need-to-update",
        "successCode": [
            200,
            201,
            800
        ],
        "timeoutSecond": 4
    }  
    ```
    -  You can send any item for update individually or with the whole m   group in body but id must need to be added.
4. <b>```DELETE```</b> Method: Delete the check.

    - ```Url```: http://localhost:3000/check?id="id-of-the-desired-check"

    -  You don't need to send body ```payload```.



## Contact

<b>Tangim Haque</b>: [tanjim437@gmail.com](mailto:tanjim437@gmail.com)

<b>Portfolio</b>: [tangim.me](https://tangim.me)

<b>Project Link</b>: [https://github.com/imtangim/uptime-monitoring-api-raw-node](https://github.com/imtangim/uptime-monitoring-api-raw-node)

<b>Youtube Channel</b>: [https://youtube.com/@wittywidgets](https://youtube.com/@wittywidgets)