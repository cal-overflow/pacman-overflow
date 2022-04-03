export default class Path {
  constructor({ vertical, horizontal, center, start, end }) {
    this.id = Math.floor(Math.random() * 100);
    this.vertical = vertical;
    this.horizontal = horizontal;
    this.center = center;
    this.start = start;
    this.end = end;
    this.length = end - start;
  }
}
