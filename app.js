var width = window.innerWidth;
var height = window.innerHeight;


const arr_shapes = [];

// stage
var stage = new Konva.Stage({
    container: 'canvas',
    width: 0.94*width,
    height: 0.65*height,
});


// layer
var layer = new Konva.Layer();


// ###################################################
// ################# CREATING SHAPES #################
// ###################################################

document.getElementById('addCircle').addEventListener('click', addCircle);
document.getElementById('addLine').addEventListener('click', addLine);
document.getElementById('addRectangle').addEventListener('click', addRectangle);
document.getElementById('addEllipse').addEventListener('click', addEllipse);
document.getElementById('addArc').addEventListener('click', addArc);
document.getElementById('addStar').addEventListener('click', addStar);
document.getElementById('addRing').addEventListener('click', addRing);
document.getElementById('addText').addEventListener('click', addText);



function addCircle() {
    let circle = new Konva.Circle({
        x: stage.width() / 2 + Math.random() * 100,
        y: stage.height() / 2 + Math.random() * 100,
        radius: 100,
        fill: 'green',
        draggable: true,
    
        name: 'select'
    });
    
    arr_shapes.push(circle);
    layer.add(circle);
    circle.cache();
}

function addRectangle() {
    let rect = new Konva.Rect({
        x: stage.width() / 2 + Math.random() * 100,
        y: stage.height() / 2 + Math.random() * 100,
        width: 300,
        height: 150,
        fill: 'green',

        draggable: true,
        name: 'select'
    });
    
    arr_shapes.push(rect);
    layer.add(rect);
    rect.cache();
}

function addEllipse() {
    let oval = new Konva.Ellipse({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radiusX: 100,
        radiusY: 50,
        fill: 'green',

        draggable: true,
        name: 'select',
    });
    
    arr_shapes.push(oval);
    layer.add(oval);
    oval.cache();
}

function addLine() {
    let line = new Konva.Line({
        x: stage.width() / 2,
        y: stage.height() / 2,
        points: [5, 100, 500, 150, 5, 100],
        stroke: 'black',
        strokeWidth: 4,

        draggable: true,
        name: 'select',
    });
    
    arr_shapes.push(line);
    layer.add(line);
    line.cache();
}

function addArc() {
    let arc = new Konva.Arc({
        x: stage.width() / 2,
        y: stage.height() / 2,
        innerRadius: 140,
        outerRadius: 170,
        angle: 90,
        fill: 'green',
        // stroke: 'black',

        draggable: true,
        name: 'select',
    });
    
    arr_shapes.push(arc);
    layer.add(arc);
    arc.cache();
}

function addRing() {
    let ring = new Konva.Ring({
        x: stage.width() / 2,
        y: stage.height() / 2,
        innerRadius: 40,
        outerRadius: 70,
        fill: 'green',
        // stroke: 'black',

        draggable: true,
        name: 'select',
    });
    
    arr_shapes.push(ring);
    layer.add(ring);
    ring.cache();
}

function addStar() {
    let star = new Konva.Star({
        x: stage.width() / 2,
        y: stage.height() / 2,
        numPoints: 6,
        innerRadius: 40,
        outerRadius: 70,
        fill: 'green',
        // stroke: 'black',

        draggable: true,
        name: 'select',
    });
    
    arr_shapes.push(star);
    layer.add(star);
    star.cache();
}

function addText() {
    let text = new Konva.Text({
        x: stage.width() / 2,
        y: 15,
        text: 'Add your Text here',
        fontSize: 30,
        fontFamily: 'Cambria',
        fill: 'green',

        draggable: true,
        name: 'select',
    });
    
    arr_shapes.push(text);
    layer.add(text);
    text.cache();
}


// ###################################################
// ################### TRANSFORM #####################
// ###################################################


var tr = new Konva.Transformer({
    ignoreStroke: true,
});
layer.add(tr);


// by default select all shapes
// tr.nodes([rect1, rect2, circle]);
tr.nodes(arr_shapes);

// add a new feature, lets add ability to draw selection rectangle
var selectionRectangle = new Konva.Rect({
    fill: '#cce0ff',
    opacity: 0.4,
    stroke: 'black',
    visible: false,
});

layer.add(selectionRectangle);

var x1, y1, x2, y2;

stage.on('mousedown touchstart', (e) => {
    // do nothing if we mousedown on any shape
    if (e.target !== stage) {
        return;
    }
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
});

stage.on('mousemove touchmove', () => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
        return;
    }

    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
    });
});

stage.on('mouseup touchend', () => {
    // do nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
        return;
    }
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
        selectionRectangle.visible(false);
    });

    var shapes = stage.find('.select');
    var box = selectionRectangle.getClientRect();
    var selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    tr.nodes(selected);
});

// clicks should select/deselect shapes
stage.on('click tap', function (e) {
    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
        return;
    }

    // if click on empty area - remove all selections
    if (e.target === stage) {
        tr.nodes([]);
        return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('rect')) {
        return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target), 1);
        tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = tr.nodes().concat([e.target]);
        tr.nodes(nodes);
    }
});



// add the layer to the stage
stage.add(layer);

layer.draw();


var json = stage.toJSON();
console.log(json);








// ####################################################
// ################## SAVE IMAGE ######################
// ####################################################



function downloadURI(url, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}


document.getElementById('save').addEventListener('click', function () {
      var dataURL = stage.toDataURL({ pixelRatio: 3 });
      downloadURI(dataURL, 'download.png');
    },
    false
);