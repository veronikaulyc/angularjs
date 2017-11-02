'use strict';

angular.module('tileApp', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'content': {
                        templateUrl : 'tiles-view.html',
                        controller  : 'TilesController'
                    },
                }
            })
            // route for the finished page
            .state('app.finished', {
                url:'finished',
                views: {
                    'content@': {
                        templateUrl : 'finished-view.html',
                        controller  : 'FinishedController',
                    }
                },
                params: {
                  steps: 0,
                  runningTime: 0
            }
          })

        $urlRouterProvider.otherwise('/');
    });
