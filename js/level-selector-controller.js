angular.module('level-selector', ['LocalStorageModule'])
.controller('LevelSelectorController', function($scope, $rootScope, localStorageService) {
    
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
    
    $scope.completeLevel = function(even, args) {
        var levelIndex = args.levelIndex;
        if (levelIndex + 1 < $scope.levelLock.length) {
            $scope.levelLock[levelIndex + 1].state = 'unlocked';
            $scope.storeConfiguration();
        }
    };
    
    $scope.storeConfiguration = function() {
        if (!localStorageService.isSupported) {
            return;
        }

        localStorageService.add('levelLock',$scope.levelLock);
    };
    
    $scope.loadConfiguration = function() {
        if (!localStorageService.isSupported) {
            return;
        }

        var value = localStorageService.get('levelLock');

        // store defaults
        if (!value) {
            $scope.storeConfiguration();
        } else {
            $scope.levelLock = value;
        }
    };

    var init = function() {
        $scope.loadConfiguration();  
    };

    $rootScope.$on('completeLevel', $scope.completeLevel);
    
    init();
    
});