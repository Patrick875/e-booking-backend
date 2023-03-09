# Anathole's Portifolio backend REST API

<!-- ![check-code-coverage](https://img.shields.io/badge/code--coverage-86.01%25-green) -->

![Coverage](https://img.shields.io/badge/Coverage-84%25-83A603.svg?prefix=$coverage$)  
  ![statements](https://img.shields.io/badge/Coverage-86%25-83A603.svg?style=flat&logo=kotlin&logoColor=white&color=blue&prefix=$statements$) 
  ![Branches](https://img.shields.io/badge/Coverage-75%25-5A7302.svg?style=social&logo=ktor&logoColor=black&color=red&prefix=$branches$)
  ![Functions](https://img.shields.io/badge/Coverage-88%25-83A603.svg?prefix=$functions$) ![](https://img.shields.io/badge/Coverage-87%25-83A603.svg?prefix=$lines$)

![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/Aimeana100/portifolio-backend?style=plastic)

![AppVeyor](https://img.shields.io/appveyor/build/Aimena100/portifolio-backend)
![AppVeyor tests](https://img.shields.io/appveyor/tests/Aimeana100/portifolio-backend)


[![CI/CD](https://github.com/Aimeana100/portifolio-backend/actions/workflows/node.js.yml/badge.svg)](https://github.com/Aimeana100/portifolio-backend/actions/workflows/node.js.yml)


<!-- PROJECT LOGO and Intro -->
<br />
<div >
  ## Intoroduction 
 <br>
</div>

- Portifolio backend REST API documentation , this is a project of my brand project, that is deployed on Repository <a href="https://github.com/Aimeana100/portifolio" target="_blank" > Front-End git </a> and front-end design are deployed on github page <a href="https://github.com" target="_blank" > Fron-end Pages </a>.

## Index

- [About](#about)
- [Usage](#usage)
  - [Installation](#installation)
  - [Commands](#commands)
- [Development](#development)
  - [Pre-Requisites](#pre-requisites)
  - [Development Environment](#development-environment)
  - [File Structure](#file-structure)
  - [Build](#build)  
  - [Deployment](#deployment)  
- [Community](#community)
  - [Contribution](#contribution)
  - [Branches](#branches)
  - [Guideline](guideline)  
- [License](#license)

## About
This project was created as a way for me to learn more about software development and to establish my name as a developer. This repository includes a backend and every API (end point) that a front-end component will need to use. It is a fully REST API built in node js that connects and serves user queries, blogs, comments, and user management with full Token based (JWT) authentication and authorization.
## Usage

- It is integratable with any front-end component that consume a REST API.
### Installation

- Download and Install git on your local machine see guidelines [https://git-scm.com/downloads](https://git-scm.com/downloads).
- Install Node.js on your local machine see instructions  [node.js](https://nodejs.org/)
- Open your comand line interface i.e **`terminal, git bash, ...`** 
-Navigate to the location you want to run the proejct and run following commands from the command line.
- Create your own environment file **`.env`** at project root directory and `copy .env.example to .env` by ``$ cp .env.example .env``
- Create your own mongoDB connection #guides [mongodb.com](https://www.mongodb.com/)  and assign connection link to environment variables **`DATABASE_URI`** 
- Create your cloudinary configuration to host your static files (images) and assign parameters to the variables   **`CLOUDINARY_NAME,
CLOUDINARY_API_KEY, and
CLOUDINARY_API_SECRET`** accordingly.
- Create Tokens and assing to the variables **``ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET``** guides [generate-base64](https://generate.plus/en/base64) 


<br>

- ``
$ git clonehttps://github.com/Aimeana100/portifolio-backend.git
 ``
 - ``$ npm install `` to install dependencies.

```
$ npm start
``` 
to start server


## Development
- For contributions: 
### Pre-Requisites
List all the pre-requisites the system needs to develop this project.
- Operating Computer with and OS installed.
- Git installed.
- Node.js installed.


### Development Environment
- Follow the instructions listed above for installation.

### Build
##### Build is automatic when `npm start` is called.

### Deployment
Deployment instructions.


### Contribution

 Your contributions are always welcome and appreciated. Following are the things you can do to contribute to this project.

 1. **Report a bug** <br>
 If you think you have encountered a bug, and I should know about it, feel free to report it [here]() and I will take care of it.

 2. **Request a feature** <br>
 You can also request for a feature [here](), and if it will viable, it will be picked for development.  

 3. **Create a pull request** <br>
 It can't get better then this, your pull request will be appreciated by the community. You can get started by picking up any open issues from [here]() and make a pull request.

 > If you are new to open-source, make sure to check read more about it [here](https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source) and learn more about creating a pull request [here](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github).


### Branches

 I use an agile continuous integration methodology, so the version is frequently updated and development is really fast.

1. **`develop`** is the development branch.

2. **`master`** is the production branch.

3. No other permanent branches should be created in the main repository, you can create feature branches but they should get merged with the master.

**Steps to work with feature branch**

1. To start working on a new feature, create a new branch prefixed with `feat` and followed by feature name. (ie. `feat-FEATURE-NAME`)
2. Once you are done with your changes, you can raise PR.

**Steps to create a pull request**

1. Make a PR to `stage` branch.
2. Comply with the best practices and guidelines e.g. where the PR concerns visual elements it should have an image showing the effect.
3. It must pass all continuous integration checks and get positive reviews.

After this, changes will be merged.


### Guideline
- write clear code



##  License
All rights reserved.  Anathole [link]()