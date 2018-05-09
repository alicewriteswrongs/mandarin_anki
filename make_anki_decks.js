const { loadSimplified } = require("cedict-lookup")
const pinyin = require("pinyin")
const program = require("commander")
const fs = require("fs")
const { stringify } = require("csv")
const R = require("ramda")
const hanzi = require("@zurawiki/hanzi")

const dict = loadSimplified("./data/cedict_ts.u8")

// First we want to load the Hanzi, ordered by a distributed
// weighting algorithm based on radical components and frequency.
// This order is taken from here: http://learnm.org/indexE.php
const getHanziDistributedWeightOrder = () => {
  return String(fs.readFileSync("./data/DNWorder.txt"))
    .split("\n")
    .map(row => row.split(",")[0])
}

const hanziDistributedWeightOrder = getHanziDistributedWeightOrder()

// We're going to organize the decks into 'levels' of 20 hanzi per level
const levels = R.splitEvery(20, hanziDistributedWeightOrder)

// we want to calculate the radicals which are unique to each level
// so we can group them with the hanzi that contain them
const getRadicalsByLevel = levels => {
  let allRadicals = []
  return levels.map(level => {
    // we only want the radicals which are new in this level
    const uniqueRadicals = R.compose(
      R.reject(R.equals("No glyph available")),
      R.difference(R.__, allRadicals),
      R.chain(char => hanzi.decompose(char, 2).components)
    )(level)
    allRadicals = allRadicals.concat(uniqueRadicals)
    return uniqueRadicals
  })
}

const radicals = getRadicalsByLevel(levels)

// I scraped information about the meaning and pronunciation of the
// kangxi radicals from here: http://hanzidb.org/radicals
const radicalInfo = JSON.parse(
  String(fs.readFileSync("data/kangxi_radicals.json"))
)

// now lets try to find words, for each level, which only use the hanzi in that level
// it takes a little bit of time to calculate this for each level
//
// if this is done naively, it grabs almost every word defined in the dictionary
// so we do want to limit ourselves to words we're actually likely to encounter
// for this reason, we'll limit ourselves to words that are present on the HSK
// level 1-6 list.
//
// HSK vocab files taken from http://www.hskhsk.com/word-lists.html
const hskFilepaths = [
  "data/hsk_vocab/HSK Official 2012 L1.txt",
  "data/hsk_vocab/HSK Official 2012 L2.txt",
  "data/hsk_vocab/HSK Official 2012 L3.txt",
  "data/hsk_vocab/HSK Official 2012 L4.txt",
  "data/hsk_vocab/HSK Official 2012 L5.txt",
  "data/hsk_vocab/HSK Official 2012 L6.txt"
]

const getHSKVocab = R.compose(
  R.chain(R.map(R.trim)),
  R.map(R.split("\n")),
  R.map(String),
  R.map(fs.readFileSync)
)

const hskVocab = getHSKVocab(hskFilepaths)

const getVocabWordsByLevel = levels => {
  let hanziSoFar = []
  let wordsSoFar = []

  return levels.map((level, idx) => {
    console.log(`processing level ${idx + 1}`)
    const candidateWords = R.chain(
      char => hanzi.dictionarySearch(char).map(([entry]) => entry.simplified),
      level
    )
      .filter(word => !wordsSoFar.includes(word))
      .filter(word => hskVocab.includes(word))

    hanziSoFar = hanziSoFar.concat(level)
    const goodWords = candidateWords.filter(word => {
      for (let char of word.split("")) {
        if (!hanziSoFar.includes(char)) {
          return false
        }
      }
      return true
    })
    wordsSoFar = wordsSoFar.concat(goodWords)
    return goodWords
  })
}

const vocabWordsByLevel = getVocabWordsByLevel(levels)

const pairs = R.flatten(
  R.flatten(vocabWordsByLevel).map(word => dict.getMatch(word))
).map(entry => [entry.simplified, entry.english])

stringify(pairs, (err, output) => {
  fs.writeFileSync("pairs.csv", output)
})
