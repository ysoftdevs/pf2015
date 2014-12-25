angular.module('level-selector', [])
.controller('LevelSelectorController', function($scope, $rootScope) {
    
    $scope.isLevelSelectorVisible = true;
    
    $scope.levelLock = [
            {state:'unlocked', text:'1'},
            {state:'locked', text:'2'},
            {state:'locked', text:'3'},
            {state:'locked', text:'4'},
            {state:'locked', text:'5'},
            {state:'locked', text:'6'},
            {state:'locked', text:'7'},
            {state:'locked', text:'8'},
            {state:'locked', text:'9'},
            {state:'locked', text:'10'},
            {state:'locked', text:'11'},
            {state:'locked', text:'12'},
            {state:'locked', text:'PF'}
        ];

    $scope.startLevel = function(levelIndex) {
        $scope.isLevelSelectorVisible = false;
        var args = {
            levelIndex: levelIndex
        };
        $rootScope.$emit('startLevel', args);
    };
    
});