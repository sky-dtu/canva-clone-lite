var width = window.innerWidth;
var height = window.innerHeight-50;


const arr_shapes = [];

// stage

var stage = new Konva.Stage({
    container: 'canvas',
    width: width,
    height: height,
});

// layer

var layer = new Konva.Layer();

// shape

var circle = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 100,
    fill: 'green',
    stroke: 'red',
    strokeWidth: 10,
    draggable: true,

    name: 'select'
});

arr_shapes.push(circle);


var rect1 = new Konva.Rect({
    x: 60,
    y: 60,
    width: 100,
    height: 90,
    fill: 'red',
    draggable: true,
    
    name: 'select',
});
layer.add(rect1);

arr_shapes.push(rect1);

var rect2 = new Konva.Rect({
    x: 250,
    y: 100,
    width: 150,
    height: 90,
    fill: 'green',
    draggable: true,

    name: 'select',
});
layer.add(rect2);

arr_shapes.push(rect2);


// ###################################################
// ###################################################
// ###################################################
// ###################################################


var tr = new Konva.Transformer({
    centeredScaling: false,
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



// events

circle.on('mouseover', function () {
    document.body.style.cursor = 'pointer';
});

circle.on('mouseout', function () {
    document.body.style.cursor = 'default';
});

circle.on ('mouseup', function() {
    this.fill('red');
    this.stroke('blue');
})

circle.on ('mousedown', function() {
    this.fill('blue');
    this.stroke('green');
    this.opacity(0.6);
})


// add the shape to the layer
layer.add(circle);

// add the layer to the stage
stage.add(layer);

layer.draw();


function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}


document.getElementById('save').addEventListener(
    'click',
    function () {
      var dataURL = stage.toDataURL({ pixelRatio: 4 });
      downloadURI(dataURL, 'stage.jpg');
    },
    false
);