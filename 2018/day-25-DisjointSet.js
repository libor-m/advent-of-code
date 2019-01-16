// a Disjoint Set structure with the classic optimizations
// (path compression and union by size)
// storing set data in an `Object`
// trying to avoid lookups with 'internal' API passing the objects instead of ids
//
// (c) Libor Morkovsky 2018

class DisjointSet {
  constructor() {
    this._data = {};
  }

  // 'safe' lookup, throws on invalid id
  _lookup(set_id) {
    if (this._data.hasOwnProperty(set_id)) {
      return this._data[set_id];
    }

    throw `set_id ${set_id} not in this._data`;
  }

  // adds creates a new set if not already present
  // return the set info
  MakeSet(set_id) {
    return this._make_set(set_id).self;
  }

  _make_set(set_id) {
    if (this._data.hasOwnProperty(set_id)) return this._data[set_id];

    const new_set = {
      self: set_id,
      parent: set_id,
      size: 1
    };
    this._data[set_id] = new_set;
    return new_set;
  }

  // Find wrapper using id
  Find(set_id) {
    return this._find(this._lookup(set_id)).self;
  }

  // Find with path compression, return the set object or the root
  _find(set_data) {
    // if nothing happens, we're the top element
    let res = set_data;

    // we're deeper in the tree, search on!
    if (set_data.parent !== set_data.self) {

      // follow the parent chain
      res = this._find(this._data[set_data.parent]);

      // compress the path
      set_data.parent = res.self;
    }
    return res;
  }

  // Union wrapper using id (return final root's id)
  Union(A_id, B_id) {
    const A_data = this._lookup(A_id);
    const B_data = this._lookup(B_id);

    return this._union(A_data, B_data).self;
  }

  // Union by size, return final root
  _union(A_data, B_data) {
    let A_root = this._find(A_data);
    let B_root = this._find(B_data);

    // already the same set
    if (A_root.self === B_root.self) return A_root;

    // find the bigger one, make A_root be the bigger one
    if (A_root.size < B_root.size) {
      [A_root, B_root] = [B_root, A_root];
    }

    // merge the smaller into the bigger
    B_root.parent = A_root.self;
    A_root.size += B_root.size;

    return A_root;
  }

  // convenience wrapper for Union with a lookup and makeset
  AddEdge(A_id, B_id) {

    // make sure both nodes exist
    const A_data = this._make_set(A_id);
    const B_data = this._make_set(B_id);

    return this._union(A_data, B_data).self;
  }
}
