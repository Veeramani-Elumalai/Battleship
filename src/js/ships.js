export default class ship {
  constructor(length, hits = 0) {
    this.length = length;
    this.hits = hits;
  }

  hit() {
    return (this.hits += 1);
  }

  sunk() {
    this.length >= this.hits;
    return 'Ship is sunking';
  }
}
