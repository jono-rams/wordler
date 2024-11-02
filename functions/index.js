const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();

app.use(cors({
  origin: "https://wordler.jono-rams.work",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); // To parse JSON request bodies

// In-memory storage for word-user pairs (replace with a database in a real app)
const wordByUser = {};

app.use(express.static(path.join(__dirname, '..', 'build'))); 

app.get('/new-word', async (req, res) => {
    const uid = uuidv4();

    try {
      // Promise that resolves after a timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Primary API timeout'));
        }, 250);
      });

      // Race between the API call and the timeout
      const response = await Promise.race([
        fetch("https://random-word-api.herokuapp.com/word?length=5"),
        timeoutPromise,
      ]);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      wordByUser[uid] == data[0];
      res.json({uid});
    } catch (err) {
      console.error('Error fetching word from primary API:', err);

      try {
        const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        wordByUser[uid] = data[0];
        console.log(wordByUser[uid]);
        res.json({uid});
      } catch (err) {
        console.error('Error fetching word from fallback API:', err);
        setError(true);
      }
    }
});

app.post('/guess', (req, res) => {
  const { uid, guess } = req.body;
  console.log(req.body);
  const secretWord = wordByUser[uid];

  if (!secretWord) {
    res.status(400).json({ error: 'Invalid session id' });
  }

  const result = compareWords([...secretWord], [...guess]);
  console.log(result);
  res.json({ result });
});

// Function to compare words (you'll need to implement the Wordle logic here)
function compareWords(secretWord, guess) {
  let result = guess.map((letter) => {return {key: letter, color: 'grey'}});

  // find any green letters
  result.forEach((letter, index) => {
    if (secretWord[index] === letter.key) {
      result[index].color = 'green';
      secretWord[index] = null;
    }
  });

  // find any yellow letters
  result.forEach((letter, index) => {
    if (secretWord.includes(letter.key) && letter.color !== 'green') {
      result[index].color = 'yellow';
      secretWord[secretWord.indexOf(letter.key)] = null;
    }
  });

  return result;
}

app.get('/solution', (req, res) => {
  const uid = req.query.uid;
  const solution = wordByUser[uid];
  res.json({ solution });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));