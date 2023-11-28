# eeveelutions api

## server start-up
- firstly to make it install you need a to npm instapp express
- secondly npm init
- and npm install express-rate-limit
- and to start it up you just type in: node server.js


## api endpoints
### types

- "/types" will give u the all the types there are in the game and if they are effective against it or not effective against it

### moves
- "/moves" will show u all the moves in the game
- /moves/id will show the move with that id.
- /moves?type="type" gives you all the moves with that typing 
- /moves?damageClass=special" gives you all the moves from that 
### berries
- "/berries" provides you with all the data that there is over berries.
- /berries?name="berryName"gives all the data from that berry
- /berries?name="berryNaturalGiftType" shows you the berries that gives off to that specific typing
### pokemon
- "/pokemon" gives you the data that there is about pokemon
- /pokemon?id="id" will give you the pokemon with that id
- /pokemon?name="name" will give you the pokemon with that name
- /pokemon?type="type" will give you every pokemon that has a typing with the type you have said
- 

### natures
- "/natures" will give you every nature that a pokemon can have along with the stats that increase and decrease