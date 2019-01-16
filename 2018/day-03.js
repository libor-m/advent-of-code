// part 1 - rectangle overlaps (count squares with any overlap)
const input = $0.textContent.split('\n');

let parse_spec = (spec) => {
  const match = /^#[0-9]+ @ (\d+),(\d+): (\d+)x(\d+)$/.exec(spec);
  return match.slice(1).map(Number);
}

// run through all fields claimed by a single spec
function *claims(spec) {
  const [x, y, width, height] = parse_spec(spec);
  for (let i = x + 1; i <= x + width; i++) {
    for (let j = y + 1; j <= y + height; j++) {
      yield [i, j];
    }
  }
}

// collect all claims over the 'flattened' grid
var allClaims = input
  .filter(s => s.length)
  .reduce((acc, spec) => {
    for (let [claimx, claimy] of claims(spec)) {
      let cid = `${claimx}-${claimy}`;
      if (!acc[cid]) acc[cid] = [];
      // add this spec to collection of all claimants
      acc[cid].push(spec);
    }
    return acc;
  }, {});

// count fields with more claims
Object.values(allClaims).filter(claimers => claimers.length > 1).length

// 112378

// part 2 - find single non-overlapping claim

// use the map from part 1
var freeClaims = input
  .filter(s => s.length)
  .filter((spec) => {
    for (let [claimx, claimy] of claims(spec)) {
      let cid = `${claimx}-${claimy}`;

      // this is weird, but whatever, it just means free
      if (!allClaims[cid]) continue;

      // more claimants, just go away
      if (allClaims[cid].length > 1) return false;

      // check if the claimant is the current spec
      // go away if not (this is also werid, but ...)
      if (allClaims[cid][0] != spec) return false;
    }
    // all claimed fields are free
    return true;
  });

// 603