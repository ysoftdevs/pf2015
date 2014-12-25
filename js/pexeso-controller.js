angular.module('app', ['angular-flippy'])
.controller('PexesoController', function($scope, $timeout) {
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
        'printer' : {
            'cs-CZ': 'tiskárna',
            'en-US': 'house',
            'sk-SK': 'tlačiareň'
        },
        'toner' : {
            'cs-CZ': 'toner',
            'en-US': 'toner',
            'sk-SK': 'toner'
        }, 
        'finisher': {
            'cs-CZ': 'finisher',
            'en-US': 'finisher',
            'sk-SK': 'finisher'
        },
        'paper': {
            'cs-CZ': 'papír',
            'en-US': 'paper',
            'sk-SK': 'papier'
        },
        'black': {
            'cs-CZ': 'černá',
            'en-US': 'black',
            'sk-SK': 'čierna'
        },
        'white': {
            'cs-CZ': 'bílá',
            'en-US': 'white',
            'sk-SK': 'biela'
        },
        'color': {
            'cs-CZ': 'barva',
            'en-US': 'color',
            'sk-SK': 'farba'
        },
        'duplexPrint': {
            'cs-CZ': 'oboustranný tisk',
            'en-US': 'duplex print',
            'sk-SK': 'obostranná tlač'
        },
        'stapler': {
            'cs-CZ': 'sešívačka',
            'en-US': 'stapler',
            'sk-SK': 'zošívačka'
        }
    };
    
    
    $scope.cards = $scope.basicCards;
    $scope.maxSelected = 2;
    
    $scope.board = [
        {
            cardId:'house',
            index:1,
            state: 'solved'
        }, { 
            cardId: 'dog',
            index:1,
            state: 'mystery'
        }, {
            cardId:'house',
            index:2,
            state: 'solved'
        }, {
            cardId:'printer',
            index:1,
            state: 'mystery'
        }, { 
            cardId: 'dog',
            index:2,
            state: 'mystery'
        },{
            cardId:'printer',
            index:2,
            state: 'mystery'
        }
        ];
    
    /**
     * Generate playing card object.
     */
    $scope.getCard = function(card, cardId, index) {
        return {
            cardId: cardId,
            card: card,
            index: index,
            state: 'mystery',
            flipState: ''
        };
    };
    
    /**
     * Generate playing board.
     */
    $scope.generateBoard = function(totalCount) {
        $scope.board = [];
        var stack = [];
        angular.forEach($scope.basicCards, function(card, cardId) {
            stack.push($scope.getCard(card, cardId, 1));
            stack.push($scope.getCard(card, cardId, 2));
        });
        
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
        } else if ($scope.selectionCounter == $scope.maxSelected) {
            $timeout($scope.resetSelection, 1000);
        } 
        
    };
    
    
    /**
     * Initialize game.
     */
    $scope.init = function() {
        $scope.generateBoard(4*4);
    };
    
});