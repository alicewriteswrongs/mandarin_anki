const { loadSimplified } = require("cedict-lookup")
const pinyin = require("pinyin")
const program = require("commander")
const fs = require("fs")
const { stringify } = require("csv")
const R = require('ramda')
const hanzi = require('@zurawiki/hanzi')

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

const allRadicals = new Set
const radicalsByLevel = levels.map(level => {
  const radicals = level.map(char => hanzi.decompose(char, 2)).reduce((acc, result) => acc.concat(result.components), [])
})

const testHanzi = first3000Hanzi[0]
