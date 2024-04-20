import ujson
import re


def parse_ids_line(line):
    if line.startswith("#"):
        return None
    parts = line.strip().split("\t")

    print(parts)

    character = parts[1]

    components = parts[2]
    components = re.sub("[⿳⿲⿰⿱⿹⿺⿸⿻⿵⿶⿷⿴]", "", components)
    components = re.sub("\[.*\]", '', components)

    return character, components

def convert_ids_to_json(ids_file_path, output_file_path):
    ids_object = {}

    with open(ids_file_path, "r", encoding="utf-8") as file:
        for line in file:
            if line.startswith("#"):
                continue
            [character, components] = parse_ids_line(line.strip())

            # disclude entries like x -> x
            if len(components) <= 1:
                continue

            if any(c in components for c in '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑲'):
                continue

            if components:
                ids_object[character] = components

    with open(output_file_path, "w", encoding="utf-8") as output_file:
        ujson.dump(ids_object, output_file, ensure_ascii=False, separators=(",", ": "))


# Usage
convert_ids_to_json("ids.txt", "ids.json")
