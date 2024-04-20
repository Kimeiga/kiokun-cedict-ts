/* eslint-disable no-control-regex */
import cedict from '$lib/data/cedict.json';
import t2s from '$lib/data/t2s.json';
import ids from '$lib/data/ids.json';
// import { fail } from '@sveltejs/kit';

function generateComparisonString(simp, trad) {
	if (simp.length !== trad.length) {
		throw new Error('Strings must be of the same length.');
	}

	const result = Array.from(simp).map((char, i) =>
		char === trad[i] ? '・' : { simp: char, trad: trad[i] }
	);
	return {
		simpComparison: result.map((x) => (typeof x === 'string' ? x : x.simp)).join(''),
		tradComparison: result.map((x) => (typeof x === 'string' ? x : x.trad)).join('')
	};
}

/** @type {import('./$types').PageServerLoad} */
export const load = ({ params }) => {
	const { word } = params;
	console.log(word);

	const [entries, simpWord] = getWordFromCedict(word);

	for (const entry of entries) {
		entry.simpRuby = getRuby(simpWord, entry.pinyin);
		if (entry.traditional) {
			entry.tradRuby = getRuby(entry.traditional, entry.pinyin);
		}
	}

	return { word: simpWord, entries, substrings: getSubstrings(word) };

	// look for every combination of substrings in the dictionary
	// let components = {}
	// function getComponents(str, curr = '', index = 0) {
	//     if (str == '') {
	//         return
	//     }
	//     if (str.length == 1) {
	//         // now it is only a character, and we have to find its components via
	//     }
	//     // if (str.length == word.length){
	//     //     return
	//     // }
	//     if (index == str.length) {
	//         const component = getWordFromCedict(curr)
	//         if (component) {
	//             components[curr] = { word: component, components: getComponents[curr]}
	//             return components;
	//         }
	//         else {
	//             return;
	//         }
	//     }
	//     getComponents(str, curr, index + 1);
	//     getComponents(str, curr + str[index], index + 1);
	// }

	// getComponents(word)

	const substrings = [];

	for (let i = word.length - 1; i > 0; i--) {
		// i is length of window, 2, 1
		// console.log('i', i)
		for (let j = 0; j < word.length - i + 1; j++) {
			// console.log('j', j)
			const substring = word.slice(j, j + i);
			const [entries, _] = getWordFromCedict(substring);

			if (!entries) {
				continue;
			}

			const data = { word: substring, entries };

			if (substring.length == 1) {
				data.components = getComponents(substring);
			}

			if (data) {
				substrings.push(data);
			}

			// console.log(word.slice(j, j+i))
			// components.push(word.slice( j, j+ i))
		}
	}

	// let  components = [];
	// for (let i = 0; i < word.length; i++) {
	//     for (let j = i + 1; j < word.length + 1; j++){
	//         const substring = word.slice(i, j);
	//         const data = getWordFromCedict(substring);

	//         if (data) {
	//             let obj = { word: substring, data }

	//             if (substring.length == 1) {
	//                 obj['components'] = ids[substring]
	//             }
	//             components.push(obj)
	//         }
	//     }
	// }

	const simpRuby = getRuby(simpWord, entries[0][0]);
	const tradRuby = getRuby(entries[0][2], entries[0][0]);

	return { word: simpWord, entries, substrings, simpRuby, tradRuby };
};

const exceptions = {
	美国51区: [
		{ c: '美', p: 'měi' },
		{ c: '国', p: 'guó' },
		{ c: '51', p: 'wǔshíyī' },
		{ c: '区', p: 'qū' }
	],
	美國51區: [
		{ c: '美', p: 'měi' },
		{ c: '國', p: 'guó' },
		{ c: '51', p: 'wǔshíyī' },
		{ c: '區', p: 'qū' }
	],
	OK绷: [
		{ c: 'OK', p: 'ōukēi' },
		{ c: '绷', p: 'bēng' }
	],
	OK繃: [
		{ c: 'OK', p: 'ōukēi' },
		{ c: '繃', p: 'bēng' }
	],
	AA制: [
		{ c: 'AA', p: 'ēiēi' },
		{ c: '制', p: 'zhì' }
	],
	'21三体综合症': [
		{ c: '21', p: 'èrshíyī' },
		{ c: '三', p: 'sān' },
		{ c: '体', p: 'tǐ' },
		{ c: '综', p: 'zōng' },
		{ c: '合', p: 'hé' },
		{ c: '症', p: 'zhèng' }
	],
	'21三體綜合症': [
		{ c: '21', p: 'èrshíyī' },
		{ c: '三', p: 'sān' },
		{ c: '體', p: 'tǐ' },
		{ c: '綜', p: 'zōng' },
		{ c: '合', p: 'hé' },
		{ c: '症', p: 'zhèng' }
	],
	PO文: [
		{ c: 'PO', p: 'pīōu' },
		{ c: '文', p: 'wén' }
	]
};

