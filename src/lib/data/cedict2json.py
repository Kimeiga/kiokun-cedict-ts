from collections import defaultdict
import ujson
import re

PinyinToneMark = {
    0: "aoeiuv\u00fc",
    1: "\u0101\u014d\u0113\u012b\u016b\u01d6\u01d6",
    2: "\u00e1\u00f3\u00e9\u00ed\u00fa\u01d8\u01d8",
    3: "\u01ce\u01d2\u011b\u01d0\u01d4\u01da\u01da",
    4: "\u00e0\u00f2\u00e8\u00ec\u00f9\u01dc\u01dc",
}


def decode_pinyin(s):
    s = s.lower()
    r = ""
    t = ""
    for c in s:
        if c >= "a" and c <= "z":
            t += c
        elif c == ":":
            if t and t[-1] == "u":
                t = t[:-1] + "\u00fc"
            else:
                r += t + ":"
                t = ""
        else:
            if c >= "0" and c <= "5":
                tone = int(c) % 5
                if tone != 0:
                    m = re.search("[aoeiuv\u00fc]+", t)
                    if m is None:
                        t += c
                    elif len(m.group(0)) == 1:
                        t = t[: m.start(0)] + PinyinToneMark[tone][PinyinToneMark[0].index(m.group(0))] + t[m.end(0) :]
                    else:
                        if "a" in t:
                            t = t.replace("a", PinyinToneMark[tone][0])
                        elif "o" in t:
                            t = t.replace("o", PinyinToneMark[tone][1])
                        elif "e" in t:
                            t = t.replace("e", PinyinToneMark[tone][2])
                        elif t.endswith("ui"):
                            t = t.replace("i", PinyinToneMark[tone][3])
                        elif t.endswith("iu"):
                            t = t.replace("u", PinyinToneMark[tone][4])
                        else:
                            t += "!"
            else:
                r += t + c
                t = ""
    r += t
    return r

def parse_cedict_line(line):
    if line.startswith("#"):
        return None
    parts = line.strip().split(" ")
    traditional = parts[0]
    simplified = parts[1]

    # Extracting pronunciation and definitions
    remaining = " ".join(parts[2:])
    pronunciation_start = remaining.find("[")
    pronunciation_end = remaining.find("]")
    pronunciation = remaining[pronunciation_start + 1: pronunciation_end]
    definitions = remaining[pronunciation_end + 2:].strip("/").replace("/", "; ")

    return {
        "t": traditional,
        "s": simplified,
        "p": pronunciation,
        "d": definitions,
    }

multiple_mappings = {}

def convert_cedict_to_json(cedict_file_path, output_file_path, trad_to_simp_file_path):
    cedict_object = defaultdict(list)
    trad_to_simp_mapping = {}

    with open(cedict_file_path, "r", encoding="utf-8") as cedict_file:
        for line in cedict_file:
            parsed_line = parse_cedict_line(line.strip())
            if parsed_line:
                entry = [
                    decode_pinyin(parsed_line["p"]),
                    parsed_line["d"],
                ]
                if parsed_line["s"] != parsed_line["t"]:
                    entry.append(parsed_line["t"])
                    for trad_char, simp_char in zip(parsed_line["t"], parsed_line["s"]):
                        if trad_char != simp_char:
                            if trad_char in trad_to_simp_mapping and trad_to_simp_mapping[trad_char] != simp_char:
                                print(trad_char, trad_to_simp_mapping[trad_char], simp_char)
                                if trad_char in multiple_mappings:
                                    multiple_mappings[trad_char].add(trad_to_simp_mapping[trad_char])
                                    multiple_mappings[trad_char].add(simp_char)
                                else:
                                    multiple_mappings[trad_char] = {trad_to_simp_mapping[trad_char], simp_char}
                            trad_to_simp_mapping[trad_char] = simp_char

                cedict_object[parsed_line["s"]].append(entry)

    with open(output_file_path, "w", encoding="utf-8") as output_file:
        ujson.dump(cedict_object, output_file, ensure_ascii=False, separators=(",", ": "))

    with open(trad_to_simp_file_path, "w", encoding="utf-8") as trad_to_simp_file:
        ujson.dump(trad_to_simp_mapping, trad_to_simp_file, ensure_ascii=False, separators=(",", ": "))

    print(multiple_mappings)


# Usage
convert_cedict_to_json("cedict_ts.u8", "cedict.json", "t2s.json")
