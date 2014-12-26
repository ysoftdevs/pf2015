angular.module('app', ['angular-flippy', 'level-selector', 'level-complete'])
.controller('PexesoController', function($scope, $timeout, $rootScope) {
    
    $scope.isLevelVisible = false;
    
    $scope.levelIndex = 0;
    
    // How many cards must be found as the same.
    $scope.chainLength = 2;
    
    // Whic card types are active
    $scope.currentCardTypes = [ 'picture', 'picture' ];
    
    /**
     * Level descriptor:
     * 
     * totalCards - How many cards are on the board
     * chainLength - How many cards must be found from the same kind
     * cardType - Define type of game
     *  - picture - display image of item
     *  - "languageCode" - display text in specified language
     *  - oneLanguage - pickup one language for each card on the beginning of game
     *  - randomLanguage - each turn of card selects different language for the same item
     */
    $scope.levels = [
        {
            totalCards: 2*2,
            chainLength: 2,
            cardTypes: ['picture', 'picture']
        }, 
        {
            totalCards: 4*4, 
            chainLength: 2,
            cardTypes: ['picture', 'picture'] 
        }, {
            totalCards: 4*4,
            chainLength: 2,
            cardTypes: ['picture', 'en-US']
        }, {
            totalCards: 4*4,
            chainLength: 2,
            cardTypes: ['picture', 'oneLanguage']
        }, {
            totalCards: 4*4,
            chainLength: 2,
            cardTypes: ['picture', 'randomLanguage']
        }, {
            totalCards: 3*3,
            chainLength: 3,
            cardTypes: ['picture', 'picture', 'picture']
        }, {
            totalCards: 3*3,
            chainLength: 3,
            cardTypes: ['picture', 'randomLanguage', 'randomLanguage']
        }, {
            totalCards: 4*4,
            chainLength: 4,
            cardTypes: ['picture', 'randomLanguage', 'randomLanguage', 'randomLanguage']
        }
    ];
    
    $scope.currentLevel = $scope.levels[0];
    
    $scope.languages = {
        'cs-CZ': {
            title: 'Čeština'
        },
        'en-US': {
            title: 'English'
        },
        'sk-SK': {
            title: 'Slovenčina'
        }
    };
    
    $scope.basicCards = {
        'cherry' : {
            'cs-CZ': 'třešnička',
            'en-US': 'cherry',
            'sk-SK': 'čerešňa'
        },
        'cheese' : {
            'cs-CZ': 'sýr',
            'en-US': 'cheese',
            'sk-SK': 'syr'
        },
        'carrot' : {
            'cs-CZ': 'mrkev',
            'en-US': 'carrot',
            'sk-SK': 'mrkva'
        }, 
        'dwarf': {
            'cs-CZ': 'trpaslík',
            'en-US': 'dwarf',
            'sk-SK': 'trpaslík'
        },
        'barrel': {
            'cs-CZ': 'sud',
            'en-US': 'barrel',
            'sk-SK': 'sud'
        },
        'butterfly': {
            'cs-CZ': 'motýl',
            'en-US': 'butterfly',
            'sk-SK': 'motýľ'
        },
        'ghost': {
            'cs-CZ': 'duch',
            'en-US': 'ghost',
            'sk-SK': 'duch'
        },
        'rose': {
            'cs-CZ': 'růže',
            'en-US': 'rose',
            'sk-SK': 'ruža'
        },
        'sun': {
            'cs-CZ': 'slunce',
            'en-US': 'sun',
            'sk-SK': 'slnko'
        },
        'cloud': {
            'cs-CZ': 'oblak',
            'en-US': 'cloud',
            'sk-SK': 'oblak'
        }
    };
    
    
    $scope.cards = $scope.basicCards;
    $scope.maxSelected = 2;
    
    $scope.board = [];
    
    /**
     * Generate playing card object.
     */
    $scope.getCard = function(card, cardId, index) {
        return {
            cardId: cardId,
            card: card,
            cardType: 'picture',
            index: index,
            state: 'mystery',
            flipState: ''
        };
    };
    
    /**
     * Generate game board.
     */
    $scope.generateBoard = function(totalCount) {
        $scope.board = [];
        var fullStack = []
        var stack = [];
        angular.forEach($scope.basicCards, function(card, cardId) {
            fullStack.push($scope.getCard(card, cardId, 1));
        });
        
        for (var groupIndex = 0; groupIndex < totalCount / $scope.chainLength; groupIndex++) {
            var cardIndex = Math.floor((Math.random() * fullStack.length)); 
            var card = fullStack[cardIndex];
            fullStack.splice(cardIndex, 1);
            for (var instanceIndex = 0; instanceIndex < $scope.chainLength; instanceIndex++) {
                var tempCard = $scope.getCard(card, card.cardId, instanceIndex + 1);
                tempCard.cardType = $scope.currentCardTypes[instanceIndex];
                stack.push(tempCard);
            }
        }
        
        for (var index = 0; index < totalCount; index++) {
            var coordinate = Math.floor((Math.random()* stack.length));
            $scope.board.push(stack[coordinate]);
            stack.splice(coordinate, 1);
        }
    };
        
        
    $scope.selectionCounter = 0;    
    
    $scope.selectedCards = [];
    
    /**
     * Set state of all selected cards to defined state.
     */
    $scope.setSelectionState = function(state) {
        $scope.selectionCounter = 0;
        angular.forEach($scope.selectedCards, function(card) {
            card.state = state;
            if (state == "mystery") {
                card.flipState = '';
            } else {
                card.flipState = 'flipped';
            }
        });
        $scope.selectedCards = [];
    };    
    
    /**
     * Check whether all cards were selected.
     */
    $scope.areAllSelectedSame = function() {
        var previous = null;
        
        // At least two cards must match
        if ($scope.selectedCards.length < 2) {
            return false;
        }
        
        for (var index=0; index<$scope.selectedCards.length; index++) {
            
            var card = $scope.selectedCards[index];
            if (previous === null) {
                previous = card;
            } else {
                if (previous.cardId != card.cardId) {
                    return false;
                }
            }
        }
        return true;
    };
    
    /**
     * Check whether all items on the board are solved.
     */
    $scope.isLevelComplete = function() {
        for (var index=0; index < $scope.board.length; index++) {
            var item = $scope.board[index];
            if (item.state != "solved") {
                return false;
            }
        }
        return true;
    };
    
    /**
     * Reset selection of current cards
     */
    $scope.resetSelection = function() {
        $scope.setSelectionState('mystery');
    };
    
    /**
     * Click handler to select card.
     */
    $scope.selectCard = function(card) {
        // only mystery cards are processed
        if (card.state != 'mystery') {
            return;
        }
        
        $scope.selectionCounter += 1;
        

        if ($scope.selectionCounter == $scope.maxSelected + 1) {
            $scope.resetSelection();
            return;
        } else {
            $scope.selectedCards.push(card);
        }
        
        if (card.state == 'mystery') {
            card.state = 'selected' + $scope.selectionCounter;
            card.flipState = 'flipped';
        }
        
        if ($scope.areAllSelectedSame()) {
            $scope.setSelectionState('solved');
            if ($scope.isLevelComplete()) {
                $timeout($scope.completeLevel, 1000);
            }
        } else if ($scope.selectionCounter == $scope.maxSelected) {
            $timeout($scope.resetSelection, 1000);
        } 
        
    };
    
    
    /**
     * Start Level
     */
    $scope.initLevel = function(event, args) {
        $scope.levelIndex = args.levelIndex;
        $scope.currentLevel = $scope.levels[$scope.levelIndex];
        $scope.currentCardTypes = $scope.currentLevel.cardTypes;
        $scope.generateBoard($scope.currentLevel.totalCards);
        $scope.isLevelVisible = true;
    };
    
    /**
     * Level complete - display level outro screen.
     */
    $scope.completeLevel = function() {
        var args = {
            levelIndex: $scope.levelIndex
        };
        $rootScope.$emit('completeLevel', args);
    };
    
    $rootScope.$on('startLevel', $scope.initLevel);
    
});