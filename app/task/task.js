'use strict';

angular.module('myApp.task', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/task/:id', {
    templateUrl: 'task/task.html',
    controller: 'TaskCtrl'
  });
}])

.controller('TaskCtrl', ['$scope', '$location','User', 'Task', function($scope, $location, User, Task) {

	$scope.showTask = function(){
		console.log('TaskCtrl editTask');
	};

	$scope.updateTask = function ($event) {
		var id = $($event.currentTarget).parent().find('input#inputTaskId').val();

		Task.updateTask(id);

	};
}]);