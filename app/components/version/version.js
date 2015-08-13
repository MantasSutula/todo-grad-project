'use strict';

angular.module('todoList.version', [
  'todoList.version.interpolate-filter',
  'todoList.version.version-directive'
])

.value('version', '0.1');
