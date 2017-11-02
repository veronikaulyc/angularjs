'use strict';

angular.module('tileApp')
  .controller('FinishedController',['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {

    const msInSec = 1000;
    const msInMin = 60000;
    $scope.steps = $stateParams.steps;
    const runTime = parseInt($stateParams.runningTime);
    if (runTime < msInSec / 10) { $scope.runningTime = `${runTime} ms`; }
    else if (runTime < msInMin) {
      $scope.runningTime = `${(runTime / msInSec).toFixed(2)} sec`;
    }
    else {
      $scope.runningTime = `${parseInt(runTime / msInMin)}:${parseInt((runTime % msInMin) / msInSec)}minutes`;
    }

    $scope.startOver = () => {
      $state.go('app');
    };

    $scope.hovered = (param) => {
      const checkIcon = document.querySelector('#checkIcon');
      if (param) { checkIcon.classList.add('hovered'); }
      else { checkIcon.classList.remove('hovered'); }
    };
  }]);
