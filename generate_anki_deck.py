import genanki
import csv


hanzi_deck = genanki.Deck(
    2079969689,
    "Hanzi"
)


radical_model = genanki.Model(
    2024474028,
    'Radical',
    fields=[
        {"name": "sort"},
        {"name": "Radical"},
        {"name": "Traditional"},
        {"name": "Pinyin"},
        {"name": "Meaning"},
    ],
    templates=[
        {
            'name': 'Card 1',
            'qfmt': '{{Radical}}',
            'afmt': """{{FrontSide}}

<hr id=answer>

meaning: {{ Meaning }}
<br>
pinyin: {{Pinyin}}

{{#Traditional}}
this radical has a traditional variant: {{ Traditional }}
{{/Traditional}}"""
        },
    ],
    css=""".card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: black;
  background-color: #b96bff;
}"""
)


hanzi_model = genanki.Model(
    1886746147,
    "Hanzi",
    fields=[
        {"name": "sort"},
        {"name": "Hanzi"},
        {"name": "Definition"},
        {"name": "Traditional"},
        {"name": "Radicals"},
        {"name": "Pinyin"},
    ],
    templates=[
        {
            'name': 'Card 1: hanzi recognition',
            'qfmt': '{{Hanzi}}',
            'afmt': """{{FrontSide}}

<hr id=answer>

{{Definition}}
<br><br>
{{Pinyin}}
<br><br>
radicals: {{ Radicals }}
<br><br>
traditional form: {{Traditional}}"""
        },
        {
            'name': 'Card 2: reading to meaning',
            'qfmt': '{{Pinyin}}',
            'afmt': """{{FrontSide}}

<hr id=answer>

<br><br>
{{Hanzi}}
<br><br>
{{Definition}}

<br><br>
radicals: {{ Radicals }}
<br><br>
traditional form: {{Traditional}}"""
        },
    ],
    css=""".card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: black;
  background-color: #08ff00;
}"""
)


vocab_model = genanki.Model(
    1626888284,
    "Vocabulary",
    fields=[
        {"name": "sort"},
        {"name": "Word"},
        {"name": "Pinyin"},
        {"name": "Definition"},
    ],
    templates=[
        {
            'name': 'Card 1: hanzi recognition',
            'qfmt': '{{Word}}',
            'afmt': """{{FrontSide}}

<hr id=answer>

{{Pinyin}}
<br><br>
{{Definition}}
<br><br>
<a href="https://forvo.com/word/{{Word}}/#zh">
Pronunciation
</a>"""
        },
    ],
    css=""".card {
  font-family: arial;
  font-size: 20px;
  text-align: center;
  color: black;
  background-color: #00ffc3;
}"""
)


# read the CSV files produced by the node script
# so we can filter them and whatnot

def read_csv(filename):
    with open(filename) as csvfile:
        reader = csv.reader(csvfile)
        contents = [row for row in reader]
    return contents


radicals = read_csv("./radicals.csv")
hanzi = read_csv("./hanzi.csv")
vocab = read_csv("./vocab.csv")

# there are 139 levels
level_tags = [f"level{num}" for num in range(1, 139)]

def natural_numbers():
    n = 0
    while True:
        n += 1
        yield n

N = natural_numbers()

# this ugly loop puts the nodes into the deck in the order we want
# basically, sorted by level and then, within a level, it's radicals,
# hanzi, then vocab
for level in level_tags:
    radicals_for_level = filter(
        lambda row: row[4] == level,
        radicals,
    )
    for radical_fields in radicals_for_level:
        note = genanki.Note(
            model=radical_model,
            fields=[str(next(N))] + radical_fields[:-1],
            tags=[radical_fields[-1]]
        )
        hanzi_deck.add_note(note)

    hanzi_for_level = filter(
        lambda row: row[5] == level,
        hanzi,
    )
    for hanzi_fields in hanzi_for_level:
        note = genanki.Note(
            model=hanzi_model,
            fields=[str(next(N))] + hanzi_fields[:-1],
            tags=[hanzi_fields[-1]]
        )
        hanzi_deck.add_note(note)

    vocab_for_level = filter(
        lambda row: row[3] == level,
        vocab
    )
    for vocab_fields in vocab_for_level:
        note = genanki.Note(
            model=vocab_model,
            fields=[str(next(N))] + vocab_fields[:-1],
            tags=[vocab_fields[-1]]
        )
        hanzi_deck.add_note(note)

genanki.Package(hanzi_deck).write_to_file('hanzi.apkg')