function getRuby(word: string, pronunciation: string) {
	const toneMarks = ['āēīōūǖ', 'áéíóúǘ', 'ǎěǐǒǔǚ', 'àèìòùǜ'];

	function getTone(syllable: string) {
		syllable = syllable.replace(/\d/, '');

		for (let tone = 0; tone < toneMarks.length; tone++) {
			for (let char of toneMarks[tone]) {
				if (syllable.includes(char)) {
					return tone + 1;
				}
			}
		}

		return 5;
	}

	const result: { c: string; p: string; t?: number }[] = [];
	const pronunciationArray = pronunciation.replaceAll(' - ', ' ').split(' ');

	if (pronunciationArray.length !== word.length) {
		const exceptions: Record<string, { c: string; p: string; t: number }[]> = {
			美国51区: [
				{ c: '美', p: 'měi', t: 3 },
				{ c: '国', p: 'guó', t: 2 },
				{ c: '51', p: 'wǔ yī', t: 3 },
				{ c: '区', p: 'qū', t: 1 }
			],
			美國51區: [
				{ c: '美', p: 'měi', t: 3 },
				{ c: '國', p: 'guó', t: 2 },
				{ c: '51', p: 'wǔ yī', t: 3 },
				{ c: '區', p: 'qū', t: 1 }
			],
			OK绷: [
				{ c: 'OK', p: 'ō kē', t: 1 },
				{ c: '绷', p: 'bēng', t: 1 }
			],
			OK繃: [
				{ c: 'OK', p: 'ō kē', t: 1 },
				{ c: '繃', p: 'bēng', t: 1 }
			],
			AA制: [
				{ c: 'AA', p: 'ēi ēi', t: 1 },
				{ c: '制', p: 'zhì', t: 4 }
			],
			'21三体综合症': [
				{ c: '21', p: 'èr yī', t: 4 },
				{ c: '三', p: 'sān', t: 1 },
				{ c: '体', p: 'tǐ', t: 3 },
				{ c: '综', p: 'zōng', t: 1 },
				{ c: '合', p: 'hé', t: 2 },
				{ c: '症', p: 'zhèng', t: 4 }
			],
			'21三體綜合症': [
				{ c: '21', p: 'èr yī', t: 4 },
				{ c: '三', p: 'sān', t: 1 },
				{ c: '體', p: 'tǐ', t: 3 },
				{ c: '綜', p: 'zōng', t: 1 },
				{ c: '合', p: 'hé', t: 2 },
				{ c: '症', p: 'zhèng', t: 4 }
			],
			PO文: [
				{ c: 'PO', p: 'pō', t: 1 },
				{ c: '文', p: 'wén', t: 2 }
			]
		};

		if (word in exceptions) {
			return exceptions[word];
		}

		if (/^[\x00-\x7F]*$/.test(word)) {
			return [{ c: word, p: pronunciation, t: getTone(pronunciation) }];
		}

		if (word.length === 1) {
			return { c: word, p: pronunciation, t: getTone(pronunciation) };
		}
	}

	for (const [i, character] of Array.from(word).entries()) {
		result.push({ c: character, p: pronunciationArray[i], t: getTone(pronunciationArray[i]) });
	}

	return result;
}

function getComponents(character) {
	if (!(character in ids)) {
		return null;
	}

	const results = [];

	for (const component of ids[character]) {
		const obj = { word: component, entries: getWordFromCedict(component)[0] };

		const components = getComponents(component);
		if (components != null) {
			obj.components = components;
		}

		results.push(obj);
	}

	return results;
}

function getSubstrings(
	word: string,
	originalWord: string = word,
	processedSubstrings: Set<string> = new Set()
): any[] {
	const substrings = [];
	let startIndex = 0;
	while (startIndex < word.length) {
		let endIndex = Math.min(word.length, startIndex + originalWord.length - 1);
		let found = false;
		while (endIndex > startIndex) {
			const substring = word.slice(startIndex, endIndex);

			if (substring == '病') {
				debugger;
			}
			if (processedSubstrings.has(substring)) {
				endIndex--;
				continue;
			}
			processedSubstrings.add(substring);
			const [entries, _] = getWordFromCedict(substring);
			if (entries) {
				const data: any = { word: substring, entries };
				if (substring.length === 1) {
					data.components = getComponents(substring);
				}
				if (substring.length < originalWord.length) {
					data.substrings = getSubstrings(substring, originalWord, processedSubstrings);
				}
				substrings.push(data);
				found = true;
				break;
			}
			endIndex--;
		}
		startIndex++; // Increment startIndex by 1 instead of setting it to endIndex
	}
	return substrings;
}

function mapEntries(e, simpWord) {
	console.log(e, simpWord);

	const entry = e.map(([pinyin, definition, traditional]) => {
		const base = {
			simplified: simpWord,
			pinyin,
			definition,
			traditional: traditional || simpWord
		};

		if (traditional) {
			const { simpComparison, tradComparison } = generateComparisonString(simpWord, traditional);
			return {
				...base,
				simpComparison,
				tradComparison
			};
		}

		return base;
	});

	return entry;
}

// // Replace the existing substring generation code with the following:
// const substrings = getSubstrings(word);

function getWordFromCedict(word: string) {
	// console.log('word', word)
	if (word in cedict) {
		return [mapEntries(cedict[word], word), word];
	} else {
		// create simplified version of word by converting all of the characters
		const simpWord = [...word].map((c) => (c in t2s ? t2s[c] : c), '').join('');

		// console.log(simpWord)

		if (simpWord != word && simpWord in cedict) {
			return [mapEntries(cedict[simpWord], simpWord), simpWord];
		} else {
			return [null, null];
		}
	}
}
