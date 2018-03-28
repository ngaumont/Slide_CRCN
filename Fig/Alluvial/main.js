var margin = {top: 1, right: 1, bottom: 6, left: 1},
    width = 5000 - margin.left - margin.right,
    height = 2000 - margin.top - margin.bottom;


var mindate = new Date(2016,7,22),
    maxdate = new Date(2017,8,04);

var xScale = d3.scaleTime()
                .range([20, 1670])
                .domain([mindate,maxdate])
var xAxis = d3.axisBottom(xScale);
xAxis.ticks(d3.timeMonth);

var svgScale = d3.select("#Time_scale").append("svg")
    .attr("width", "100%")
    .attr("height", 50)
    .append("g");

svgScale.append("g")
     .attr("transform", "translate(20,0)")
     .attr("class", "xaxis")
     .call(xAxis);

svgScale.select(".xaxis")
   .selectAll("text")
  // .attr("transform"," translate(-10,30) rotate(-20)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
   .style("font-size","20px"); //To change the font size of texts


function rescale(new_min_date,new_max_date, month) {

  xScale.domain([new_min_date,new_max_date])
  if (month){
    xAxis.ticks(d3.timeMonth)
      .tickFormat(d3.timeFormat('%B'));
  }else {
    xAxis.ticks(d3.timeDay.every(16))
    .tickFormat(d3.timeFormat('%d-%m'));
  }

  svgScale.select(".xaxis")
          .transition().duration(2000)
          .call(xAxis);
  if (month){
    svgScale.select(".xaxis")
       .selectAll("text")
       .attr("transform","translate(0,0) rotate(0)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
       .style("font-size","20px"); //To change the font size of texts
  }else {
    svgScale.select(".xaxis")
       .selectAll("text")
       .attr("transform","translate(-10,5) rotate(-20)") // To rotate the texts on x axis. Translate y position a little bit to prevent overlapping on axis line.
       .style("font-size","20px"); //To change the font size of texts
  }


}

var formatNumber = d3.format(".0f"),
    format = function(d) { return formatNumber(d) + " accounts"; };
    // color = d3.scale.category20();

var GrayToredinterpolator = d3.interpolateRgb.gamma(2.2)("gray","#ff0000");
// var squareColor = function (d){return GrayToredinterpolator()}; //Math.exp(-1/d)/Math.exp(-1)
var squareColor = d3.scalePow().exponent(2)
                    .domain([0, 0.5, 1])
                    .range(["white", "#f8a6a6", "red"]);
//d3.interpolateViridis(1-d.source.init_color)
var max_fidel = 0;
var all_gradient = [];
// Create <svg> witht the right dimension
var svg = d3.select("#chart").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g");

document.getElementById("select_color")
        .addEventListener("change", function(event) {
          let get_node_color = function() {return "#FFFFFF"};
          let link_begin_color = "";
          let link_end_color = "";
          switch (event.target.value) {
            case "com":
              get_node_color = function(node) {
                return d3.interpolateViridis(1-node["__data__"].init_color)
              };
              link_begin_color = "source_color";
              link_end_color = "target_color";
            break;
            case "fidel":
              get_node_color = function(node) {
                return GrayToredinterpolator(node["__data__"].proportion_fidel/max_fidel)
              };
              link_begin_color = "source_fidel";
              link_end_color = "target_fidel";
            break;
            case "fidel_percent":
              get_node_color = function(node) {
                return squareColor(node["__data__"].proportion_fidel/node["__data__"].size)
              };
              link_begin_color = "source_fidel_percent";
              link_end_color = "source_fidel_percent";
            break;

          }
          // console.log(event)
          // console.log(event.target.value)
          for( let n of document.querySelectorAll(".node")) {
            let cur_rect = n.querySelector("rect");
            // console.log(n["__data__"].proportion_fidel);
            cur_rect.style.fill = get_node_color(n);
          }

        }
      );




// create sankey diagram  with some properties.
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(80)
    .size([width, height]);

var path = sankey.link();




d3.select("#generate")
    .on("click", writeDownloadLink);
//Create a downloadable svg.
function writeDownloadLink(){
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var html = d3.select("svg")
        .attr("title", "test2")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, "myChart.svg");
};



function rgbToHex(coulour) {
    return "#" + ((1 << 24) + (coulour.r << 16) + (coulour.g << 8) + coulour.b).toString(16).slice(1);
}

