
'use strict';

angular.module('tileApp')
  .controller('TilesController',[
    '$scope', '$interval', '$state','$stateParams', function($scope, $interval, $state, $stateParams) {

  $scope.colorA = "#ffc600";
  $scope.colorB = "#ff00df";
  $scope.colorC = "#1aff00";
  $scope.success = true;
  $scope.boardSize = 12;
  $scope.startTile = null;
  $scope.endTile = null;
  let choosingStart = false;
  let choosingEnd = false;


  $scope.tiles = [...Array($scope.boardSize * $scope.boardSize).keys()];
  $scope.rows = [...Array($scope.boardSize).keys()];

  $scope.handleClick = (event) => {
    event.stopPropagation();
    $scope.success = true;
    const tile = event.target;
    if (!choosingStart && !choosingEnd) {
      if (tile.classList.contains('unclicked')) {
        tile.classList.remove('unclicked');
        tile.classList.add('clicked');
      }
      else {
        tile.classList.remove('clicked');
        tile.classList.add('unclicked');
      }
    }
    else if (choosingStart) {
      if ($scope.startTile) {
        document.querySelector(`#${$scope.startTile}`).innerText = "";
      }
      event.target.innerText = "Start";
      $scope.startTile = tile.id;
      choosingStart = false;
    }
    else {
      if ($scope.endTile) {
        document.querySelector(`#${$scope.endTile}`).innerText = "";
      }
      event.target.innerText = "End";
      $scope.endTile = tile.id;
      choosingEnd = false;
    }
  };

  $scope.changeColor = (id, color) => {
    document.documentElement.style.setProperty(`--${id}`,
       color);
  };

  $scope.chooseStart = () => {
    choosingStart = true;
  };

  $scope.chooseEnd = () => {
    choosingEnd = true;
  };

  $scope.tileNotBlocked = (index) => {
    const tile = document.querySelector(`#t${index}`);
    return tile && tile.classList.contains('unclicked');
  };
  $scope.nextTiles = (index, visitedIndeces) => {
    const neighbours = [];
    const topTile = index < $scope.boardSize;
    const bottomTile = index > $scope.boardSize * ($scope.boardSize - 1) - 1;
    const leftTile = index % $scope.boardSize === 0;
    const rightTile = index % $scope.boardSize === $scope.boardSize -1;
    if (!topTile && $scope.tileNotBlocked(index - $scope.boardSize) &&
      (visitedIndeces.indexOf(index - $scope.boardSize) == -1)) {
      neighbours.push(index - $scope.boardSize);
    }
    if (!leftTile && $scope.tileNotBlocked(index - 1) && (visitedIndeces.indexOf(index - 1) == -1)) {
      neighbours.push(index - 1);
    }
    if (!rightTile && $scope.tileNotBlocked(index + 1) && (visitedIndeces.indexOf(index + 1) == -1)) {
      neighbours.push(index + 1);
    }
    if (!bottomTile && $scope.tileNotBlocked(index + $scope.boardSize) && (visitedIndeces.indexOf(index + $scope.boardSize) == -1)) {
      neighbours.push(index + $scope.boardSize);
    }
    return neighbours;
  };

  $scope.colorRoute = (index) => {
    if (index){
      const tile = document.querySelector(`#t${index}`);
      tile.classList.remove('unclicked');
      tile.classList.add('route');
    }
    };

    $scope.redirect = (startTime,steps) => {
      $state.go('app.finished', {
        steps: steps,
        runningTime: Date.now() - startTime
      });
    };

  $scope.buildRoute = () => {

    const startTime = Date.now();
    const routeStep = 100;
    const startIndex = parseInt($scope.startTile.slice(1));
    const endIndex = parseInt($scope.endTile.slice(1));

    const visitedIndeces = [];
    const queue = [];
    const parents = {};
    const route = [];

    let index = startIndex;

    while (true) {
      let neighbours = $scope.nextTiles(index, visitedIndeces);
      visitedIndeces.push(index);
      if (neighbours.indexOf(endIndex) !== -1) {
        break;
      }
      neighbours.forEach((neighbour) => {
        if (queue.indexOf(neighbour) === -1) {
          queue.push(neighbour);
          parents[neighbour] = index;
        }
        });
      if (queue.length > 0) {
        index = queue.shift();
      }
      else {
        $scope.success = false;
        break;
      }
    }
    if ($scope.success) {
      let childIndex = visitedIndeces.pop();
      while (childIndex !== startIndex){
        route.push(childIndex);
        childIndex = parents[childIndex];
      }

      if (route.length > 0) {
      let i = route.length;
      const interval = $interval(() => {
        $scope.colorRoute(route[i]);
        i--;
        if (i === -1) {
          $interval.cancel(interval);
          $scope.redirect(startTime, route.length);
        }
      }, routeStep);
    }
    else {
      $scope.redirect(startTime, 0);
    }
    }
  };

}]);
