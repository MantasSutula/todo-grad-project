'use strict';

describe('todoList.version module', function() {
  beforeEach(module('todoList.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
