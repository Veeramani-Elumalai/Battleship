export default class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.isSunk = false;
  }

  hit() {
    if (this.isSunk) return;
    this.hits += 1;
    if (this.hits >= this.length) this.isSunk = true;
  }

  sunk() {
    if(this.hits >= this.length){
      return this.isSunk = true;
    }
  }
}

