'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.main',
  'myApp.task',
  'myApp.version',
  'Tasks',
  'Users'
])

.config(['$routeProvider',  function($routeProvider) {
  $routeProvider
  .when('/task/:id',{
  	templateUrl: 'task/task.html',
  	controller: 'TaskCtrl'
  })
  .otherwise({redirectTo: '/main'});
}]);

angular.module('Tasks',[])

.factory('Task', function(){
	// Todo title 
	console.log('Task factory enter');
	var User = null;
	var currentUser = Parse.User.current();
		// One time
		// TODO check session token
		if (currentUser) {
			User = currentUser;
		}
		else {
			// 
			console.log('User must register...');
		}
		// get currentUser()
		// signUserUp()
		//
		// Session Token

	var TodoObject = Parse.Object.extend("TodoObject");
	return {
		// Initialize Parse Object User, toDo
		TodoObject: null,
		TodoObjectQuery: null,

		init: function(){
			// Fixme: cannot create...
			console.log('Factory rules');
			// Every adding task 
			this.TodoObject = new TodoObject();
		}
		//----------------------------------------------------------------
		,getTaskId: function ($event) {
			return $($event.currentTarget).attr('id');
		}
		//----------------------------------------------------------------
		,showTodoTask: function(){
			// Don't show if User not authorized
			if(!currentUser) {
				return false;
			}
			var TodoObjectQuery = new Parse.Query(TodoObject);
			// See documnetation...
			// this.TodoObjectQuery.select('title');
			
			var results = [];
			TodoObjectQuery.equalTo("user", currentUser);

			TodoObjectQuery.find({
			 success: function(results) {
			  	// TodoObject.attributes.title
			    
			    // results = results;
			    var todoTableResult = results;
			    var len = results.length;
			    for(var i = 0; i < len; i++){
			    	
				    // Add Table Row
					var $todoNewRow = $('#template .input-group').clone(true);
					// Add task to new row
					$todoNewRow.find('input').val(results[i].attributes.title);
					$todoNewRow.find('.input-group-addon.edit-todo-id').attr('id', results[i].id)
					var $todoTable = $('tbody');
					var td = $('<td/>').append($todoNewRow);
					var tr = $('<tr/>').append('<td/>',td);
					$todoTable.append(tr);
				}
			  }
			});
			return TodoObjectQuery;
		}
		//----------------------------------------------------------------
		// More like show for edition task
		,editTodoTask: function (taskId) {
			var TodoObjectQuery = new Parse.Query(TodoObject);
			
			TodoObjectQuery.equalTo('user', currentUser);

			TodoObjectQuery.get(taskId, {
			  success: function(todoTask) {
			    // The object was retrieved successfully.
				var $form = $('form');
				$form.find('input#inputTaskId').val(todoTask.id);
				$form.find('input#inputTitle').val(todoTask.attributes.title);
				$form.find('textarea[name="textareaDesc"]').val(todoTask.attributes.desc);
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and message.
			    console.log('Object', object, 'Error', error);
			  }
			});
			console.log('editTodoTask end');
		}
		//----------------------------------------------------------------
		,updateTask: function(taskId){
			var TodoObjectQuery = new Parse.Query(TodoObject);
			TodoObjectQuery.equalTo('user', currentUser);

			TodoObjectQuery.get(taskId, {
			  success: function(todoTask) {
			    // The object was retrieved successfully.
			    var $form = $('form');
				var title = $form.find('input#inputTitle').val();
				var desc = $form.find('textarea[name="textareaDesc"]').val();
				// Update todo object
				todoTask.set('title', title);
				todoTask.set('desc', desc);
				todoTask.save(null,{ 
									success: function(results) {
				   						console.log('Saved!');
				 				}});
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and message.
			    console.log('Object', object, 'Error', error);
			  }
			});
		}
		/*******************************
		 *** obj {title: '', desc: ''}
		********************************/
		,saveTodoTask: function (obj) {
			this.TodoObject.set('title', obj.title);
			this.TodoObject.set('desc', obj.desc);
			this.TodoObject.set('user', Parse.User.current());

			this.TodoObject.save(null, { 
									success: function(result) {
				   						// Add task id Edit Button
				   						$('table tbody tr').last().find('.edit-todo-id').attr('id', result.id);
				 				}}
			);
		}
		,deleteTodoTaskById: function (taskId) {
			var TodoObjectQuery = new Parse.Query(TodoObject);
			TodoObjectQuery.equalTo('user', currentUser);

			TodoObjectQuery.get(taskId, {
			  success: function(todoTask) {
			    // The object was retrieved successfully.
			    todoTask.destroy({});
			  },
			  error: function(object, error) {
			    // The object was not retrieved successfully.
			    // error is a Parse.Error with an error code and message.
			    console.log('Object', object, 'Error', error);
			  }
			});
		}


		

	};
});

angular.module('Users', [])
.factory('User', ['$location', '$route', function ($location, $route) {
	console.log('User factory enter');

	return {
		//----------------------------------------------------------------
		//*********************** User Object.....
		//----------------------------------------------------------------

		// Send User to Signup 

		// if exists to Lognin 
		currentUser: Parse.User.current()

		,routeUser: function () {
			$('#myModal').modal();
		}
		,signUserUp: function(obj){

			 var User = new Parse.User();
			// If not exists...
			User.set("username", obj.username);
			User.set("password", obj.password);
			User.set("email", obj.email);

			User.signUp(null, {
			  success: function(User) {
			    // Hooray! Let them use the app now. 
			    // Redirect to #/....
			    console.log('Singup done!');
			    $('#myModal').modal('hide');
			    // $location.path('#/');
			    // $route.reload();

			  },
			  error: function(User, error) {
			    // Show the error message somewhere and let the user try again.
			    console.log("Error: " + error.code + " " + error.message);
			  }
			});
		}
		,loginUser: function (obj) {

			var User = new Parse.User();
			var username = obj.username;
			var password =  obj.password;
			// Login form data
			User.logIn(username,password, {
				success: function(user) {
		            // An existing user has logged in and is now the Parse.User.current() user
		            // Do something
		            // $location.path('#/');
		            console.log('Login done!');
		        },
		        error: function(user, error) {
		            // Show the error message somewhere and let the user try again.
		            alert('Please, singup...');
		        }
			});
		}

	}
}]);