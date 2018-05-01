const { loadSimplified } = require("cedict-lookup")
const pinyin = require("pinyin")
const program = require("commander")
const fs = require("fs")
const { stringify } = require("csv")

const dict = loadSimplified("./cedict_ts.u8")

const first3000Hanzi = JSON.parse(String(fs.readFileSync('./3000hanzi.json')))

const testHanzi = first3000Hanzi[0]


