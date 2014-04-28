$(document).ready(function () {

    function createArray(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }
        return arr;
    }

    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");
    canvas.width = $("#game").width();
    canvas.height = $("#game").height();
    var width = Math.floor(canvas.width / 10);
    var height = Math.floor(canvas.height / 10);
    var grid1 = createArray(width, height);
    var grid2 = createArray(width, height);
    var paused = true;
    var refreshIntervalID;
    var deadColor = '#FFFFFF';
    var aliveColor = "#FF0000";
    initGrid(true);
    drawCells();

    function initGrid(random) {
        for (var x = 0; x < width; x+=1){
            grid1[x][0] = grid2[x][0] = false;
            grid1[x][width] = grid2[x][width] = false;
        }
        for (var y = 0; y < height; y+=1){
            grid1[0][y] = grid2[0][y] = false;
            grid1[height][y] = grid2[height][y] = false;
        }
        if(random) {
            for (var x = 1; x < width - 1; x += 1) {
                for (var y = 1; y < height - 1; y += 1) {
                    grid1[x][y] = grid2[x][y] = !Math.floor(Math.random() * 2);
                }
            }
        }
        else {
            for (var x = 1; x < width - 1; x += 1) {
                for (var y = 1; y < height - 1; y += 1) {
                    grid1[x][y] = grid2[x][y] = false;
                }
            }
        }
    }

    function nextGeneration(){
        for (var x = 1; x < width - 1; x += 1) {
            for (var y = 1; y < height - 1; y += 1) {
                var n = getNeighbors(x,y);
                if(grid1[x][y]){
                        grid2[x][y] = (n==2 || n==3);
                }
                else {
                        grid2[x][y] = (n==3);
                }
            }
        }
        var temp = grid2;
        grid2 = grid1;
        grid1 = temp;
    }

    function drawCells() {
        for (var x = 0; x < width; x += 1) {
            for (var y = 0; y < height; y += 1) {
                grid1[x][y] ? context.fillStyle = aliveColor : context.fillStyle = deadColor;
                context.fillRect(x * 10, y * 10, (x + 1) * 10, (y + 1) * 10);
            }
        }
       // aliveColor = "#"+((1<<24)*Math.random()|0).toString(16);
    }

    function getNeighbors(x,y){
        return grid1[x - 1][y] + grid1[x - 1][y - 1] + grid1[x - 1][y + 1] + grid1[x][y - 1] + grid1[x][y + 1] + grid1[x + 1][y] + grid1[x + 1][y + 1] + grid1[x + 1][y - 1];
    }

    $(window).keydown(function(e) {
        var code = e.which;
        if (code==13) {
            if (paused) {
                refreshIntervalID = setInterval(function () {
                    nextGeneration();
                    drawCells();
                }, 100);
            }
            else {
                clearInterval(refreshIntervalID);
            }
            paused = !paused;
        }
    });

});