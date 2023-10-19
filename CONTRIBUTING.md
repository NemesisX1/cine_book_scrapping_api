# Canal Olympia API Docs

## How it works?

### The app architecture

<aside>
💡 Service  -> Controller -> Route -> App

</aside>

- Services (located in the services folder) handle the core logic of the app and provide the main app features in a logical part
- Controllers (located in the controllers folder) handle the network (aka HTTP) logic. They handle the app's HTTP response. They mostly use one or more Services and return express responses according to the return value of the called functions. Most of a controller’s function take request’s parameters and a Response as arguments and return a  Response as return value
- Routes (located in the routes folder) handle the API request parameters. It is where we add middlewares and request validators. Earh file in route has its own instance of a controller. Each API route usually uses its related function defined in its related controller.
- App located in the app.ts file located at the root of the src folder is a class that help to setup the server. All the new routes should be registered in the routerSetup method following the related configuration.

## How to contribute ?

## Roadmap
