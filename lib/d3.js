// D3 Constants
let NODES_OBJ = {};
let LINKS_OBJ = {};
let CHOSEN_ARR = [];
let nodes = [];
let links = [];
let point = [0, 0];
let ARTIST_INFO = {};
let listeners = [];
let clickedIds = {};

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    color = d3.scaleOrdinal(d3.schemeCategory20);

var zoom = d3.zoom().on("zoom", zoomed);

let rect = svg.append("rect")
    .attr("id", "svg_rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "url(#imagesBg)")
    .style("pointer-events", "all")
    .call(zoom);

function zoomed() {
    g.attr("transform", d3.event.transform);
}

let g = svg.append("g"),
    link = g.append("g").attr("stroke", "#000000").attr("stroke-width", 1).selectAll(".link"),
    node = g.append("g").attr('id', 'node-step').selectAll(".node"),
    text = g.append("g").selectAll(".text"),
    image = g.append("g").attr('id', 'image-step').selectAll(".image");

function renderSvg() {
    let nodesArray = Object.values(NODES_OBJ);
    let linksArray = Object.values(LINKS_OBJ);

    node = node.data(nodesArray, function(d) {
        return d.id;
    });
    node.exit().remove();
    node = node.enter()
        .append("circle")
        .attr('class', 'node')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("r", 40)
        .attr('fill', function(d) {
            return d.color;
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .merge(node);

    /*node.filter(function(d) {
        return clickedIds[d.id];
    })
    .attr("fill", "#19FCFF")
    .attr("r", 40);*/

    node.filter(function(d, i) {
        return d.chosen;
    })
    .attr('fill', '#fff')
    .attr('r', 20);

    image = image.data(nodesArray, function(d) {
        return d.id;
    });
    image.exit().remove();
    image = image.enter()
        .append('g')
        .attr('class', 'image')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("transition", "transform 0.1s ease-out")
        .style("cursor", "grab")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .merge(image);

    image.append("clipPath")
        .attr('id', function(d) {
            return (`clipCircle${d.id}-${d.name}`);
        })
        .attr('class', 'clipPath')
        .append('circle')
        .attr('fill', '#222326')
        .attr("stroke", "#fff")
        .attr("stroke-width", 50)
        .attr('r', 40);

    image.append('image')
        .attr('xlink:href', function(d) {
            if (d.images) {
                return d.images;
            }
        })
        .attr('width', (d) =>setWidth(d))
        .attr('height', (d) => setHeight(d))
        .attr('y', '-40px')
        .attr("clip-path", function(d) {
            return (`url(#clipCircle${d.id}-${d.name})`);
        })
        .attr('x', '-40px');

    // Links between nodes
    link = link.data(linksArray, function(d) {
        return d.source.id + "-" + d.target.id;
    });
    link.exit().remove();
    link = link.enter()
        .append("line")
        .attr('class', 'link')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .merge(link);

    // Highlight chosen links
    /*link.filter(function(d) {
        return (d.chosen || clickedIds[d.target] && clickedIds[d.source]);
    }).style("stroke", "#19FCFF");*/


    text = text.data(nodesArray, function(d) {
        return d.id;
    });
    text.exit().remove();
    text = text.enter()
        .append("text")
        .attr('class', 'text')
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("dx", 48)
        .attr("dy", 3)
        .style("fill", "rgba(255,255,255,0.7)")
        .style("font-size", 12)
        //.style('text-shadow', '0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff')
        .text(function(d) {
            return d.name;
        })
        .merge(text);

    simulation.nodes(nodesArray);
    simulation.force("link").links(linksArray);
    simulation.alpha(0.1).restart();
}

function setSelected(root) {
    node.style("stroke-width", "1px");
    link.style("stroke", "#fff");
    $(".colors h2").text("");
    clickedIds[root.id] = true;
    let rootNode = node.filter(function(d) {
        return root.id === d.id;
    });
    if (root.color) {
        setBackground(root);
    };

    let rootLinks = link.filter(function(d) {
        return root.id === d.target.id || root.id === d.source.id;
    });

    //rootNode.style("fill", "#19FCFF").attr("r", 40);
    //rootNode.style("fill-opacity", "0.6").attr("r", 40);

    rootNode.style("stroke", "rgba(255,255,255,0.4)");
    rootNode.style("stroke-width", "3px");

    rootLinks.style("stroke", "rgba(255,255,255,0.4)");
    rootLinks.style("stroke-width", "3px");
}
 
function setWidth(node, base = 80) {
    let artistImage = node.images;
    if (!artistImage) {
        return base;
    } else if (artistImage.width > artistImage.height) {
        return base * (artistImage.width / artistImage.height);
    } else {
        return base;
    }
}

function setHeight(node, base = 80) {
    let artistImage2 = node.images;
    if (!artistImage2) {
        return base;
    } else if (artistImage2.height > artistImage2.width) {
        return base * (artistImage2.height / artistImage2.width);
    } else {
        return base;
    }
}
function setBackground(root){
    $("body").css({"background":root.color});
    $(".colors li").removeClass("active");
    $(".colors li[data-color='"+root.color+"']").addClass("active");
    $(".colors h2").css({"color":root.color}).text(root.name)
}
function mouseover() {
    d3.select(this).select("image")
        .attr('transform', 'scale(1.05)');
}

function mouseout() {
    d3.select(this).select("image")
        .attr('transform', 'scale(1.0)');
}

 