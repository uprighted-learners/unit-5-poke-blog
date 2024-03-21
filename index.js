const express = require("express");
const app = express();

app.use(express.json());

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

const pokemonDB = require("./pokemon.json");

app.get("/pokemon/:id", (req, res) => {
  // Req param is a string by default, we need to convert it so we can compare it to the ID in the DB
  const pokemonId = Number(req.params.id);
  const pokemon = pokemonDB.find((p) => p.id === pokemonId);
  console.log(pokemonId);
  res.json(pokemon);
});

app.get("/", (req, res) => {
  console.log("App is up and running!");
});

app.get("/pokemon", (req, res) => {
  res.json(pokemonDB);
});

app.get("/search", (req, res) => {
  const { hitPoints, attack, defense, ability } = req.query;
  const filtered = pokemonDB.filter((p) => {
    const hp = !hitPoints | (p.hitPoints === Number(hitPoints));
    const att = !attack | (p.attack === Number(attack));
    const def = !defense | (p.defense === Number(defense));
    const abils = !ability | p.abilities.includes(ability);

    return hp & att & def & abils;
  });

  res.json(filtered);
});

app.post("/pokemon", (req, res) => {
  const pokemon = req.body;

  console.log(pokemon);

  if (
    !pokemon.name ||
    !pokemon.hitPoints ||
    !pokemon.attack ||
    !pokemon.defense ||
    !pokemon.description ||
    !pokemon.abilities ||
    !pokemon.image
  ) {
    res.sendStatus(422);
  }

  pokemonDB.push({ ...pokemon, id: pokemonDB.length + 1 });
  res.sendStatus(204);
});
