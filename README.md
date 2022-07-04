# multiplayer-pacman

A Multiplayer pacman. Note: This is a **work in progress**.

### Running locally

##### System Requirements
- [Node.js](https://nodejs.org/) (v16.14.2)
- [npm](https://www.npmjs.com/)
- [nvm](https://github.com/nvm-sh/nvm)

### Build setup
#### Run development locally
```bash
# ensure node version is correct
$ nvm use

# install dependencies
$ npm install

# run in development mode (localhost:3000)
$ npm run dev
```

#### Run unit tests

Unit tests are implemented with [Jest](https://jestjs.io/).

```bash
$ npm run test
```


#### Docker
You may find docker builds for each release on [docker hub](https://hub.docker.com/repository/docker/caloverflow/pacman-overflow/tags?page=1&ordering=last_updated).

Build the docker image with
```bash
docker build -t <image-name> .
```

Run the docker container with
```bash
docker run -p 3000:3000 <image-name>
```
Add `-d` to run in detached mode.

