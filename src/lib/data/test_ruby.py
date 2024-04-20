import ujson

with open('cedict.json', 'r', encoding='utf-8') as file:
    cedict = ujson.load(file)

    for word, entries in cedict.items():
        # print(word, entries)
        
        for entry in entries:
            if len(entry[0].replace(' - ', ' ').split(' ')) != len(word):
                print(word, entry)
                print(entry[0].replace(' - ', ' ').split(' '))
