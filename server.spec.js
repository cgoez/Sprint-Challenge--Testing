const mongoose = require("mongoose");
const request = require("supertest");

const Game = require("./games/Game");
const server = require("./server");

describe("Games", () => {
  beforeAll(() => {
    return mongoose
      .connect("mongodb://localhost/test")
      .then(() => console.log("\n=== connected to TEST DB ==="));
  });

  afterAll(() => {
    return mongoose
      .disconnect()
      .then(() => console.log("\n=== disconnected from TEST DB ==="));
  });

  let gameId;
  // // hint - these wont be constants because you'll need to override them.

  beforeEach(() => {
    //   // write a beforeEach hook that will populate your test DB with data
    //   // each time this hook runs, you should save a document to your db
    //   // by saving the document you'll be able to use it in each of your `it` blocks
    const zelda = new Game({
      title: "The Legend of Zelda",
      genre: "Action-Adventure",
      releaseDate: "1986"
    });

    zelda
      .save()
      .then(game => {
        gameId = game._id.toString();
      })
      .catch(error => {
        console.log(error);
      });
  });

  afterEach(() => {
    //   // clear collection.
    return Game.remove();
  });

  it("runs the tests", () => {});

  // test the GET here
  describe("GET /api/games", () => {
    it("should return OK games as JSON objects", async () => {
      const response = await request(server).get("/api/games");

      expect(response.status).toEqual(200);
      expect(response.type).toBe("application/json");
      expect(response.body).toHaveLength(2);
    });
  });

  // test the POST here
  describe("POST /api/games", () => {
    it("should post a new game to database as a JSON object", async () => {
      const duckHunt = {
        title: "Duck Hunt",
        genre: "Shooter",
        releaseDate: "1985"
      };

      const response = await request(server)
        .post("/api/games")
        .send(duckHunt);

      expect(response.status).toEqual(201);
      expect(response.type).toBe("application/json");
      expect(response.body).toMatchObject(duckHunt);
    });

    it("should respond to invalid POST if title or genre fields missing", async () => {
      const mysteryGame = {
        title: "",
        genre: "",
        releaseDate: "1985"
      };

      const response = await request(server)
        .post("/api/games")
        .send(mysteryGame);

      expect(response.status).toEqual(500);
    });
  });

  // Test the DELETE here
  describe("DELETE /api/games", () => {
    it("should delete game :id", async () => {
      const fortnite = {
        title: "Fortnite",
        genre: "BR"
      };

      const badGame = await Game.create(fortnite);

      const response = await request(server).delete(`/api/games/${badGame._id}`);

      expect(response.status).toEqual(204);      
    });
  });
});
