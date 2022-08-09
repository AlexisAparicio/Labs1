var mymodule = angular.module('mymodule', ['ngSanitize']);

mymodule.controller("myController", function ($scope) {
    
    $scope.sides = 6;
    
    function Pair(x, y) {
        this.x = x;
        this.y = y;
    }
    
    function Grid(width, height) {
        this.width = width;
        this.height = height;
        var grid = [];
        var validPositions = [];
    
        for (var i = 0; i < width; i++) {
            grid.push([]);
            for (var j = 0; j < height; j++) {
                grid[i][j] = '_';
                validPositions.push(new Pair(i,j))
            }
        }
    
        this.getValidPositions = function() {
            return validPositions;
        }
    
        this.getGrid = function() {
            return grid;
        }
        
        //Position validation
        function isQueen(pair, x, y) {
            return pair.x == x && pair.y == y;
        }
        
        function isInRow(pair, y) {
            return pair.y == y;
        }
        
        function isInCol(pair, x) {
            return pair.x == x;
        }
        
        //Ex: 
        //3, 2 > 4, 1 = -1, 1
        //3, 2 > 4, 3 = -1, -1
        //3, 2 > 2, 1 = 1, 1
        //3, 2 > 2, 3 = 1, -1
        function isInDiagonal(pair, x, y) {
            if (Math.abs(pair.x - x) == Math.abs(pair.y - y)) {
                return true;
            }
            return false;
        }
        
        function testPosition(pair, x, y) {
            if (isQueen(pair, x, y) ||
                isInRow(pair, y) ||
                isInCol(pair, x) ||
                isInDiagonal(pair, x, y)) {
                return true;
            }
            return false;
        }
    
        function recomputeValid(validPositions, queenX, queenY) {
            var newValid = [];
            for (var i = 0; i < validPositions.length; i++) {
                if (!testPosition(validPositions[i], queenX, queenY)) {
                    newValid.push(validPositions[i]);
                }
            }
            return newValid;
        }
        
        function gridToString(grid) {
            var gridstr = '';
            for (var i = 0; i < grid.length; i++) {
                gridstr += '['
                for (var j = 0; j < grid[0].length; j++) {
                    gridstr += grid[i][j];
                    if (j < grid.length-1) {
                        gridstr += '|'
                    }
                }
                gridstr += ']'
                gridstr += '\n';
            }
            return gridstr;
        }
    
        var printGrid = function (grid) {
            console.log(gridToString(grid));
        }
    
        var solutions = [];
        $scope.solution_grids = [];
    
        function convertToSolution(grid) {
            var str = '';
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid.length; j++) {
                    if (grid[i][j] == 'Q') {
                        str += i + '#' + j;
                    }
                }
            }
            return str;
        }
        
        this.numcomputations = 0;
    
        this.solve = function (numQueens, grid, validPositions, startcol) {
            if (numQueens <= 1 && validPositions.length > 0) {
                grid[validPositions[0].x][validPositions[0].y] = 'Q';
                var solution = convertToSolution(grid);
                if (solutions.indexOf(solution) == -1) {
                    solutions.push(solution);
                    $scope.solution_grids.push(gridToString(grid));
                }
                grid[validPositions[0].x][validPositions[0].y] = '_'; //reset
                return true;
            } else if (numQueens > validPositions.length) {
                return false;
            } else {
                var x, y;
                var nextcol = validPositions.filter(function(point) {
                    return point.x == startcol + 1 ? true : false;
                });    //prune routes to only next col
                for (var i = 0; i < nextcol.length; i++) {
                    x = nextcol[i].x, y = nextcol[i].y;
                    grid[x][y] = 'Q';
                    this.solve(numQueens - 1, grid,
                               recomputeValid(validPositions, x, y), startcol+1);
                    grid[x][y] = '_';	//reset
                    this.numcomputations++;
                }
            }
        }
    }
    
    $scope.solve = function() {
        var nqueens = $scope.sides;
        var grid = new Grid(nqueens, nqueens);
        var startTime = new Date().getTime();
        console.log('Start Time: ' + startTime);
        grid.solve(nqueens, grid.getGrid(), grid.getValidPositions(), 0);
        $scope.numcomputations = grid.numcomputations;
        $scope.endTime = new Date().getTime() - startTime;
        console.log('End Time: ' + ($scope.endTime) + 'ms');
    };    
});

