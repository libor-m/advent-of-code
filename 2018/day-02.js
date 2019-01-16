// part 1 - find number of ids with at least one pair of identical letters
// and number of ids with at least one triple of identical letters
const input = $0.textContent.split('\n');

const count_chars = (acc, x) => {acc[x] = (acc[x] || 0) + 1; return acc};

const rep_n = (s, n) => Object.values(s
  .split('')
  .reduce(count_chars, {}))
  .filter((cnt) => cnt == n)
  .length > 0

// checksum
input.filter(s => rep_n(s, 2)).length * input.filter(s => rep_n(s, 3)).length
// 5166

// part 2 - find two ids differing by exactly one letter (hamming distance 1)

const hamming = (A, B) => A
  .split('')
  .map((c, idx) => c !== B[idx])
  .reduce((acc, x) => acc + x)

// brute force search, triangular matrix (do not do symmetrical comparisons)
input.forEach((s, idx) => {
    for(let j = idx + 1; j < input.length; j++) {
        if (hamming(s, input[j]) == 1) {
            console.log(s, input[j]);
        }
    }
});

// cypueihajytotrdkgzxfqplbwn cypueihajytomrdkgzxfqplbwn
// via highlight in vs code ;) cypueihajytordkgzxfqplbwn