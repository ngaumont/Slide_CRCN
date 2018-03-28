
function load_svg(fig_path,htmlSVG,call_back) {
  d3.xml(fig_path, function(error, xml) {
    if (error) throw error;
    // append the "maproot" group to the svg-element in our HTML file
    htmlSVG.appendChild(xml.documentElement.getElementById('figroot'));

    // d3 objects for later use
    let svg = d3.select(htmlSVG);
    let maproot = svg.select('#figroot');

    // get the svg-element from the original SVG file
    var xmlSVG = d3.select(xml.getElementsByTagName('svg')[0]);
    // copy its "viewBox" attribute to the svg element in our HTML file
    svg.attr('viewBox', xmlSVG.attr('viewBox'));
    if (call_back)
      call_back();
  });
}


load_svg("Fig/Variable_duration.svg",
         document.getElementById('figVariable'),
         function(){
          resetRect();
          d3.select(document.getElementById('figVariable')).selectAll("#link_interest circle").transition().duration(50).style("fill","#3091ae");
          d3.select(document.getElementById('figVariable')).selectAll("#link_interest rect").transition().duration(50).style("fill","#3091ae");
          d3.select(document.getElementById('figVariable')).selectAll("#link_interest path").transition().duration(50).style("fill","#3091ae");
          d3.select(document.getElementById('figVariable')).select("#zone_select").transition().duration(50).attr("transform", "translate(0, 0)").attr("display", "none")
          d3.select(document.getElementById('figVariable')).select("#rect5992-4").transition().duration(50).attr("width", "99.5").attr("display", "none")
          d3.select(document.getElementById('figVariable')).select("#rect5992-0").transition().duration(50).attr("display", "none")

         }
);
load_svg("./Fig/TVG_base.svg", document.getElementById('TVG'));
load_svg("./Fig/evolvingGraph_Base.svg", document.getElementById('GrapheTemporel'));
load_svg("./Fig/Flot_de_liens_2.svg", document.getElementById('FlotLiens'));
load_svg("Fig/Percentile_2.svg", document.getElementById('eval_groupe'),function(){d3.select(document.getElementById('methode_evaluation')).attr("display","none");});
load_svg("Fig/temporal_network.svg", document.getElementById('temporal_msg'),reset_temporal_msg);

function reset_temporal_msg(){
  d3.select(document.getElementById('messages')).attr("display","none");
  d3.select(document.getElementById('node_com')).attr("display","none");
  d3.select(document.getElementById('color_link')).attr("display","none");
}


document.getElementById("animate_tmp_net").addEventListener("animate", function( event ) {
    if (event.detail === 0) {
      reset_temporal_msg();
      d3.select(document.getElementById('messages')).transition().duration(200).attr("display","inherit");
    } else {
      d3.select(document.getElementById('messages')).transition().duration(200).attr("display","none");
      d3.select(document.getElementById('temporal_msg')).select("#node_com").transition().duration(200).attr("display","inherit");

    }
  }, false
);

document.getElementById("appar_com").addEventListener("animate", function( event ) {

    if (event.detail === 0) {
      reset_temporal_msg();
      //console.log("apparm",document.getElementById('temporal_msg'));
      d3.select(document.getElementById('temporal_msg')).select("#node_com").transition().duration(200).attr("display","inherit");
    } else {
      d3.select(document.getElementById('temporal_msg')).select("#node_com").transition().duration(200).attr("display","none");
    }
  }, false
);

document.getElementById("appar_meso").addEventListener("animate", function( event ) {

    if (event.detail === 0) {
      reset_temporal_msg();
      //console.log("apparm",document.getElementById('temporal_msg'));
      d3.select(document.getElementById('temporal_msg')).select("#color_link").transition().duration(200).attr("display","inherit");
    } else {
      d3.select(document.getElementById('temporal_msg')).select("#color_link").transition().duration(200).attr("display","none");
      d3.select(document.getElementById('temporal_msg')).select("#node_com").transition().duration(200).attr("display","inherit");
    }
  }, false
);
document.getElementById("anim_eval_groupe").addEventListener("animate", function( event ) {
    if (event.detail === 0) {
      d3.select(document.getElementById('methode_evaluation')).transition().duration(500).attr("display","inherit");
    } else {
      d3.select(document.getElementById('methode_evaluation')).transition().duration(500).attr("display","none");
    }
  }, false
);

Reveal.addEventListener( 'fragmentshown', function( event ) {
	// event.fragment = the fragment DOM element
  let dispatch_ev = function(frag){
      let event_to_dispatch = new CustomEvent('animate', { 'detail': 0 });
      frag.dispatchEvent(event_to_dispatch);
    };
  event.fragments.forEach(dispatch_ev);
});


