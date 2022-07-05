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
docker run <image-name>
```
See additional options [here](https://docs.docker.com/engine/reference/run/#docker-run-reference).

### Deploying the application

#### 1. Create an IAM Role
In your AWS Account, create a new IAM Role with the permissions you deem necessary. This must include [Cloudformation](https://aws.amazon.com/cloudformation/) and [EC2](https://aws.amazon.com/ec2/). Refer to GitHub's docs for [Configuring OpenID Connect in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) for guidance.

#### 2. Create an SSH keypair on AWS
See AWS [Create key pairs documentation](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html).

#### 3. Create a DockerHub account and access token
[DockerHub](https://hub.docker.com/) is used as the artifactory for storing Docker images.

Create an [access token](https://docs.docker.com/docker-hub/access-tokens/) with read/write access.

#### 4. Add essential secrets to your GitHub repository.

Add the following secrets via **Repository settings** > **Secrets** > **Actions**.

  - `IAM_ROLE_ARN` containing your IAM Role ARN from step 1.
  - `SSH_PRIVATE_KEY` containing the value inside the keyfile generated in step 2.
  - `DOCKERHUB_USERNAME` containing your DockerHub username.
  - `DOCKERHUB_TOKEN` containing your DockerHub token.

#### 5. Trigger a deploy
To trigger a deploy, simply commit changes to the `master` branch.