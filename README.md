# Utils for using anki to study Mandarin Chinese

## mandarin_to_anki.js

This is a little script for converting a list of new words into two sets
of flashcards for [Anki]. One set is for doing vocabulary / recognition
practice and the other for doing character writing practice. If you were
to, for instance, look up the word 你, you would get two cards:

```
first card:
你,"nǐ, you (informal, as opposed to courteous 您[nin2])"

second card:
nǐ,"你, you (informal, as opposed to courteous 您[nin2])"
```

The first one shows you the character and asks for the pronunciation and
meaning, while the second gives you the pronunciation and asks for the
character. You can use the script by writing a newline-delimited file of
new words (one word per line) and calling

```
node mandarin_to_anki.js --input ./path/to/words.txt
```

It will then write two files in your current directory, `characters.csv`
and `vocab.csv`, which contain the different types of cards. You can then
import these `.csv` files into an existing Anki deck or create a new one
(I keep the two in two different decks so that they can be practiced
separately).

Happy studying!
