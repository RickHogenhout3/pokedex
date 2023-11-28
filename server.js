const express = require('express');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit'); // Add this line
const app = express();
const port = 3000;

// Your JSON data
const movesData = require('./public/api/all_moves_data.json');
const naturesData = require('./public/api/natures.json');
const pokemonData = require('./public/api/all_pokemon_data.json');
const berryData = require('./public/api/all_berry_data.json');
const allTypesData = require('./public/api/all_types_data.json');

// Middleware to handle missing API key
const handleMissingApiKey = (req, res, next) => {
  const apiKey = req.params.apikey;

  // Check if the API key is missing
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is missing. Please provide a valid API key.' });
  }

  // API key is present, continue to the next middleware
  next();
};

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Define your API key
const YOUR_API_KEY = '123456789';

// Middleware to check for a valid API key
const checkApiKey = (req, res, next) => {
  const apiKey = req.params.apikey;

  // Check if the API key is valid
  if (apiKey !== YOUR_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key.' });
  }

  // API key is valid, continue to the next middleware
  next();
};

// Function to handle invalid ID
function handleInvalidId(res, paramName) {
  return res.status(400).json({ error: `Invalid ${paramName} ID. Please provide a valid number.` });
}

/**
 * @swagger
 * /{apikey}/types/{type?}:
 *   get:
 *     summary: Get data for all types or filter by a specific type.
 *     parameters:
 *       - name: apikey
 *         in: path
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *       - name: type
 *         in: path
 *         required: false
 *         description: Type to filter (optional)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: The type name
 *                   example: Water
 *               # Add other properties...
 */
app.all('/:apikey/types/:type?', checkApiKey, (req, res) => {
  const requestedType = req.params.type;
  const apiKey = req.params.apikey;

  // Check if a type is provided
  if (requestedType) {
    const typeLowerCase = requestedType.charAt(0).toUpperCase() + requestedType.slice(1).toLowerCase();
    const typeData = allTypesData[typeLowerCase];

    if (!typeData) {
      return res.status(404).json({ error: 'Type not found.' });
    }

    return res.json({ [typeLowerCase]: typeData });
  }

  // If no type is provided, return data for all types
  res.json(allTypesData);
});

/**
 * @swagger
 * /{apikey}/moves/{id?}:
 *   all:
 *     summary: Get move data by ID or filter by type and damage class.
 *     parameters:
 *       - name: apikey
 *         in: path
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: false
 *         description: Move ID (optional)
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: type
 *         in: query
 *         required: false
 *         description: Move type (optional)
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         required: false
 *         description: Move name (optional)
 *         schema:
 *           type: string
 *       - name: damageClass
 *         in: query
 *         required: false
 *         description: Move damage class (optional)
 *         schema:
 *           type: string
 *       - name: sortBydamageClass
 *         in: query
 *         required: false
 *         description: Sort order for damage class (optional)
 *         schema:
 *           type: string
 *           enum: ['asc', 'desc']
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Move'
 */
app.all('/:apikey/moves/:id?', (req, res) => {
  const moveId = req.params.id;
  const moveType = req.query.type;
  const moveName = req.query.name;
  const movedamageClass = req.query.damageClass;
  const sortBydamageClass = req.query.sortBydamageClass; // New parameter for sorting

  // Check if an ID is provided
  if (moveId) {
    const parsedMoveId = parseInt(moveId);

    // Check if the move ID is a valid number
    if (isNaN(parsedMoveId)) {
      return handleInvalidId(res, 'move');
    }

    const move = movesData.find(move => move.id === parsedMoveId);

    // Check if the move was found
    if (!move) {
      return res.status(404).json({ error: 'Move not found.' });
    }

    // Send the move data
    return res.json(move);
  }

  // If no ID is provided, filter moves by name
  if (moveName) {
    const matchingMoves = movesData.filter(move => {
      return move.name.toLowerCase().includes(moveName.toLowerCase());
    });

    if (matchingMoves.length === 0) {
      return res.status(404).json({ error: 'Move not found.' });
    }

    // Send the matching moves data
    return res.json(matchingMoves);
  }

  // If no ID is provided, filter moves by type and damage class
  let filteredMoves = movesData;

  if (moveType) {
    const typeLowerCase = moveType.toLowerCase();
    filteredMoves = filteredMoves.filter(move => move.type.includes(typeLowerCase));
  }

  if (movedamageClass) {
    const damageClassLowerCase = movedamageClass.toLowerCase();
    filteredMoves = filteredMoves.filter(move => move.damage_class.includes(damageClassLowerCase));
  }

  // Sorting based on damage class
  if (sortBydamageClass) {
    const sortOrder = sortBydamageClass === 'asc' ? 1 : -1;
    filteredMoves.sort((a, b) => {
      const damageClassA = a.damage_class.toLowerCase();
      const damageClassB = b.damage_class.toLowerCase();
      return sortOrder * damageClassA.localeCompare(damageClassB);
    });
  }

  // Send the filtered move data
  res.json(filteredMoves);
});

