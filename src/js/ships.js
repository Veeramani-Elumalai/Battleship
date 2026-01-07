class ship {
  constructor(length, hits = 0) {
    this.length = length;
    this.hits = hits;
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

module.exports = ship;
