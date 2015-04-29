//'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

myApp.controller('UserController', function($scope){
  var user = {};
  user.name = 'Daniel';
  user.email = 'kongdejia@aliyun.com';

  user.subscribe = function() {
    console.log(user.name + ', 您订阅的新闻将会发送到：' + user.email);
  }

  $scope.user = user;
});

myApp.controller('ShowController', function($scope){
  var shows = [
    {title: '浴血黑帮', subscribe: true},
    {title: '权力的游戏', subscribe: false},
    {title: '冰血暴', subscribe: true},
    {title: '摩登家庭', subscribe: true},
    {title: '行尸走肉', subscribe: false}
  ];

  $scope.shows = shows;
});

myApp.controller('FormController', function($scope){

    $scope.$watch('userForm', function(userForm) {
    });
});