// part 1 - stats of stateful log parsing,
// find guard with most minutes slept, and his most favourite minute

// using `var` to avoid reloads on a train's wifi .. ;)
var input = $0.textContent.split('\n');

var input_sorted = input
  .filter(s => s.length)
  .sort()

var parse_line = (line) => {
    const match = /^\[1518-(\d{2}-\d{2}) \d{2}:(\d{2})\] (.*)$/.exec(line);
    return [match[1], Number(match[2]), match[3]];
}

var parsed = input_sorted.map(parse_line);

const setdef = (d, k, def) => {
    if (!d[k]) d[k] = def;
    return d[k];
}

// replay the logs over a little state machine
var guards = {};
var curGuard, lastSleep;
for (let [day, minute, msg] of parsed) {
    if (/Guard/.exec(msg)) {
        curGuard = msg;
    }
    else if (/falls/.exec(msg)) {
        lastSleep = minute;
    }
    else if (/wakes/.exec(msg)) {
        const guard = setdef(guards, curGuard, {});

        for (let m = lastSleep; m < minute; m++) {
            const min = setdef(guard, m, []);
            min.push(day);
        }
    }
}

// summary for each guard, total minutes sleeping, most probable minute
var summary = (guard) => {
    const total = Object.values(guard)
      .reduce((acc, days) => {
          return acc + days.length;
      }, 0);

    const best = Object.keys(guard)
      .map((min) => [min, guard[min].length])
      .sort((A, B) => (A[1] < B[1])? 1 : -1)
      [0]

    return [total, best[0], best[1]];
}

// sort out the summaries
Object.keys(guards)
  .map(guard => [guard, summary(guards[guard])])
  .sort((A, B) => (A[1][0] < B[1][0])? 1 : -1)


// guard #761 with 420 minutes, minute 25 (19025)

// part 2 -  most stable minute
Object.keys(guards)
  .map(guard => [guard, summary(guards[guard])])
  .sort((A, B) => (A[1][2] < B[1][2])? 1 : -1)

// guard #743 at minute 32 with 15 hits (23776)