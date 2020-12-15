const { ObjectID } = require("mongodb");
const dbConnection = require("../config/mongoConnection");
const dataMethods = require("../data/index");
// Create variables for each file
const userData = dataMethods.users;
const postsData = dataMethods.posts;
const moviesData = dataMethods.movies;
const commentsData = dataMethods.comments;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();
  // Create users
  const u1 = await userData.createUser(
    "BOb",
    "Smith",
    "fda",
    "bobsmith@gmail.com",
    "hello123"
  );
  const u2 = await userData.createUser(
    "Asif",
    "Uddin",
    "asifuddin",
    "uasif13@gmail.com",
    "Test123"
  );
  const u3 = await userData.createUser(
    "Charles",
    "Jones",
    "charlesjones",
    "charlesjones@gmail.com",
    "vampire"
  );
  const u4 = await userData.createUser(
    "Monica",
    "Smith",
    "smithica",
    "monicasmith@gmail.com",
    "tractor"
  );
  const m1 = await moviesData.createMovie(
    "Mulan",
    "this is the description for Mulan",
    ["Romance"],
    "2,000,000"
  );
  const m2 = await moviesData.createMovie(
    "fatman",
    "this is the description for fatman",
    ["Comedy"],
    "1,000,000"
  );
  const m3 = await moviesData.createMovie(
    "Avengers: Endgame",
    "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe.",
    ["Action","Science Fiction"],
    "356,000,000",
    "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRZlKhaFcACmjA1x3A5Ob3Kvbt7Wa0r8CJoCM9U7u05B1mtbhJr"
  );
  const m4 = await moviesData.createMovie(
    "The Dark Knight Rises",
    "It has been eight years since Batman (Christian Bale), in collusion with Commissioner Gordon (Gary Oldman), vanished into the night. Assuming responsibility for the death of Harvey Dent, Batman sacrificed everything for what he and Gordon hoped would be the greater good. However, the arrival of a cunning cat burglar (Anne Hathaway) and a merciless terrorist named Bane (Tom Hardy) force Batman out of exile and into a battle he may not be able to win.",
    ["Action", "Thriller"],
    "250,000,000",
    "https://soundvapors.com/wp-content/uploads/2020/06/The-Dark-Knight-Rises-683x1024.jpg"
  );
  const m5 = await moviesData.createMovie(
    "Thor",
    "The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.",
    ["Action", "Fantasy"],
    "150,000,000",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSXqpi4z8LN3B88RKYW5bzrm6BNZzS4Rn-5FfN83vZLQkvZZwOW",
  )
  const m6 = await moviesData.createMovie(
    "Ferris Bueller's Day Off",
    "Ferris Bueller (Matthew Broderick) has an uncanny skill at cutting classes and getting away with it. Intending to make one last duck-out before graduation, Ferris calls in sick, 'borrows' a Ferrari, and embarks on a one-day journey through the streets of Chicago. On Ferris' trail is high school principal Rooney (Jeffrey Jones), determined to catch him in the act.",
    ["Comedy","Teen"],
    "5,800,000",
    "https://images-na.ssl-images-amazon.com/images/I/91fOtWKp%2BCL._SY445_.jpg",
  )
  const p1 = await postsData.createPost(
    m4._id,
    u2._id,
    "Why does the Joker paint his face",
    "In Burton's Batman Jack Nicholson's Joker falls into a vat of chemicals which turns his skin pure white. In a couple of scenes he wears skin-colored makeup to appear more normal. In Nolan's The Dark Knight Heath Ledger's Joker has 'normal' skin and wears makeup to create Joker's trademark white skin look.",
    ["Question", "Discussion"],
    "https://static01.nyt.com/images/2019/10/06/arts/06jokers-ranked-ledger/06jokers-ranked-ledger-videoSixteenByNineJumbo1600.jpg"
  );
  const p2 = await postsData.createPost(
    m5._id,
    u3._id,
    "If Heimdall needs to eat, sleep, and drink, who guards the Bifrost when he does that?",
    "We see that Hiemdall guards the rainbow bridge called the Bifrost in Thor. Everyone has to eat, so who guards the Bifrost in Heimdalls absence?",
    ["Dicussion", "Question"],
    "https://i.pinimg.com/originals/6a/f8/59/6af859c26659f156cdade03b9cca0230.jpg"
  )
  const p3 = await postsData.createPost( m2._id,
    u1._id,
    "first post!",
    "description",
    [],
  );
  const p4 = await postsData.createPost(
    m1._id,
    u1._id,
    "Second post!",
    "description",
    [],
  );
  console.log("comment addition")
  const c1 = await commentsData.createComment(
    "I am so scared of Joker's face",
    p1._id,
    u3._id,
  )
  const c2 = await commentsData.createComment(
    "Hmm... Not too sure",
    p2._id,
    u2._id
  )
  console.log("Done seeding database");
  await db.serverConfig.close();
}
main().catch((error) => {
  console.log(error);
});

