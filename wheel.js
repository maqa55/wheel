function wheelOfFortune(selector) {
    const node = document.querySelector(selector);
    if (!node) return;

    const spin = node.querySelector('button');
    const wheel = node.querySelector('ul');
    let animation;
    let previousEndDegree = 0;

    spin.addEventListener('click', () => {
        if (animation) {
            animation.cancel();
        }

        const randomAdditionalDegrees = Math.random() * 360 + 1800;
        const newEndDegree = previousEndDegree + randomAdditionalDegrees;

        animation = wheel.animate([
            { transform: `rotate(${previousEndDegree}deg)` },
            { transform: `rotate(${newEndDegree}deg)` }
        ], {
            duration: 4000,
            direction: 'normal',
            easing: 'cubic-bezier(0.440, -0.205, 0.000, 1.130)',
            fill: 'forwards',
            iterations: 1
        });

        previousEndDegree = newEndDegree;
    });
}

wheelOfFortune('.ui-wheel-of-fortune');



const sectors = [
    { color: "#FFBC03", text: "#333333", label: "Sweets" },
    { color: "#FF5A10", text: "#333333", label: "Prize draw" },
    { color: "#FFBC03", text: "#333333", label: "Sweets" },
    { color: "#FF5A10", text: "#333333", label: "Prize draw" },
    { color: "#FFBC03", text: "#333333", label: "Sweets + Prize draw" },
    { color: "#FF5A10", text: "#333333", label: "You lose" },
    { color: "#FFBC03", text: "#333333", label: "Prize draw" },
    { color: "#FF5A10", text: "#333333", label: "Sweets" },
];

const events = {
    listeners: {},
    addListener: function (eventName, fn) {
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(fn);
    },
    fire: function (eventName, ...args) {
        if (this.listeners[eventName]) {
            for (let fn of this.listeners[eventName]) {
                fn(...args);
            }
        }
    },
};

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arcc = TAU / sectors.length;

const friction = 0.991;
let angVel = 0;
let ang = 0;

let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
    const ang = arcc * i;
    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arcc);
    ctx.lineTo(rad, rad);
    ctx.fill();

    ctx.translate(rad, rad);
    ctx.rotate(ang + arcc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = sector.text;
    ctx.font = "bold 30px 'Lato', sans-serif";
    ctx.fillText(sector.label, rad - 10, 10);

    ctx.restore();
}

function rotate() {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

    spinEl.textContent = !angVel ? "SPIN" : sector.label;
    spinEl.style.background = sector.color;
    spinEl.style.color = sector.text;
}

function frame() {
    if (!angVel && spinButtonClicked) {
        const finalSector = sectors[getIndex()];
        events.fire("spinEnd", finalSector);
        spinButtonClicked = false;
        return;
    }

    angVel *= friction;
    if (angVel < 0.002) angVel = 0;
    ang += angVel;
    ang %= TAU;
    rotate();
}

function engine() {
    frame();
    requestAnimationFrame(engine);
}

function init() {
    sectors.forEach(drawSector);
    rotate();
    engine();
    spinEl.addEventListener("click", () => {
        if (!angVel) angVel = rand(0.25, 0.45);
        spinButtonClicked = true;
    });
}

init();

events.addListener("spinEnd", (sector) => {
    console.log(`Woop! You won ${sector.label}`);
});

var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();
var data = [
    { "label": "Dell LAPTOP", "value": 1, "question": "What CSS property is used for specifying the area between the content and its border?" }, // padding
    { "label": "IMAC PRO", "value": 2, "question": "What CSS property is used for changing the font?" }, //font-family
    { "label": "SUZUKI", "value": 3, "question": "What CSS property is used for changing the color of text?" }, //color
    { "label": "HONDA", "value": 4, "question": "What CSS property is used for changing the boldness of text?" }, //font-weight
    { "label": "FERRARI", "value": 5, "question": "What CSS property is used for changing the size of text?" }, //font-size
    { "label": "APARTMENT", "value": 6, "question": "What CSS property is used for changing the background color of a box?" }, //background-color
    { "label": "IPAD PRO", "value": 7, "question": "Which word is used for specifying an HTML tag that is inside another tag?" }, //nesting
    { "label": "LAND", "value": 8, "question": "Which side of the box is the third number in: margin:1px 1px 1px 1px; ?" }, //bottom
    { "label": "MOTOROLLA", "value": 9, "question": "What are the fonts that don't have serifs at the ends of letters called?" }, //sans-serif
    { "label": "BMW", "value": 10, "question": "With CSS selectors, what character prefix should one use to specify a class?" }
];
var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
var vis = container
    .append("g");

var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
var arc = d3.svg.arc().outerRadius(r);
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs.append("path")
    .attr("fill", function (d, i) { return color(i); })
    .attr("d", function (d) { return arc(d); });
// add the text
arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
})
    .attr("text-anchor", "end")
    .text(function (d, i) {
        return data[i].label;
    });
container.on("click", spin);
function spin(d) {

    container.on("click", null);
    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if (oldpick.length == data.length) {
        console.log("done");
        container.on("click", null);
        return;
    }
    var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length),
        rng = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
    if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(ps / 2);
    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function () {
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "#111");
            d3.select("#question h1")
                .text(data[picked].question);
            oldrotation = rotation;

            console.log(data[picked].value)

            container.on("click", spin);
        });
}
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
    .style({ "fill": "black" });
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({ "fill": "white", "cursor": "pointer" });
container.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "30px" });


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers() {
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        for (var i = 0; i < 1000; i++) {
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}
