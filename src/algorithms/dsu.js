// Disjoint Set Union with path compression + union by rank.
// Kept standalone so any future algorithm (e.g. Kruskal variants,
// cycle detection) can reuse it without touching UI code.
export class DSU {
  constructor(nodes) {
    this.parent = new Map()
    this.rank = new Map()
    nodes.forEach((n) => {
      this.parent.set(n, n)
      this.rank.set(n, 0)
    })
  }

  find(x) {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)))
    }
    return this.parent.get(x)
  }

  union(x, y) {
    const rx = this.find(x)
    const ry = this.find(y)
    if (rx === ry) return false

    const rankX = this.rank.get(rx)
    const rankY = this.rank.get(ry)
    if (rankX < rankY) {
      this.parent.set(rx, ry)
    } else if (rankX > rankY) {
      this.parent.set(ry, rx)
    } else {
      this.parent.set(ry, rx)
      this.rank.set(rx, rankX + 1)
    }
    return true
  }

  connected(x, y) {
    return this.find(x) === this.find(y)
  }
}
