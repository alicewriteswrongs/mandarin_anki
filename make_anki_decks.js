const { loadSimplified } = require("cedict-lookup")
const pinyin = require("pinyin")
const program = require("commander")
const fs = require("fs")
const { stringify } = require("csv")
const R = require("ramda")
const hanzi = require("@zurawiki/hanzi")

const dict = loadSimplified("./cedict_ts.u8")

// First we want to load the Hanzi, ordered by a distributed
// weighting algorithm based on radical components and frequency.
// This order is taken from here: http://learnm.org/indexE.php
const hanziDistributedWeightOrder = String(
  fs.readFileSync("./data/DNWorder.txt")
)
  .split("\n")
  .map(row => row.split(",")[0])

// We're going to organize the decks into 'levels' of 20 hanzi per level
const levels = R.splitEvery(20, hanziDistributedWeightOrder)

// we want to calculate the radicals which are unique to each level
// so we can group them with the hanzi that contain them
let allRadicals = []

const radicalsByLevel = levels.map(level => {
  // we only want the radicals which are new in this level
  const uniqueRadicals = R.compose(
    R.difference(R.__, allRadicals),
    R.chain(char => hanzi.decompose(char, 2).components)
  )(level)

  allRadicals = allRadicals.concat(uniqueRadicals)
  return uniqueRadicals
})
