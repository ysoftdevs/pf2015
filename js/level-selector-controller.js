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
            {state:'locked', text:'PF'},
        ];

    $scope.startLevel = function(state, levelIndex) {
        if (state != 'unlocked') {
            return;
        }
        
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
    
    $scope.cancelLevel = function(even, args) {
        $scope.isLevelSelectorVisible = true;
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
            // Load only state. Do not load titles or more items than are available.
            var limit = Math.min(value.length, $scope.levelLock.length);
            
            for (var index = 0; index < limit; index++) {
                $scope.levelLock[index]['state'] = value[index]['state'];
            }
        }
    };

    var init = function() {
        $scope.loadConfiguration();  
    };

    $rootScope.$on('completeLevel', $scope.completeLevel);
    $rootScope.$on('cancelLevel', $scope.cancelLevel);
    
    init();
    
});