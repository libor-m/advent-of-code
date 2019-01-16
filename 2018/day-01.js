// sum of input
$0.textContent.split("\n").map(Number).reduce((acc, x) => acc + x)

// first repeated cumulative sum
function *infinite(arr) { while(true) { for (let a of arr)  yield a; }}
const input = $0.textContent.split("\n").map(Number);

function find(gen) {
    const seen = {};
    let sum = 0;
    let i = 0;

    for (let n of gen) {
        seen[sum] += 1;
        sum += n;
        i += 1;
        if (seen[sum]) {
            console.log('found at', i, seen[sum]);
            return sum;
        }
    }
}

console.log(`First repeated sum: `, find(infinite(input)));

// hack in R
// need to check the effectivity of this JS solution..
/*
library(tidyverse)
read.table("clipboard", header=F, col.names="change") -> d

# d$change %>% cumsum is bimodal, around 600 and around 81k
# every repetition increases the start by ~600, so we need so much repetitions
# that we reach the other mode to get a collision (~80k / 600)

rep(d$change, 140) %>%
  tibble(change = .) -> dN

dN %>%
  mutate(freq = cumsum(change),
         nr = row_number()) %>%
  group_by(freq) %>%
  mutate(n = n()) %>%
  filter(n > 1) %>%
  summarise(nr = max(nr)) %>%
  arrange(nr) %>%
  View

*/