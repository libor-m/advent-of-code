// part 1 - recursive text processing
var input = $0.textContent.split('\n')[0];

// use regex with backref - it fails on ccCC, producing non-overlapping matches..
var re = /(.{1})\1/ig
var round = (s) => s.replace(re, (m) => (m[0] == m[1]) ? m : '')


// regex-free round()
// find potential matches in locase version, check case mismatch
function round(s) {

	// trivial case
	if (s.length < 2) return s;

	let res = [];
	let lastMatch = -1;
	let lower = s.toLowerCase();
	for(let i = 1; i < s.length; i++) {

		//console.log(s[i - 1], s[i], res);

		// 'unit' match
		if (lower[i - 1] === lower[i]) {
			// 'polarity' match
			if (s[i - 1] !== s[i]) {
				// consume both the previous letter and the current one
				// by advancing the `i` - currently we're at the second
				// of the two
				lastMatch = i;
				i++;
				continue;
			}
		}

		// got no match on the previous letter, sure we can pass it through
		res.push(s[i - 1]);
	}

	// append last letter if there was no match at the end
	if (lastMatch != s.length - 1) res.push(s[s.length - 1]);

	return res.join('');
}


// run rounds until changes happen
var polymerize = (s) => {
	let new_s = '';
	for (; ; s = new_s) {
		new_s = round(s);
		// console.log(s.length, new_s.length);
		if (s.length == new_s.length) break;
	}
	return new_s;
}

polymerize(input).length

// 9390

// part 2 - remove all units of one type and react, find shortest result

// remove one letter, case insensitive
var rem_one = (s, which) => s.replace(new RegExp(which, 'gi'), '');

// call for each letter of alphabet
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

alphabet
  .map(letter => [letter, polymerize(rem_one(input, letter)).length])
  .sort((A, B) => (A[1] < B[1]) ? -1 : 1)

// 'u' does 5898
