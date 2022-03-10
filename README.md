#  Digital Infrastructure for Research and Extension on Crops and Technology for Agriculture (DIRECT4AG)

A web-based application to translate information about cutting-edge production-relevant agricultural research directly to growers. The 
growers can have input into the system and can provide feedback on the project.

# README UNDER CONSTRUCTION...

# Installation

### `npm install`

Install all the npm dependencies.

# Running

[comment]: <> (Set deployment environment. Possible options: production, development, localhost)

[comment]: <> (### `export REACT_APP_ENV=development`)
### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Testing

### `npm run test`

Launches the test runner in the interactive watch mode.

# Building & Deploying

### `npm run build`

Builds the app for production to the `build` folder.\
It bundles React in production mode and optimizes the build for the best performance.

Copy the build folder to a web server to run the app

# Linting

### `npm run lint`

Checks for eslint errors or warnings. Use `npm run lint:fix` to fix the ones that are fixable by eslint.
Rules config available in `.eslintrc`.

# Docker
To build the container:

```
sh docker.sh
```

To test docker container:

```
docker run -p 3000:80 docker.io/direct4ag/frontend
```

Browse to localhost:3000
