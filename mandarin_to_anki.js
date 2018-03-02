const { loadSimplified } = require("cedict-lookup")
const pinyin = require("pinyin")
const program = require("commander")
const fs = require("fs")
const { stringify } = require("csv")

const dict = loadSimplified("./cedict_ts.u8")

const lookUpWord = word => {
  const [entry] = dict.getMatch(word)

  return {
    hanzi: entry.simplified,
    english: entry.english,
    pinyin: pinyin(word).join(" ")
  }
}

const processWords = words =>
  words.map(lookUpWord).reduce(([hanziToEn, pinyinToHanzi], entry) => {
    hanziToEn.push([entry.hanzi, `${entry.pinyin}\n${entry.english}`])
    pinyinToHanzi.push([entry.pinyin, `${entry.hanzi}\n${entry.english}`])
    return [hanziToEn, pinyinToHanzi]
  }, [[], []])

const getWordsFromFile = path =>
  fs.readFileSync(path).toString().trim().split("\n")

const writeRecordsToFile = (facts, filepath) =>
  stringify(facts, (err, output) => {
    fs.writeFileSync(filepath, output)
    console.log(`wrote ${filepath}`)
  })

program
  .description(
    "convert a list of words in Mandarin to two anki decks, one for reading and one for writing!"
  )
  .option("-i, --input <path>", "path to file with input (one word per line)")
  .parse(process.argv)

if (!program.input) {
  program.help()
} else {
  const words = getWordsFromFile(program.input)

  const [hanziToEn, pinyinToHanzi] = processWords(words)

  writeRecordsToFile(hanziToEn, "vocab.csv")
  writeRecordsToFile(pinyinToHanzi, "characters.csv")
}
