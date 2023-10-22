# Canal Olympia API Docs

## How it works?

### The app architecture

> 💡 **Service  -> Controller -> Route -> App**

- Services (located in the services folder) handle the core logic of the app and provide the main app features in a logical part
- Controllers (located in the controllers folder) handle the network (aka HTTP) logic. They handle the app's HTTP response. They mostly use one or more Services and return express responses according to the return value of the called functions. Most of a controller’s function take request’s parameters and a Response as arguments and return a  Response as return value
- Routes (located in the routes folder) handle the API request parameters. It is where we add middlewares and request validators. Earh file in route has its own instance of a controller. Each API route usually uses its related function defined in its related controller.
- App located in the app.ts file located at the root of the src folder is a class that help to setup the server. All the new routes should be registered in the routerSetup method following the related configuration.

## How to contribute ?

- Star this repository
- Complete the swagger documentation ([link](https://swagger-autogen.github.io/docs/))
- Write technical articles about this api
- Fix typos when you notice ones
- Fix issues
- Create API clients
- Build projects
- Suggest features
- Add more tests
- Add features

## Roadmap

### Technical

* [X] Fetching theaters name
* [X] Fetching theaters informations (location, social media, pricing)
* [X] Fetching movies of the current week
* [X] Fetching movies informations
* [X] Fetching movies diffusion informations
* [X] Handling language support when fetching movie informations
* [X] Handling language support when fetching theater informations
* [X] Fetching movies of the current week by theaters
* [X] Fetching movies diffusion informations by theaters
* [ ] Fetching current avalaible movies (on the main page https://www.canalolympia.com)
* [ ] Handling language support when fetching current avalaible movies (on the main page https://www.canalolympia.com)
* [ ] Fetching avalaible theaters with escape game
* [ ] Handling language support when fetching avalaible theaters with escape game
* [ ] Fetching escape game activities informations (name, hours, difficulties ? and other related informations)
* [ ] Handling language support when fetching escape game activities informations (name, hours, difficulties ? and other related informations)
* [ ] Fetching movies categories
* [ ] Handling language support when fetching movies categories
* [ ] Managing access to the api through api keys
* [ ] A landing page ?

### Non Technical

- [ ] A nice logo for this project
