# Eeveelutions

Welcome to the Pokémon Data API! This API provides information about various aspects of the Pokémon world, including moves, types, berries, natures, and Pokémon themselves.

## Table of Contents

- [Eeveelutions](#project-name)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Rate Limiting](#rate-limiting)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Starting Up](#starting-up)
  - [Endpoints](#endpoints)
- [Acknowledgements](#acknowledgements)

## Features

- **Type Information**: Retrieve data for all Pokémon types or filter by a specific type.
- **Move Data**: Get details about Pokémon moves, either by ID or filter by type and damage class.
- **Berry Information**: Access information about berries, either by ID or filter by name.
- **Nature Data**: Retrieve information about different Pokémon natures.
- **Pokémon Details**: Get details about Pokémon, either by ID, type, or name.

## Rate Limiting
To ensure fair usage, this API implements rate limiting. Each IP is limited to **100 requests per 15 minutes.**

## Getting Started

### Prerequisites
- Node.js
- API Key = ```123456789```
- phpMyAdmin (only used if you connect  database)
- MySQL (only used if you connect  database)

### Installation

1. Clone the repository: ```git@bitlab.bit-academy.nl:felixhuel/eeveelutions.git```
![git@bitlab.bit-academy.nl:felixhuel/eeveelutions.git](images/clone.png)

2. Navigate to the project directory: ```cd your/path/eeveelutions```
![cd your/path/eeveelutions](images/navigate.png)

3. Install the dependencies: ```npm install```
![npm install](images/install.png)

4. **Optional**: Download [phpMyAdmin](https://www.phpmyadmin.net/downloads/) and import the database from the ```db``` folder. (You should link them together if wanted).

## Usage

### Starting Up
1. Start the server: ```npm start```
![npm start](images/start.png)

2. Open your browser and navigate to ```localhost:3000```

3. You can now use the API to retrieve data. For example, to get information about all Pokémon types, navigate to ```localhost:3000/types```

### Endpoints
- **Types**: ```localhost:3000/types```
- **Moves**: ```localhost:3000/moves```
- **Berries**: ```localhost:3000/berries```
- **Natures**: ```localhost:3000/natures```
- **Pokémon**: ```localhost:3000/pokemon```
- **API Key**: ```localhost:3000/apikey/endpoint```

## Acknowledgements
- Pokémon data source: [Pokémon API](https://pokeapi.co/)
- Rate Limit: [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)