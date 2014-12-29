angular.module('level-complete', [])
.controller('LevelCompleteController', function($scope, $rootScope) {
     
    $scope.isLevelCompleteVisible = false;
    
    $scope.isFinalScreenVisible = false;
    
    $scope.levelIndex = 0;
     
    $scope.completeLevel = function(event, args) {
        $scope.isLevelCompleteVisible = true;
        $scope.isFinalScreenVisible = args.isFinalLevel;
        $scope.levelIndex = args.levelIndex;
    };
     
    $scope.restartLevel = function() {
        $scope.isLevelCompleteVisible = false;
        var args = {
            levelIndex: $scope.levelIndex
        };
        $rootScope.$emit('startLevel', args);
    };
    
    $scope.nextLevel = function() {
        $scope.isLevelCompleteVisible = false;
        $scope.levelIndex++;
        var args = {
            levelIndex: $scope.levelIndex
        };
        $rootScope.$emit('startLevel', args);
    };
     
    $rootScope.$on('completeLevel', $scope.completeLevel);
    
});