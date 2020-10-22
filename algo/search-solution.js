console.log("Search Algorithm Set UP!");

function search(tiles) {
  let frontier = [];
  let explored = [];
  let goal = null;
  frontier.push(new State(tiles, 0, null, null))
  while (frontier.length > 0) {
    let node = getSmallestInFrontier(frontier);
    explored.push(node);
    if (isGoal(node)) {
      goal = node;
    }
    let childs = getChildState(node);
    for (let i = 0; i < childs.length; i++) {
      if (!isExplored(childs[i], explored)) {
        addToFrontier(childs[i], frontier);
      }
    }
  }
  console.log(goal);
}

function heuristicCost(tiles) {
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    let curr_position = {
      x: i % 3,
      y: Math.floor(i/3)
    };
    let solution_position = {
      x: tile % 3,
      y: Math.floor(tile/3)
    }
    return Math.abs(curr_position.x - solution_position.x) + curr_position.y - solution_position.y;
  }
}

class State {
  constructor(tiles, pathCost, previous, action){
    this.tiles = tiles;
    this.pathCost = pathCost;
    this.previous = previous;
    this.action = action;
  }

  getTotalCost() {
    return this.pathCost + heuristicCost(this.tiles);
  }

  equals(other) {
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i] != other.tiles[i])
        return false;
    }
    return true;
  }

  compareTo(other) {
    return this.getTotalCost() - other.getTotalCost();
  }
}

function getSmallestInFrontier(frontier) {
  let smallest = frontier[0];
  let indexSmallest = 0;
  for (let i = 1; i < frontier.length; i++) {
    if (frontier[i].compareTo(smallest) < 0) {
      smallest = frontier[i];
      indexSmallest = i;
    }
  }
  frontier.splice(indexSmallest, 1);
  return smallest;
}

function getChildState(state) {
  let indexOfZero = state.tiles.indexOf(8);
  let childs = [];
  let position = {
    x: indexOfZero % 3,
    y: Math.floor(indexOfZero/3)
  }
  if (position.x > 0) {
    childs.push(doAction(state, 'L'));
  }
  if (position.x < 2) {
    childs.push(doAction(state, 'R'));
  }
  if(position.y > 0) {
    childs.push(doAction(state, 'U'));
  }
  if(position.y < 2) {
    childs.push(doAction(state, 'D'));
  }
  return childs;
}

function doAction(state, action) {
  let newTiles = [...state.tiles]
  let i = state.tiles.indexOf(8);
  switch (action) {
    case 'L':
      newTiles[i] = state.tiles[i-1];
      newTiles[i-1] = state.tiles[i];
      break;
    case 'R':
      newTiles[i] = state.tiles[i+1];
      newTiles[i+1] = state.tiles[i];
      break;
    case 'U':
      newTiles[i-3] = state.tiles[i];
      newTiles[i] = state.tiles[i-3];
      break;
    case 'D':
      newTiles[i+3] = state.tiles[i];
      newTiles[i] = state.tiles[i+3];
  }
  return new State(newTiles, state.pathCost+1, state, action);
}

function isExplored(state, explored) {
  if (explored.length == 0) return false;
  return explored.some(exp => state.equals(exp));
}

function addToFrontier(state, frontier) {
  let equalIndex = frontier.findIndex(front => state.equals(front));
  if (equalIndex != -1) {
    let front = frontier[equalIndex];
    let smaller = front.compareTo(state) > 0 ? state : front;
    frontier[equalIndex] = smaller;
  } else {
    frontier.push(state);
  }
}

function isGoal(node) {
  return node.tiles.reduce((acc, curr, index) => {
    return acc && curr == index;
  }, true);
}

export { search, isGoal, State }
