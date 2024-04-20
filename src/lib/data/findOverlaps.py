import ujson


def find_overlapping_subwords(word, dictionary):
    n = len(word)
    valid_substrings = []

    # Check all substrings longer than 1 character
    for start in range(n):
        for length in range(2, n - start + 1):  # Only consider substrings of at least 2 characters
            substring = word[start : start + length]
            if substring in dictionary and substring != word:  # Avoid the whole word itself
                valid_substrings.append((substring, start, start + length - 1))

    # Find meaningful overlaps
    overlaps = []
    valid_substrings.sort(key=lambda x: x[1])  # Sort by starting index

    # Check for overlapping substrings without redundancies
    for i in range(len(valid_substrings)):
        for j in range(i + 1, len(valid_substrings)):
            if valid_substrings[i][2] >= valid_substrings[j][1] and valid_substrings[i][1] < valid_substrings[j][1]:
                overlaps.append((valid_substrings[i], valid_substrings[j]))

    return overlaps


# Example of usage
with open("cedict.json", "r") as f:
    cedict = ujson.load(f)
    for word, entry in cedict.items():
        overlaps = find_overlapping_subwords(word, cedict)
        if overlaps:
            print(f"Word: {word}, Overlaps: {overlaps}")
