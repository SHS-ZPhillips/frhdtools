// Applied globally on all textareas with the "autoExpand" class
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function() {
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function() {
        var minRows = this.getAttribute('data-min-rows') | 0,
            rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

function dl() {
    downloadFile(trackCode, 'track.txt', 'text/plain');
}

function downloadFile(data, filename, type) {
    var a = document.createElement("a"),
        file = new Blob([data], {
            type: type
        });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

var physicsCode = "";
var sceneryCode = "";
var powerupCode = "";
var trackCode;

function convertCode(str) {
    var num = parseInt(str, 10);
    return num.toString(32);
}

function getRand(min, max) {
    max = Math.ceil(max) + 1;
    min = Math.floor(min);
    return Math.floor(Math.random() * (max - min)) + min;
}

function addCheckpoint(x1, y1) {
    y1 = 0 - (y1 + 10);
    powerupCode = powerupCode + "C " + convertCode(x1) + " " + convertCode(y1) + ",";
}

function plusFractal(x1, y1, angle, iterations, size) {
    var x2 = x1 + Math.round(Math.cos(angle / 180 * Math.PI) * size);
    var y2 = y1 + Math.round(Math.sin(angle / 180 * Math.PI) * size);
    addLine(x1, y1, x2, y2);
    var x3 = x1 + Math.round(Math.cos((angle + 90) / 180 * Math.PI) * size);
    var y3 = y1 + Math.round(Math.sin((angle + 90) / 180 * Math.PI) * size);
    addLine(x1, y1, x3, y3);
    var x4 = x1 + Math.round(Math.cos((angle + 180) / 180 * Math.PI) * size);
    var y4 = y1 + Math.round(Math.sin((angle + 180) / 180 * Math.PI) * size);
    addLine(x1, y1, x4, y4);
    var x5 = x1 + Math.round(Math.cos((angle + 270) / 180 * Math.PI) * size);
    var y5 = y1 + Math.round(Math.sin((angle + 270) / 180 * Math.PI) * size);
    addLine(x1, y1, x5, y5);
    if (iterations !== 0) {

        plusFractal(x2, y2, angle + 45, iterations - 1, size * 0.5);
        plusFractal(x3, y3, angle + 45, iterations - 1, size * 0.5);
        plusFractal(x4, y4, angle + 45, iterations - 1, size * 0.5);
        plusFractal(x5, y5, angle + 45, iterations - 1, size * 0.5);
    }
}

function drawTree(x1, y1, angle, angleChange, iterations, size) {
    if (iterations !== 0) {
        var x2 = x1 + Math.round(Math.cos(angle / 180 * Math.PI) * size);
        var y2 = y1 + Math.round(Math.sin(angle / 180 * Math.PI) * size);
        addLine(x1, y1, x2, y2);
        drawTree(x2, y2, angle - angleChange, angleChange, iterations - 1, size * 0.8);
        drawTree(x2, y2, angle + angleChange, angleChange, iterations - 1, size * 0.8);
    }
}

function randTree(x1, y1, angle, angleChange, iterations, size) {
    if (iterations !== 0) {
        var x2 = x1 + Math.round(Math.cos(angle / 180 * Math.PI) * size);
        var y2 = y1 + Math.round(Math.sin(angle / 180 * Math.PI) * size);
        addLine(x1, y1, x2, y2);
        drawTree(x2, y2, angle - getRand(angleChange - 30, angleChange + 30), angleChange, iterations - 1, size * 0.8);
        drawTree(x2, y2, angle + getRand(angleChange - 30, angleChange + 30), angleChange, iterations - 1, size * 0.8);
    }
}

function rect(x, y, w, h) {
    addLine(x, y, x + w, y);
    addLine(x + w, y, x + w, y + h);
    addLine(x + w, y + h, x, y + h);
    addLine(x, y + h, x, y);
}

function fillRect(x, y, w, h) {
    addLine(x, y, x + w, y);
    addLine(x + w, y, x + w, y + h);
    addLine(x + w, y + h, x, y + h);
    addLine(x, y + h, x, y);

    for (var i = 1; i <= (h - 2); i++) {
        addLine(x + 1, y + i, x + w - 1, y + i);
    }
}

function addCircle(a, b, r) {
    var points[];
    var x, y, xx, yy, step;
    step = Math.round(r / 200);
    if (step < 5) {
        step = 5;
    }
    for (var i = 0; i <= 360; i += step) {
        x = a + Math.round(r * Math.cos(i / 180 * Math.PI));
        y = b + Math.round(r * Math.sin(i / 180 * Math.PI));
        points.push(x);
        points.push(y);
    }
    longLine(points);
}

function circle(a, b, r) {
    var points[];
    var step = 10;

    for (var i = a - Math.round(Math.cos(Math.PI / 4) * r) + 1; i < a + Math.round(Math.cos(Math.PI / 4) * r); i += step) {
        var x = i;
        var y = Math.sqrt(Math.pow(r, 2) - Math.pow(x - a, 2)) + b;
        points.push(x);
        points.push(y);
    }
    for (i = b + Math.round(Math.sin(Math.PI / 4) * r) + 1; i > b - Math.round(Math.sin(Math.PI / 4) * r); i -= step) {
        y = i;
        x = Math.sqrt(Math.pow(r, 2) - Math.pow(y - b, 2)) + a;
        points.push(x);
        points.push(y);
    }
    for (i = a + Math.round(Math.cos(Math.PI / 4) * r) + 1; i > a - Math.round(Math.cos(Math.PI / 4) * r); i -= step) {
        x = i;
        y = -Math.sqrt(Math.pow(r, 2) - Math.pow(x - a, 2)) + b;
        points.push(x);
        points.push(y);
    }
    for (i = b - Math.round(Math.sin(Math.PI / 4) * r) + 1; i < b + Math.round(Math.sin(Math.PI / 4) * r); i += step) {
        y = i;
        x = -Math.sqrt(Math.pow(r, 2) - Math.pow(y - b, 2)) + a;
        points.push(x);
        points.push(y);
    }
    longLine(points);
}

function fillCircle(a, b, r) {
    for (var i = r; i > 0; i--) {
        circle(a, b, i);
    }
}

function bezier(x1, y1, x3, y3, x2, y2, lineSegments) {
    x1=-x1;
    y1=-y1;
    x2=-x2;
    y2=-y2;
    x3=-x3;
    y3=-y3;
    
    var s = [];
    for (var i = 0; i <= lineSegments; i++) {
        s[i] = i / lineSegments;
    }

    var xCoords = [];
    for (i = 0; i < s.length; i++) {
        xCoords[i] = x1 + s[i] * (2 * x2 - 2 * x1 + s[i] * (x3 - 2 * x2 + x1));
    }
    var yCoords = [];
    for (i = 0; i < s.length; i++) {
        yCoords[i] = y1 + s[i] * (2 * y2 - 2 * y1 + s[i] * (y3 - 2 * y2 + y1));
    }
    var points = [];
    points.push(x1);
    points.push(y1);
    for (i = 0; i < xCoords.length - 1; i++) {
        points.push(xCoords[i]);
        points.push(yCoords[i]);
    }
    points.push(x3);
    points.push(y3);
    longLine(points);
}

function addLine(x1, y1, x2, y2) {
    y1 = 0 - y1;
    y2 = 0 - y2;
    physicsCode = physicsCode + "," + convertCode(x1) + " ";
    physicsCode = physicsCode + convertCode(y1) + " ";
    physicsCode = physicsCode + convertCode(x2) + " ";
    physicsCode = physicsCode + convertCode(y2);
}

function longLine(array) {
    physicsCode = physicsCode + ","
    for (var i = 0; i < array.length; i++) {
        if (i % 2 === 0) {
            array[i] = 0 - array[i];
        }
        physicsCode = physicsCode + convertCode(array[i]);
        if (i != array.length - 1) {
            physicsCode = physicsCode + " ";
        }
    }
}

function genTrack() {
    document.getElementById("output").value = "";
    trackCode = "";
    physicsCode = "";
    sceneryCode = "";
    powerupCode = "";
    var input = document.getElementById('input').value;
    eval(input);
    trackCode = physicsCode + "#" + sceneryCode + "#" + powerupCode;
}

function printCode() {
    document.getElementById("output").value = trackCode;
}

function copyCode() {
    document.getElementById("output").select();
    document.execCommand('copy');
}

function clearText() {
    document.getElementById("output").value = "";
    document.getElementById("input").value = "";
}