'use strict';

angular.module('myApp.main', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main/main.html',
    controller: 'MainCtrl'
  });
}])

.controller('MainCtrl', ['$scope', '$location','User', 'Task', function($scope, $location, User, Task) {
	$scope.title = '';
	
	$scope.isLogin = 0;

	var res = Task.showTodoTask();

	$scope.wantToSignup = function($event){
		var isSignupText = $($event.currentTarget).text();
		if(isSignupText === 'Singup'){
			$('#signup-form').show(); 
			$('#login-form').hide();

			$($event.currentTarget).text('Login');
		} 
		else {
			$('#signup-form').hide(); 
			$('#login-form').show();

			$($event.currentTarget).text('Singup');	
		}
	}

	$scope.signup = function ($event) {
		// User data from singup form
		var $form = $($event.currentTarget).parent();
		var username = $('input#sgu-username').val();
		var email = $form.find('input#sgu-email').val();
		var password = $form.find('input#sgu-password').val();
		var password_conf = $form.find('input#sgu-conf-password').val();

		if (password === password_conf){
			// FIXME: password with plain text?!!
			User.signUserUp({email: email, username: username, password: password});
		} else {
			alert('Passwords do not match!')
		}
	}

	$scope.login = function ($event) {
		// User data from login form
		var $form = $($event.currentTarget).parent();
		var username = $form.find('input#username').val();
		var password = $form.find('input#password').val();

		// FIXME: Not in plain text!!!
		User.loginUser({username: username, password: password});
	}

	$scope.addTask = function(flag, $event) {

		if(!User.currentUser && !Parse.User.current()){
			$('#myModal').modal();
			return false;
		}

		if(flag) {
			$($event.currentTarget).attr('title', 'Cannot be empty.');
			return false;
		}
		Task.init();
		// Add Data to Parsecom
		Task.saveTodoTask(
			{
			 title: $scope.title, 
			 desc: ''
			}
			);
		$scope.counter++;
		// Add Table Row
		var $todoNewRow = $('#template .input-group').clone(true);
		// Add task to new row
		$todoNewRow.find('input').val($scope.title);
		var $todoTable = $('tbody');
		var td = $('<td/>').append($todoNewRow);
		var tr = $('<tr/>').append('<td/>',td);
		$todoTable.append(tr);

		// Empty original row
		$scope.title = '';
	}
	$scope.removeTask = function($event){

		var $tr = $($event.currentTarget).parents('tr');
		var isChecked = $tr.find('#todo-complited').is(':checked');

		if(isChecked){
			// Send task id to Parse.
			Task.deleteTodoTaskById($tr.find('.edit-todo-id').attr('id'));
			// Remove element
			$tr.remove();
			console.log('Removed');
		} else {
			alert('Check task to delete it.');
			console.log('Not checked...');
		}
		
	}
	$scope.editTask = function ($event) {
		// Opens task:id url
		var id = $($event.currentTarget).attr('id');

		$location.path('/task/' + id);
		Task.editTodoTask(id);
	}
	$scope.complitedTask = function ($event) {
		// Done class
		$($event.currentTarget).parents('div.input-group').find('input').toggleClass('done');
	};
}]);