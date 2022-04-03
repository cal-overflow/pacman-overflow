// import Path from './Path.js';
import Wall from './Wall.js';

const wallThickness = 8;

// Intersections join paths
// A corner intersection joins 1 horizontal and 1 vertical
// A Three-leg (T) intersection joins 2 horizontal and 1 vertical OR 1 horizontal and 2 vertical
// A four leg (+) intersection joins 2 horizontal and 2 vertical 

// GOAL:
// the Intersection object is created with all paths that need to be connected.
// The constructor determines the type of intersection (see above)

export default class Intersection {
  constructor(paths) {
    this.paths = paths;
    this.walls = [];
    this.isCorner = paths.length === 2;
    this.isThreeLeg = paths.length === 3;
    this.isFourLeg = paths.length === 4;

    // determine the coordinates of this intersection
    // determine any walls that may be associated with this intersection (corner has two, T has one)
    if (this.isCorner) {
      // create two wall objects, one horizontal and one vertical
      // the horizontal wall should be positioned BELOW if the vertical path is above the horizontal path
      // otherwise, the horizontal wall should be positioned ABOVE.
      const verticalPath = this.paths.find((path) => path.vertical);
      const horizontalPath = this.paths.find((path) => path.horizontal);


      // horizontal wall
      if (horizontalPath.center <= verticalPath.start) {
        // wall ABOVE
        this.walls.push(new Wall({
          x: verticalPath.walls[0].x,
          y: horizontalPath.walls[0].y,
          width: verticalPath.walls[1].x - verticalPath.walls[0].x + wallThickness,
          height: wallThickness
        }));
      }
      else {
        //   |
        // - x
        // wall BELOW
        this.walls.push(new Wall({
          x: verticalPath.walls[0].x,
          y: horizontalPath.walls[1].y,
          width: verticalPath.walls[1].x - verticalPath.walls[0].x + wallThickness,
          height: wallThickness
        }));
      }

      // vertical wall
      if (verticalPath.center <= horizontalPath.start) {
        // wall LEFT
        this.walls.push(new Wall({
          x: verticalPath.walls[0].x,
          y: horizontalPath.walls[0].y,
          width: wallThickness,
          height: horizontalPath.walls[1].y - horizontalPath.walls[0].y + wallThickness
        }));
      }
      else {
        // wall RIGHT
        this.walls.push(new Wall({
          x: verticalPath.walls[1].x,
          y: horizontalPath.walls[0].y,
          width: wallThickness,
          height: horizontalPath.walls[1].y - horizontalPath.walls[0].y + wallThickness
        }));
      }

      if (horizontalPath.end <= verticalPath.center) {
        horizontalPath.next = this;
        verticalPath.prev = this;
      }
      else {
        horizontalPath.prev = this;
        verticalPath.next = this;
      }
    }
    else {
      const verticalPaths = this.paths.filter((path) => path.vertical);
      const horizontalPaths = this.paths.filter((path) => path.horizontal);
      
      if (this.isThreeLeg) {
        if (verticalPaths.length === 2) {
          // 2 vertical paths, will need 1 vertical wall
          if (verticalPaths[0].center <= horizontalPaths[0].start) {
            // wall LEFT
            this.walls.push(new Wall({
              x: verticalPaths[0].walls[0].x,
              y: horizontalPaths[0].walls[0].y,
              width: wallThickness,
              height: horizontalPaths[0].walls[1].y - horizontalPaths[0].walls[0].y + wallThickness,
            }));
          }
          else {
            // wall RIGHT
            this.walls.push(new Wall({
              x: verticalPaths[0].walls[1].x,
              y: horizontalPaths[0].walls[0].y,
              width: wallThickness,
              height: horizontalPaths[0].walls[1].y - horizontalPaths[0].walls[0].y + wallThickness,
            }));
          }
        }
        
        if (horizontalPaths.length === 2) {
          // 2 horizontal paths, will need 1 horizontal wall
          if (horizontalPaths[0].center <= verticalPaths[0].start) {
            // wall ABOVE
            this.walls.push(new Wall({
              x: verticalPaths[0].walls[0].x,
              y: horizontalPaths[0].walls[0].y,
              width: verticalPaths[0].walls[1].x - verticalPaths[0].walls[0].x + wallThickness,
              height: wallThickness,
            }));
          }
          else {
            // wall BELOW
            this.walls.push(new Wall({
              x: verticalPaths[0].walls[0].x,
              y: horizontalPaths[0].walls[1].y,
              width: verticalPaths[0].walls[1].x - verticalPaths[0].walls[0].x + wallThickness,
              height: wallThickness,
            }));
          }
        }
      }

      if (this.isFourLeg) {
        // TODO
      }
    }
  }

  draw(ctx) {
    for (const wall of this.walls) {
      wall.draw(ctx);
    }
  }
}
