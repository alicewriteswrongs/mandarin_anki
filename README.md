# Utils for using anki to study Mandarin Chinese

## mandarin_to_anki.js

This is a little script for converting a list of new words into two sets
of flashcards for [Anki]. One set is for doing vocabulary / recognition
practice and the other for doing character writing practice. If you were
to, for instance, look up the word 你, you would get two cards:

```
first card:
front: 你
back: "nǐ, you (informal, as opposed to courteous 您[nin2])"

second card:
front: nǐ,
back: "你, you (informal, as opposed to courteous 您[nin2])"
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

## create_levels.js

This is my attempt to replicate [wanikani's](https://www.wanikani.com/)
learning style, but for Mandarin instead of Japanese. Basically, the Hanzi
found in the HSK standardized test are broken down into levels of 20 or so
Hanzi per level. Each level consists of the new radicals found in the
Hanzi in that level, the Hanzi themselves, and a collection of vocab words
which can be written with the Hanzi found in that level and previous
levels. Vocab is pulled from the HSK 1-5 vocab list, and a list of the
10000 most common words in Mandarin.

This strategy ends up greatly simplifying the task of learning a language
like Japanese or Chinese for English speakers. Instead of memorizing words
randomly, and learning a whole bunch of unrelated characters, the
relationships between characters, the radicals that comprise them, are
used to learn them in a structured way. Then the characters are reinforced
by learning tons and tons of vocab that uses them! It works very well on
wanikani, my hope is that it will work well for Mandarin as well (and
perhaps even for learning the Sino-Korean vocabulary in Korean...).

I haven't tried going through it yet myself though. I imagine it would
take a year or more to go through all the material and learn it, probably
by adding teh material to Anki or something similar one level at a time.
At some point in the future, when I want to start studying Mandarin, I'll
build a wanikani-esque web app which uses this list.
