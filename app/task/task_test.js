'use strict';

describe('myApp.task module', function() {

  beforeEach(module('myApp.task'));

  describe('task controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var taskCtrl = $controller('TaskCtrl');
      expect(taskCtrl).toBeDefined();
    }));

  });
});