d3.json("Presidentiel.json", function(energy) {
  document.getElementById("period").innerHTML = energy.period;

  sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(0);

  var max_period = [];
  for (let node of energy.nodes){
    max_period[node.period] = (max_period[node.period] || 0) + node.size;
    node.y = node.pos * (height-120);
    max_fidel = Math.max(max_fidel,node.proportion_fidel)
  }
  // sankey.resolveCollisions()
  // sankey.layout(1)

  var link = svg.append("g").selectAll(".link")
      .data(energy.links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      // .attr("source_color",function(d) {return d3.interpolateViridis(1-d.source.init_color);})
      // .attr("target_color",function(d) {return d3.interpolateViridis(1-d.target.init_color);})
      // .attr("source_fidel",function(d) {return rgbToHex(d3.rgb(GrayToredinterpolator(d.source.proportion_fidel/max_fidel)));})
      // .attr("target_fidel",function(d) {return rgbToHex(d3.rgb(GrayToredinterpolator(d.target.proportion_fidel/max_fidel)));})
      // .attr("source_fidel_percent",function(d) {return rgbToHex(d3.rgb(squareColor(d.source.proportion_fidel/d.value)));})
      // .attr("target_fidel_percent",function(d) {return rgbToHex(d3.rgb(squareColor(d.target.proportion_fidel/d.value)));})
      .style("stroke-width", function(d) {return Math.max(1, d.dy); })
      .style("stroke", function(d) {
                        if (d.value>320){
                          return  d3.interpolateViridis(1-d.source.init_color);
                        }else {
                          return "#bdbdbd";
                        }
           })
      .style("stroke-opacity", "0.3")
      .sort(function(a, b) { return b.dy - a.dy; });
  link.append("title")
      .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

  let font_size = parseFloat(getComputedStyle(document.getElementById("period")).fontSize);
  var node = svg.append("g").selectAll(".node")
      .data(energy.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.drag()
      .on("start", function() { this.parentNode.appendChild(this); })
      .on("drag", dragmove));

  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = d3.interpolateViridis(1-d.init_color)})
      // .style("stroke", function(d) { return d3.rgb(d.color).darker(); })
    .append("title")
      .text(function(d) {return "Candidat(s): "+ d.full_name + "\nDate: " + d.date + "\nComptes: "+ d.size+" ("+formatNumber(d.size*100/max_period[d.period])+ "%)\nDont:\n\t" +(d.proportion_fidel)+" ("+formatNumber(d.proportion_fidel*100/d.size)+"%) fidels\n\t"+ (d.size-d.value)  +"("+formatNumber((d.size-d.value)*100/d.size)+"%) passants"; });

  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", function(d) {return 0.35*font_size + ( (d.period %2 ==0)? 0.8*font_size:0)})
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

  function dragmove(d) {
    d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
  sankey.relayout();
  link.attr("d", path);
  //
  // for( let elem of document.getElementsByClassName("link")) {
  //   let cur_gradient = `mainGradient_${elem.attributes.source_color.value.slice(1, -1)}_${elem.attributes.target_color.value.slice(1, -1)}`
  //   // console.log(elem.attributes);
  //   if (!all_gradient[cur_gradient]){
  //     // Create the svg:defs element and the main gradient definition.
  //     var svgDefs = svg.append('defs');
  //
  //     var mainGradient = svgDefs.append('linearGradient')
  //     .attr('id', cur_gradient);
  //
  //     mainGradient.append('stop')
  //     .style("stop-color", elem.attributes.source_color.value)
  //     .attr('offset', '0');
  //
  //     mainGradient.append('stop')
  //     .style("stop-color", elem.attributes.target_color.value)
  //     .attr('offset', '1');
  //     all_gradient[cur_gradient] = true;
  //   }


    // Create the stops of the main gradient. Each stop will be assigned
    // a class to style the stop using CSS.
  //   elem.style.stroke=`url(#${cur_gradient})`;
  // }
});

var zoom = d3.zoom()
    .on("zoom", zoomed);

function zoomed() {
  svg.attr("transform", d3.event.transform);
}


svg.transition()
   .call(zoom.transform,d3.zoomIdentity
            .translate(0, 0)
            .scale(0.4)
   )

var _transitions = [
      {
        transitionForward: () => {
                                     svg.transition()
                                     .duration(2000)
                                     .call(zoom.transform,d3.zoomIdentity
                                              .translate(-1100, -1950)
                                              .scale(1.7)
                                          )
                                     rescale(new Date(2016,09,15), new Date(2017,0,12))
                                 },
        transitionBackward: () => {svg.transition()
                                     .duration(2000)
                                     .call(zoom.transform,d3.zoomIdentity
                                              .translate(0, 0)
                                              .scale(0.4)
                                      )
                                    rescale(mindate,maxdate,true)
                                  },

        index: 0
      },
      {
        transitionForward: () => {
                                     svg.transition()
                                     .duration(2000)
                                     .call(zoom.transform,d3.zoomIdentity
                                              .translate(-1500, -1000)
                                              .scale(1)
                                          )
                                      rescale(new Date(2017,0,2), new Date(2017,3,30))
                                 },
        index: 1
      },
      {
        transitionForward: () => {svg.transition()
                                   .duration(2000)
                                   .call(zoom.transform,d3.zoomIdentity
                                            .translate(0, 0)
                                            .scale(0.4)
                                    )
                                  rescale(mindate,maxdate,true)
                                },
        index: 2
      }
      // {
      //   transitionForward: () => {
      //                              document.getElementById("select_color").value = "fidel_percent";
      //                              let event = new Event('change');
      //                              document.getElementById("select_color").dispatchEvent(event);
      //
      //                            },
      //   transitionBackward: () => {document.getElementById("select_color").value = "com";
      //                                let event = new Event('change');
      //                                document.getElementById("select_color").dispatchEvent(event);
      //
      //                             },
      //   index: 2
      // },
      // {
      //   transitionForward: () => {   document.getElementById("select_color").value = "com";
      //                                let event = new Event('change');
      //                                document.getElementById("select_color").dispatchEvent(event);
      //                                console.log("trans 3");
      //                                svg.transition()
      //                                .duration(2000)
      //                                .call(zoom.transform,d3.zoomIdentity
      //                                         .translate(-2850, -1950)
      //                                         .scale(1.5)
      //                                     )
      //                                 rescale(new Date(2017,01,07), new Date(2017,04,17))
      //                            },
      //  transitionBackward: () => { document.getElementById("select_color").value = "fidel_percent";
      //                              let event = new Event('change');
      //                              document.getElementById("select_color").dispatchEvent(event);
      //                               svg.transition()
      //                               .duration(2000)
      //                               .call(zoom.transform,d3.zoomIdentity
      //                                        .translate(-1100, -1900)
      //                                        .scale(1.7)
      //                                    )
      //                           },
      //   index: 3
      // },
    ]
    //
    // svg.transition()
    // .duration(2000)
    // .call(zoom.transform,d3.zoomIdentity
    //          .translate(-2500, -580)
    //          .scale(1.8)
    //      )
    // rescale(new Date(2016,11,23), new Date(2017,2,14))