/**
 * @swagger
 * /{apikey}/berries/{id?}:
 *   get:
 *     summary: Get berry data by ID or filter by name.
 *     parameters:
 *       - name: apikey
 *         in: path
 *         required: true
 *         description: API key for authentication
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: false
 *         description: Berry ID (optional)
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: name
 *         in: query
 *         required: false
 *         description: Berry name (optional)
 *         schema:
 *           type: string
 *       - name: natural-gift-type
 *         in: query
 *         required: false
 *         description: Natural gift type (optional)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Berry'
 */
app.get('/:apikey/berries/:id?', checkApiKey, (req, res) => {
  const berryId = parseInt(req.params.id);
  const berryName = req.query.name;
  const berryNaturalGiftType = req.query['natural-gift-type']; // Extract the value from the query parameter
  const apiKey = req.params.apikey;

  // Check if an ID is provided
  if (berryId) {
    const parsedBerryId = parseInt(berryId);

    // Check if the berry ID is a valid number
    if (isNaN(parsedBerryId)) {
      return handleInvalidId(res, 'berry');
    }

    const berry = berryData.find(berry => berry.id === parsedBerryId);

    // Check if the berry was found
    if (!berry) {
      return res.status(404).json({ error: 'Berry not found.' });
    }

    // Send the berry data
    return res.json(berry);
  }

  // If no ID is provided, filter berries by name
  if (berryName) {
    const matchingBerries = berryData.filter(berry => {
      return berry.name.toLowerCase().includes(berryName.toLowerCase());
    });

    if (matchingBerries.length === 0) {
      return res.status(404).json({ error: 'Berry not found.' });
    }

    // Send the matching berries data
    return res.json(matchingBerries);
  }

  // If no ID is provided, filter berries by natural_gift_type
  if (berryNaturalGiftType) {
    const matchingBerries = berryData.filter(berry => {
      return berry.natural_gift_type.toLowerCase() === berryNaturalGiftType.toLowerCase();
    });

    if (matchingBerries.length === 0) {
      return res.status
(404).json({ error: 'Berry not found.' });
    }

    // Send the matching berries data
    return res.json(matchingBerries);
  }

  // If no filters are provided, return all berry data
  res.json(berryData);
});

// Endpoint to get natures data
app.get('/:apikey/natures', checkApiKey, (req, res) => {
  res.json(naturesData);
});

app.get('/:apikey/pokemon', checkApiKey, (req, res) => {
  const pokemonId = parseInt(req.query.id);
  const pokemonTypes = req.query.types;
  const pokemonName = req.query.name;

  // Check if more than one filter is provided
  if ((pokemonId && pokemonTypes) || (pokemonId && pokemonName) || (pokemonTypes && pokemonName)) {
    return res.status(400).json({ error: 'Please provide only one filter at a time: id, types, or name.' });
  }

  // Handle filtering by ID
  if (pokemonId) {
    if (isNaN(pokemonId)) {
      return handleInvalidId(res, 'pokemon');
    }

    const pokemonById = pokemonData.find(pokemon => pokemon.id === pokemonId);

    if (!pokemonById) {
      return res.status(404).json({ error: 'Pokemon not found.' });
    }

    return res.json(pokemonById);
  }

  // Handle filtering by types
  if (pokemonTypes) {
    const typesArray = pokemonTypes.split(',');

    const matchingPokemon = pokemonData.filter(pokemon => {
      return typesArray.every(type => pokemon.types.includes(type));
    });

    if (matchingPokemon.length === 0) {
      return res.status(404).json({ error: 'Pokemon not found.' });
    }

    return res.json(matchingPokemon);
  }

  // Handle filtering by name
  if (pokemonName) {
    const matchingPokemon = pokemonData.filter(pokemon => {
      return pokemon.name.toLowerCase().includes(pokemonName.toLowerCase());
    });

    if (matchingPokemon.length === 0) {
      return res.status(404).json({ error: 'Pokemon not found.' });
    }

    return res.json(matchingPokemon);
  }

  // If no filters are provided, return all data
  res.json(pokemonData);
});

// Serve Swagger UI at /api-docs endpoint
const swaggerSpec = require('./swagger'); // Adjust the path based on your project structure
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to handle missing API key - placed at the bottom
app.use(handleMissingApiKey);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});