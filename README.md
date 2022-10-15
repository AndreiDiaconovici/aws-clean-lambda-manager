# aws-clean-lambda-manager
This repository contains a clean starting environment of NodeJS lambda with Typescript

  1. Handler
Inside this function, the event is transformed by retrieving only the information we need. (path parameters, query parameters, path, method, body) and then the dispatcher function is called.

  2. Dispatcher
The dispatcher creates an instance of the ChristmasMarketService and the ValidatorService. A new API string variable is created based on the "${path}:${method}"
Validate method of the Validator is called.
Switch based on the API string is executed on the Endpoints enum which contains all the API combinations.

  3. Validator
The validator's constructor is private, the instance is created with the getInstance method. The constructor creates an instance of AJV.
The validate method checks if the schema is already present inside the ajv instance cache
  - If not, it is imported and added to the ajv cache, after that the method is recalled.
  - If is present and the event is has schema error, throws an error

  4. Application Service
Service with the business logic which contains the methods executed by the dispatcher.

  5. AWS SDK Wrapper Services
Wrapper service of the AWS SDK in order to avoid duplicated code.

# Example SAM Architecture & Code implementation
https://github.com/AndreiDiaconovici/aws-secure-serverless