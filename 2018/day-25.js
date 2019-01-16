// part 1 - single linkage clustering in manhattan distance of 3, 4D points
// can be rephrased as connected components graph problem, solved with
// disjoint set forest
// https://en.wikipedia.org/wiki/Disjoint-set_data_structure

const input = $0.textContent
  .split("\n")
  .filter(s => s.length)
  .map(l => l.split(',').map(Number))

// sum of array
const sum = (arr) => arr.reduce((acc, x) => acc + x);

// manhattan distance of two vectors
const manhattan = (A, B) => sum(A.map((x, i) => Math.abs(x - B[i])))

// graph based solution

// return a list of edges where manhattan distance is less than threshold
// here some vp tree could improve the O(n^2), but for 1k+ points its too
// much work
var edges = (objs, threshold) => {
  const res = [];
  for (let from = 0; from < objs.length; from++) {
    for (let to = from + 1; to < objs.length; to++) {
      if (manhattan(objs[from], objs[to]) <= threshold) res.push([from, to]);
    }
  }

  return res;
}

// add all edges to the set
// `require('day-25-DisjointSet.js')` (paste it to the console;)
var s = new DisjointSet();
edges(input, 3).forEach(edge => s.AddEdge(edge[0], edge[1]))

// call makeset - find on all possible inputs
new Set(new Array(input.length).fill(0).map((e, i) => s.Find(s.MakeSet(i))))
// Set(324)


//
// scrap code
//  pure 'clustering based' solution is too resource (and my work) demanding
//

/* simple R code giving the correct solution
read.table("clipboard", header = F, sep = ",") -> d
dist(d, method = "manhattan") -> dmx
hclust(dmx, method = "single") -> cl
cutree(cl, h=3) -> groups
max(groups)
# 324
*/

// python's `setdefault`
const setdef = (d, k, def) => {
    if (!d[k]) d[k] = def;
    return d[k];
}

// distance matrix in object: {from: {to: dist ...}}
// `objs` is array of numeric arrays
// `df` is distance function
var dist = (objs, df) => {
  const res = {};
  for (let from = 0; from < objs.length; from++) {
    for (let to = from + 1; to < objs.length; to++) {
      let from_row = setdef(res, from, {});
      from_row[to] = df(objs[from], objs[to]);
    }
  }
  // add an empty last element
  res[objs.length - 1] = {};

  return res;
}

// symmetrize distance matrix
var symm = (dmx) => {
  const res = {};
  Object.keys(dmx)
    .forEach(from => {
      Object.keys(dmx[from])
        .forEach(to => {
          const from_row = setdef(res, from, {});
          from_row[to] = dmx[from][to];

          const to_row = setdef(res, to, {});
          to_row[from] = dmx[from][to];
        })
    });
  return res;
}

// agglomerative single linkage clustering using a distance matrix
// counts on a triangular dmx!
// BROKEN!
var clust = (dmx, threshold) => {
  // init all clusters separate
  const clust = {};
  Object.keys(dmx).forEach(k => clust[k] = k);

  // cluster until stabilized
  for(let nAssigned=-1;nAssigned != 0;) {
    nAssigned = 0;

    Object.keys(dmx).forEach(from => {
      Object.keys(dmx[from]).forEach(to => {

        // for all objects close enough, assign cluster
        if (dmx[from][to] <= threshold) {
          if (clust[to] != clust[from]) nAssigned++;
          clust[to] = clust[from];
        }
      });
    });
  }

  // return the assignments
  return clust;
}