Reveal.addEventListener( 'fragmenthidden', function( event ) {
	// event.fragment = the fragment DOM element
  let dispatch_ev = function(frag){
      let event_to_dispatch = new CustomEvent('animate', { 'detail': 1 });
      frag.dispatchEvent(event_to_dispatch);
    };
  event.fragments.forEach(dispatch_ev);
} );

document.getElementById("ref_deb").addEventListener("animate", function( event ) {
    // Affiche le compte courant de clics à l'intérieur de la div cliquée
    if (event.detail === 0) {
      resetRect();
      slideRectangle("#zone_select");
    } else {
      resetRect();
      stretchRect("#zone_select");
    }
  }, false);
document.getElementById("ref_dure").addEventListener("animate", function( event ) {
    // Affiche le compte courant de clics à l'intérieur de la div cliquée
    if (event.detail === 0) {
      resetRect();
      stretchRect("#zone_select");
    } else {
      resetRect();
      slideRectangleUp("#zone_select");
    }
  }, false);


document.getElementById("ref_nodes").addEventListener("animate", function( event ) {
    // Affiche le compte courant de clics à l'intérieur de la div cliquée
    if (event.detail === 0) {
      resetRect();
      slideRectangleUp("#zone_select");
    } else {
       resetRect();
       d3.select(document.getElementById('figVariable')).select("#aide_select").transition().duration(50).attr("display", "inherit")
    }
  }, false
);
document.getElementById("aide_zone").addEventListener("animate", function( event ) {
    // Affiche le compte courant de clics à l'intérieur de la div cliquée
    if (event.detail === 0) {
      resetRect();
      d3.select(document.getElementById('figVariable')).select("#aide_select").transition().duration(50).attr("display", "inherit")
    } else {
       resetRect();
       d3.select(document.getElementById('figVariable')).select("#zone_select").transition().duration(50).attr("transform", "translate(0, 0)").attr("display", "none")
       d3.select(document.getElementById('figVariable')).select("#rect5992-4").transition().duration(50).attr("width", "99.5").attr("display", "none")
    }
  }, false
);



document.getElementById("stop_variable_anim").addEventListener("animate", function( event ) {
    resetRect()
    if (event.detail === 0) {
      resetRect();
    } else {
       resetRect();
       slideRectangle("#zone_select");
    }
  }, false
);


function resetRect(){
  d3.select(document.getElementById('figVariable')).select("#zone_select").transition().duration(50).attr("transform", "translate(0, 0)").attr("display", "inherit")
  d3.select(document.getElementById('figVariable')).select("#rect5992-4").transition().duration(50).attr("width", "99.5").attr("display", "inherit")
  d3.select(document.getElementById('figVariable')).select("#aide_select").transition().duration(50).attr("display", "none")
  d3.select(document.getElementById('figVariable')).selectAll("#node_select tspan").transition().duration(50).style("fill","#000");
  d3.select(document.getElementById('figVariable')).select("#rect5992-0").transition().duration(50).attr("width", "99.5").attr("display", "inherit")
}



function stretchRect(rect_id) {
    let rectangle =  d3.select(document.getElementById('figVariable')).select(rect_id)
    repeat();

    function repeat() {
      rectangle
        .select("#rect5992-4")
        .transition()        // apply a transition
        .delay(50)
        .duration(2000)      // apply it over 2000 milliseconds
        .attr("width", "220")     // move the circle to 920 on the x axis
        .transition()        // apply a transition
        .duration(2000)      // apply it over 2000 milliseconds
        .attr("width", "60")      // return the circle to 40 on the x axis
        .on("end", repeat);  // when the transition finishes start again
    };
};
function slideRectangle(rect_id) {
    let rectangle =  d3.select(document.getElementById('figVariable')).select(rect_id)
    repeat();

    function repeat() {
      rectangle
        .transition()        // apply a transition
        .delay(50)
        .duration(3000)      // apply it over 2000 milliseconds
        .attr("transform", "translate(145, 0)")     // move the circle to 920 on the x axis
        .transition()        // apply a transition
        .duration(3000)      // apply it over 2000 milliseconds
        .attr("transform", "translate(-25, 0)")      // return the circle to 40 on the x axis
        .on("end", repeat);  // when the transition finishes start again
    };
};

function slideRectangleUp(rect_id) {
    let rectangle =  d3.select(document.getElementById('figVariable')).select(rect_id)
    repeat();

    function repeat() {
      rectangle
        .transition()        // apply a transition
        .delay(50)
        .duration(2000)      // apply it over 2000 milliseconds
        .attr("transform", "translate(0, -35)")     // move the circle to 920 on the x axis
        .transition()        // apply a transition
        .duration(2000)      // apply it over 2000 milliseconds
        .attr("transform", "translate(0, 40)")      // return the circle to 40 on the x axis
        .on("end", repeat);  // when the transition finishes start again
    };
};
