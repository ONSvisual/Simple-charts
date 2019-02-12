	var graphic = $('#graphic');
	var keypoints = $('#keypoints');
	var footer = $(".footer");
	var pymChild = null;

	function drawGraphic() {
			var format1 = d3.format(dvc.essential.numberFormat);

		  var threshold_md = dvc.optional.mediumBreakpoint;
		  var threshold_sm = dvc.optional.mobileBreakpoint;
			var threshold_tiny = dvc.optional.tinyBreakpoint;
			var gHeight=dvc.essential.gHeight_sm_md_lg;
			var number=graphic_data.length
			if(typeof dvc.essential.yAxisBreak=="number"){++number}

	  	//set variables for chart dimensions dependent on width of #graphic
			if (graphic.width() < threshold_sm) {
          var margin = {top: dvc.optional.margin_sm[0], right: dvc.optional.margin_sm[1], bottom: dvc.optional.margin_sm[2], left: dvc.optional.margin_sm[3]};
					var chart_width = graphic.width() - margin.left - margin.right;
          // var height = Math.ceil((chart_width * dvc.optional.aspectRatio_sm[1]) / dvc.optional.aspectRatio_sm[0]) - margin.top - margin.bottom;
					var height = number * gHeight[0]-margin.top-margin.bottom;
	    } else if (graphic.width() < threshold_md){
        	var margin = {top: dvc.optional.margin_md[0], right: dvc.optional.margin_md[1], bottom: dvc.optional.margin_md[2], left: dvc.optional.margin_md[3]};
					var chart_width = graphic.width() - margin.left - margin.right;
          // var height = Math.ceil((chart_width * dvc.optional.aspectRatio_md[1]) / dvc.optional.aspectRatio_md[0]) - margin.top - margin.bottom;
					var height = number * gHeight[1]-margin.top-margin.bottom;
	  	} else {
        	var margin = {top: dvc.optional.margin_lg[0], right: dvc.optional.margin_lg[1], bottom: dvc.optional.margin_lg[2], left: dvc.optional.margin_lg[3]}
					var chart_width = graphic.width() - margin.left - margin.right;
          // var height = Math.ceil((chart_width * dvc.optional.aspectRatio_lg[1]) / dvc.optional.aspectRatio_lg[0]) - margin.top - margin.bottom;
					var height = number * gHeight[2]-margin.top-margin.bottom;
			}

	    // clear out existing graphics
	    graphic.empty();
			keypoints.empty();
			footer.empty();


	    var x = d3.scaleOrdinal()
	        .range([0, chart_width]);

	    var y = d3.scaleLinear()
	        .range([height, 0]);

	    x.domain(["left","right"]);


		var line = d3.line()
				.x(function(d,i) { return x(d.type);})
				.y(function(d,i) { return y(d.amt); });


		lines=[]
		// parse data into columns
		for(i=0;i<graphic_data.length;i++){
			lines.push({
										"key":graphic_data[i].name,
										"value":[{"type":"left","amt":graphic_data[i].leftValue},{"type":"right","amt":graphic_data[i].rightValue}],
										"rank":[{"type":"left","amt":graphic_data[i].leftRank},{"type":"right","amt":graphic_data[i].rightRank}],
										"customRank":[{"type":"left","amt":graphic_data[i].leftCustomRank},{"type":"right","amt":graphic_data[i].rightCustomRank}]
								})
		}


		if(dvc.essential.slopeType=="value"){
					//y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
		   		if (dvc.essential.yAxisScale == "auto_zero_max"){
				   var yDomain = [
									0,
									d3.max(lines, function(c) {
										return d3.max(c.value, function(v) {
											var n = v.amt;
											return Math.ceil(n);
										});
									})
								 ];
					} else if (dvc.essential.yAxisScale == "auto_min_max"){
						var yDomain = [
										d3.min(lines, function(c) {
											return d3.min(c.value, function(v) {
												var n = v.amt;
												return Math.floor(n);
											});
										}),

										d3.max(lines, function(c) {
											return d3.max(c.value, function(v) {
												var n = v.amt;
												return Math.ceil(n);
											});
										})
							 		];
						} else {
					   var yDomain = dvc.essential.yAxisScale;
				    }
		}else if(dvc.essential.slopeType=="rank"){
			if (dvc.essential.yAxisScale == "auto_zero_max"){
			 var yDomain = [
							0,
							d3.max(lines, function(c) {
								return d3.max(c.rank, function(v) {
									var n = v.amt;
									return Math.ceil(n);
								});
							})
						 ];
			} else if (dvc.essential.yAxisScale == "auto_min_max"){
				var yDomain = [
								d3.min(lines, function(c) {
									return d3.min(c.rank, function(v) {
										var n = v.amt;
										return Math.floor(n);
									});
								}),

								d3.max(lines, function(c) {
									return d3.max(c.rank, function(v) {
										var n = v.amt;
										return Math.ceil(n);
									});
								})
							];
				} else {
				 var yDomain = dvc.essential.yAxisScale;
				}
		}


		if(dvc.essential.sortby=="ascending"){yDomain.reverse()}
  	y.domain(yDomain);

    //create svg for chart
    svg = d3.select('#graphic').append('svg')
      .attr("width", chart_width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom +30)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//y axis label
		svg.append("text")
      .attr('class', 'unit')
			.attr("transform", "translate(" + (margin.left*-1) + ",-5)")
      .text(function(d,i) { return dvc.essential.yAxisLabel; });

		// svg.append("rect")
		// 	.attr("class","svgRect")
		// 	.attr("width", chart_width)
		// 	.attr("height", height)

		svg.append("text")
			.attr("class","leftLabel")
			.attr("x",function (){
					if(graphic.width() < threshold_sm){
						return -margin.left;
					} else {return "-15px"}
			})
			.attr("y",-18)
			.attr("text-anchor",function (){
					if(graphic.width() < threshold_sm){
						return "start"
					} else {return "end"}
			})
			.attr("fill","#666")
			.attr("font-weight", "bold")
			.style("font-size","14px")
			.text(dvc.essential.leftRightTitles[0])

		svg.append("text")
			.attr("y",-18)
			.attr("x",chart_width + 15)
			.attr("text-anchor","start")
			.attr("fill","#666")
			.attr("font-weight", "bold")
			.style("font-size","14px")
			.text(dvc.essential.leftRightTitles[1])

  //create lines
  linegroups = svg.append('g').attr("id","slopelines").selectAll('path')
    .data(lines)
    .enter()
		.append("g")
		.attr("class",function(d,i){return "slopegroup slopegroup_" + i})
		.on("mouseover",function(){
				d3.selectAll(".slopegroup").transition().duration(300).attr("opacity","0.2");
				var thisclass = d3.select(this).attr("class").split(" ",2)[1];

				d3.selectAll("." + thisclass).transition().duration(300).attr("opacity","1");
				d3.selectAll("." + thisclass).select("path").style("stroke-width","3px");
				d3.selectAll("." + thisclass).selectAll("text").classed("boldtext",true);

		})
		.on("mouseout",function(){
				d3.selectAll(".slopegroup").transition().duration(300).attr("opacity","1");
				d3.selectAll(".slopegroup").select("path").style("stroke-width","2px");
				d3.selectAll(".slopegroup").selectAll("text").classed("boldtext",false);
		});

if(dvc.essential.slopeType=="value"){
  linegroups.append('path')
    .attr('class', function(d, i) {
		if(+d.value[0].amt > +d.value[1].amt){betterWorse = "Worse"}
		else if(+d.value[0].amt < +d.value[1].amt){betterWorse = "Better"}
		else {betterWorse = "Same"}
        return 'line line-' + i + " slope" + betterWorse;
    })
    .attr('d', function(d) {
        return line(d.value);
    });

	//Work out if there are duplicate ifValueShowRanks
		var listL = graphic_data.map(function(d) {return d.leftValue});
		var listR = graphic_data.map(function(d) {return d.rightValue});

		function countInArray(array, what) {
		    var count = 0;
		    for (var i = 0; i < array.length; i++) {
		        if (array[i] == what) {
		            count++;
		        }
		    }
		    return count;
		}

		countInArray(listL, 2); // returns 2


  index=0

	linegroups.append('text')
		.attr("class","labelstext2")
		.attr("transform", function(d,i) {
			if(countInArray(listR,d.value[1].amt)>1)
				{index++; return "translate(0," + index +")"}
			else {return "translate(0,0)"}
		})
		.text(function(d, i) {
			return d.key + " ("+format1(d.value[1].amt)+")"
		})
		.attr('y', function(d,i) {
			return (y(d.value[1].amt) +5);
		})
		.attr('x', chart_width +15)
		.attr('text-anchor','start')
    .call(function(){arrangeLabels("labelstext2")})

	index=0
	linegroups.append('text')
		.attr("class","labelstext desk")
		.attr("transform", function(d,i) {
			if(countInArray(listL,d.value[0].amt)>1)
				{index++; return "translate(0," + index +")"}
			else {return "translate(0,0)"}
		})
		.text(function(d, i) {
					return d.key + " ("+format1(d.value[0].amt)+")"
		})
		.attr('y', function(d) {
			return (y(d.value[0].amt)+5);
		})
		.attr('x', -15)
		.attr('text-anchor','end')
		.call(function(){arrangeLabels("desk")})

	index=0
	linegroups.append('text')
		.attr("class","labelstext mob")
		.attr("transform", function(d,i) {
			if(countInArray(listL,d.value[0].amt)>1)
				{index++; return "translate(0," + index +")"}
			else {return "translate(0,0)"}
		})
		.text(function(d){return "("+format1(d.value[0].amt)+")"})
		.attr('y', function(d) {
			return (y(d.value[0].amt)+5);
		})
		.attr('x', -15)
		.attr('text-anchor','end')
    .call(function(){arrangeLabels("mob")})


	if(dvc.essential.ifValueShowRanks==true){
		for (var j = 0; j < lines[0].rank.length; j++) {

			linegroupsg = linegroups.append("g").attr("class",function(d,i){return "groups" + j});

			linegroupsg.append("circle")
			 .attr("class", "circleno" + j)
			 .attr("cx", function(d,i){
				return x(d.rank[j].type);
				})
			 .attr("cy",function(d) {
					return y(d.rank[j].amt);
			 })
			 .attr("fill","#008080")
			 .attr("r",10);

			linegroupsg.append("text")
				.attr("class", "textno" + j)
				.text(function(d,i) {
					return d.customRank[j].amt
					})
				.attr("x", function(d,i){
				 return x(d.rank[j].type);
				 })
				.attr("y",function(d) {
					 return y(d.rank[j].amt) + 6;
				})
				.attr('text-anchor','middle');

		}
	}
}else if(dvc.essential.slopeType=="rank"){
	linegroups.append('path')
		.attr('class', function(d, i) {
		if(+d.rank[0].amt > +d.rank[1].amt){betterWorse = "Worse"}
		else if(+d.rank[0].amt < +d.rank[1].amt){betterWorse = "Better"}
		else {betterWorse = "Same"}
				return 'line line-' + i + " slope" + betterWorse;
		})
		.attr('d', function(d) {
				return line(d.rank);
		});



	if (dvc.essential.ifRankShowValue==true) {
		linegroups.append('text')
			.attr("class","labelstext2")
			.text(function(d, i) {
				return d.key +" ("+format1(d.value[1].amt)+")"
			})
			.attr('y', function(d,i) {
				return (y(d.rank[1].amt) +5);
			})
			.attr('x', chart_width +30)
			.attr('text-anchor','start');

		linegroups.append('text')
			.attr("class","labelstext desk")
			.text(function(d, i) {
				return d.key +" ("+format1(d.value[0].amt)+")"
			})
			.attr('y', function(d) {
				return (y(d.rank[0].amt)+5);
			})
			.attr('x', -25)
			.attr('text-anchor','end');

		linegroups.append('text')
			.attr("class","labelstext mob")
			.text(function(d){return "("+format1(d.value[0].amt)+")"})
			.attr('y', function(d) {
				return (y(d.rank[0].amt)+5);
			})
			.attr('x', -20)
			.attr('text-anchor','end')
	} else {
		linegroups.append('text')
			.attr("class","labelstext2")
			.text(function(d, i) {
				return d.key
			})
			.attr('y', function(d,i) {
				return (y(d.rank[1].amt) +5);
			})
			.attr('x', chart_width +30)
			.attr('text-anchor','start');

		linegroups.append('text')
			.attr("class","labelstext desk")
			.text(function(d, i) {
						return d.key
			})
			.attr('y', function(d) {
				return (y(d.rank[0].amt)+5);
			})
			.attr('x', -25)
			.attr('text-anchor','end');
	}


	for (var j = 0; j < lines[0].rank.length; j++) {

		linegroupsg = linegroups.append("g").attr("class",function(d,i){return "groups" + j});

		linegroupsg.append("circle")
		 .attr("class", "circleno" + j)
		 .attr("cx", function(d,i){
			return x(d.rank[j].type);
			})
		 .attr("cy",function(d) {
				return y(d.rank[j].amt);
		 })
		 .attr("fill","#008080")
		 .attr("r",10);

		if(dvc.essential.ifRankCustomRank==false)	{
		 linegroupsg.append("text")
			 .attr("class", "textno" + j)
			 .text(function(d,i) {
				 return d.rank[j].amt
				 })
			 .attr("x", function(d,i){
				return x(d.rank[j].type);
				})
			 .attr("y",function(d) {
					return y(d.rank[j].amt) + 6;
			 })
			 .attr('text-anchor','middle');
		} else if(dvc.essential.ifRankCustomRank==true){
			linegroupsg.append("text")
				.attr("class", "textno" + j)
				.text(function(d,i) {
					return d.customRank[j].amt
					})
				.attr("x", function(d,i){
				 return x(d.rank[j].type);
				 })
				.attr("y",function(d) {
					 return y(d.rank[j].amt) + 6;
				})
				.attr('text-anchor','middle');
		}
	}
}









//add a separator if necessary
if(typeof dvc.essential.yAxisBreak=="number"){
	d3.select("#slopelines").append("line")
		 		   .attr("x1",x("left")-margin.left)
				   .attr("x2",x("right")+margin.right)
				   .attr("y1",y(dvc.essential.yAxisBreak))
				   .attr("y2",y(dvc.essential.yAxisBreak))
				   .attr("stroke","#8e8e8e")
				   .attr("stroke-width", "2px")
				   .attr("stroke-dasharray",4);

	d3.select("#slopelines").append("text")
				   .attr("x",x("right") +85)
				   .attr("y",y(dvc.essential.yAxisBreak)-5)
				   .html(dvc.essential.yAxisBreakText)
}

d3.selectAll(".textno1")
	.attr("transform","translate(6,0)");

d3.selectAll(".textno0")
	.attr("transform","translate(-6,0)");

d3.selectAll(".circleno1")
	.attr("transform","translate(6,2)");

d3.selectAll(".circleno0")
	.attr("transform","translate(-6,2)");


d3.selectAll(".rectno1")
	.attr("transform","translate(2,-11)");

d3.selectAll(".rectno0")
	.attr("transform","translate(-10,-11)");

//create link to source
d3.select(".footer").append("p")
	.text("Source: " + dvc.essential.sourceText)
	.style("font-weight",700)
	.style("font-size", "16px")
	.style("color","#323132")


	function arrangeLabels(classname) {
        var move = 1;
        while (move > 0) {
          move = 0;
          d3.selectAll("." + classname)
            .each(function(d, i) {
              var that = this,
                a = this.getBoundingClientRect();

              d3.selectAll("." + classname)
                .each(function() {
                  if (this != that) {
                    var b = this.getBoundingClientRect();
                    if ((Math.abs(a.top - b.top) * 2.5 < (a.height + b.height))) {
                      // overlap, move labels
                      var dx = (Math.max(0, a.right - b.left) +
                          Math.min(0, a.left - b.right)) * 0.01,
                        dy = (Math.max(0, a.bottom - b.top) +
                          Math.min(0, a.top - b.bottom)) * 0.03;

                      tt = getTransformation(d3.select(this).attr("transform")),
                        to = getTransformation(d3.select(that).attr("transform"));

                      move += Math.abs(dx) + Math.abs(dy);

                      to.translateY = [0, to.translateY + dy];
                      tt.translateY = [0, tt.translateY - dy];

                      d3.select(this).attr("transform", "translate(" + tt.translateY + ")");
                      d3.select(that).attr("transform", "translate(" + to.translateY + ")");
                      a = this.getBoundingClientRect();
                    }
                  }
                });
            });
        }
      } // end of arangeLabels

        function getTransformation(transform) {
          // Create a dummy g for calculation purposes only. This will never
          // be appended to the DOM and will be discarded once this function
          // returns.
          var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

          // Set the transform attribute to the provided string value.
          g.setAttributeNS(null, "transform", transform);

          // consolidate the SVGTransformList containing all transformations
          // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
          // its SVGMatrix.
          var matrix = g.transform.baseVal.consolidate().matrix;

          // Below calculations are taken and adapted from the private function
          // transform/decompose.js of D3's module d3-interpolate.
       		// ES6, if this doesn't work, use below assignment

					var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
          var scaleX, scaleY, skewX;
          if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
          if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
          if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
          if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
          return {
            translateX: e,
            translateY: f,
            rotate: Math.atan2(b, a) * 180 / Math.PI,
            skewX: Math.atan(skewX) * 180 / Math.PI,
            scaleX: scaleX,
            scaleY: scaleY
          };
        } // end of getTrnsformatio



//use pym to calculate chart dimensions
  if (pymChild) {
      pymChild.sendHeight();
  }


}





//check whether browser can cope with svg
if (Modernizr.svg) {
   //load config
	d3.json("config.json", function(error, config) {
	dvc=config

		//load chart data
		d3.csv(dvc.essential.dataFile, function(error, data) {
			graphic_data = data;

			//use pym to create iframed chart dependent on specified variables
			pymChild = new pym.Child({ renderCallback: drawGraphic});

		});
	})

} else {
	 //use pym to create iframe containing fallback image (which is set as default)
	 pymChild = new pym.Child();
	if (pymChild) {
        pymChild.sendHeight();
    }
}
