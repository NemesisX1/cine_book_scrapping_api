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

- Star this repository
- Complete the swagger documentation ([link](https://swagger-autogen.github.io/docs/))
- Technical articles about this api
- Fixing typos when you notice ones
- Fixing issues
- Adding features
- Create API clients
- Build projects
- Suggest features

## Roadmap

### Technical

* [X] Fetching theaters name
* [X] Fetching theaters informations (location, social media, pricing)
* [X] Fetching movies of the current week
* [X] Fetching movies informations
* [X] Fetching movies diffusion informations
* [X] Handling language support when fetching movie informations
* [X] Handling language support when fetching theater informations
* [ ] Fetching movies diffusion informations by theaters
* [ ] Fetching movies categories
* [ ] Handling language support when fetching movies categories
* [ ] Fetching movies of the current week by theaters
* [ ] Managing access to the api through api keys
* [ ] A landing page ?

### Non Technical

- [ ] A nice logo for this project
