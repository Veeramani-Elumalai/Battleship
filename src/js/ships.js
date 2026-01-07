class ship {
  constructor(length, hits = 0) {
    this.length = length;
    this.hits = hits;
    this.cells = [];
  }

  hit() {
    if(this.length >= this.hits) return this.sunk();
    return this.hits += 1;
  }

  sunk() {
    this.length >= this.hits;
    return 'Ship is sunking';
  }
}

export { ship };