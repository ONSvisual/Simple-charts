var graphic = d3.select('#graphic');
var footer = d3.select(".footer");
var pymChild = null;

function drawGraphic() {
		var format1 = d3.format(dvc.essential.numberFormat);

		var threshold_md = dvc.optional.mediumBreakpoint;
		var threshold_sm = dvc.optional.mobileBreakpoint;
		var gHeight=dvc.essential.gHeight_sm_md_lg;
		var number=graphic_data.length

		//set variables for chart dimensions dependent on width of #graphic
		if (parseInt(graphic.style("width")) < threshold_sm) {
				var margin = {top: dvc.optional.margin_sm[0], right: dvc.optional.margin_sm[1], bottom: dvc.optional.margin_sm[2], left: dvc.optional.margin_sm[3]};
				var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
				// var height = Math.ceil((chart_width * dvc.optional.aspectRatio_sm[1]) / dvc.optional.aspectRatio_sm[0]) - margin.top - margin.bottom;
				var height = number * gHeight[0]-margin.top-margin.bottom;
		} else if (parseInt(graphic.style("width")) < threshold_md){
				var margin = {top: dvc.optional.margin_md[0], right: dvc.optional.margin_md[1], bottom: dvc.optional.margin_md[2], left: dvc.optional.margin_md[3]};
				var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
				// var height = Math.ceil((chart_width * dvc.optional.aspectRatio_md[1]) / dvc.optional.aspectRatio_md[0]) - margin.top - margin.bottom;
				var height = number * gHeight[1]-margin.top-margin.bottom;
		} else {
				var margin = {top: dvc.optional.margin_lg[0], right: dvc.optional.margin_lg[1], bottom: dvc.optional.margin_lg[2], left: dvc.optional.margin_lg[3]}
				var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
				// var height = Math.ceil((chart_width * dvc.optional.aspectRatio_lg[1]) / dvc.optional.aspectRatio_lg[0]) - margin.top - margin.bottom;
				var height = number * gHeight[2]-margin.top-margin.bottom;
		}

		// clear out existing graphics
		graphic.selectAll("*").remove();
		footer.selectAll("*").remove();


		var x = d3.scaleBand()
				.range([0, chart_width])
				.paddingInner(0.5)
				.paddingOuter(0.1)
				.round(true)
				.align(0.5);

		var y = d3.scaleLinear()
				.range([height, 0]);

		x.domain([25,50,75]);//hard coded

		var yDomain = dvc.essential.yAxisScale;
		y.domain(yDomain);

		yAxis=d3.axisLeft(y)
		.tickSize(-chart_width)
		.ticks(5)
		.tickFormat(d3.format(".0%"))

		var xBand = d3.scaleOrdinal()
		.range([0,x.bandwidth()])
		.domain(["Employee","Self-employed"])

		xBandAxis=d3.axisBottom(xBand)

		xBandAxisNoText=d3.axisBottom(xBand).tickFormat("")

	//create svg for chart
	chart = d3.select('#graphic').append('svg')
		.attr("width", chart_width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)

	chart.append('g').attr('id',"legend")


	svg = chart.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append('g').call(yAxis).select(".domain").remove();


	// svg.append("text")
	// 	.attr("class","leftLabel")
	// 	.attr("x",function (){
	// 			if(graphic.width() < threshold_sm){
	// 				return -margin.left;
	// 			} else {return "-15px"}
	// 	})
	// 	.attr("y",-18)
	// 	.attr("text-anchor",function (){
	// 			if(graphic.width() < threshold_sm){
	// 				return "start"
	// 			} else {return "end"}
	// 	})
	// 	.attr("fill","#666")
	// 	.attr("font-weight", "bold")
	// 	.style("font-size","14px")
	// 	.text(dvc.essential.leftRightTitles[0])
	//
	// svg.append("text")
	// 	.attr("y",-8)
	// 	.attr("x",-margin.left)
	// 	.attr("text-anchor","start")
	// 	.attr("fill","#666")
	// 	.style("font-size","12px")
	// 	.text("%")

//create lines
svg.append('g').attr("id","lines").selectAll(".lines")
.data(graphic_data)
.enter()
.append("line")
.attr('class',"lines")
.attr("x1",function(d){return x(d.incomelost)})
.attr("x2",function(d){return x(d.incomelost)+x.bandwidth()})
.attr("y1",function(d){return y(d.employee)})
.attr("y2",function(d){return y(d.selfemployed)})
.style("stroke",function(d){return dvc.essential.colour_palette[d.name]})
.style("stroke-width",2)

nesteddata=d3.nest().key(function(d){return d.incomelost}).entries(graphic_data)

grouplabels = svg.append('g')
.attr("class","grouplabels");

grouplabels.selectAll(".grouplabels")
.data(["25","50","75"])
.enter()
.append("text")
.attr("x",function(d){return x(d)+x.bandwidth()/2})
.attr("y",-8)
.attr("text-anchor","middle")
.style("fill","#666")
.text(function(d){return d+"% loss"})

if(chart_width+margin.left+margin.right<threshold_md){
svg.selectAll("g.bandlabels")
.data(nesteddata.filter(function(d){return d.key==50}))
.enter()
.append('g')
.attr("class","bandlabels")
.attr("transform",function(d){return "translate("+x(d.key)+" "+height+")"})
.call(xBandAxis)

svg.selectAll("g.bandlabels noText")
.data(nesteddata.filter(function(d){return d.key!=50}))
.enter()
.append('g')
.attr("class","bandlabels noText")
.attr("transform",function(d){return "translate("+x(d.key)+" "+height+")"})
.call(xBandAxisNoText)

d3.selectAll(".bandlabels .tick text").select(function(d, i) { return i & 1 ? this : null; })
.attr("dy","2em")

}else{
svg.selectAll("g.bandlabels")
.data(nesteddata)
.enter()
.append('g')
.attr("class","bandlabels")
.attr("transform",function(d){return "translate("+x(d.key)+" "+height+")"})
.call(xBandAxis)
}



d3.selectAll(".tick line").style("stroke","#dadada")
d3.selectAll(".tick text").style("fill","#666")






createLegend()

//create link to source

d3.select('.footer')
.append('h6')
.text('Source: ' + dvc.essential.sourceText);


function createLegend() {

	var prevX = 0;
	var prevY = 0;
	lineNo = 0;
	var lineNoOld = 0;

	dvc.essential.legendLabels.forEach(function(d, i) {

		// draw legend text based on content of var legendLabels ...
		var_group = d3.select("#legend").append("g")

		var_group.append("rect")
			.attr("class", "rect" + i)
			.attr("fill", dvc.essential.colour_palette[d])
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", function(d) {
				if (dvc.essential.legendStyle == "rect") {
					return 15;
				} else {
					return 20;
				}
			})
			.attr("height", function(d) {
				if (dvc.essential.legendStyle == "rect") {
					return 15;
				} else {
					return 3;
				}
			})

		var_group.append("text")
			.text(dvc.essential.legendLabels[i])
			.attr("class", "legend" + i)
			.attr("text-anchor", "start")
			.style("font-size", "12px")
			.style("fill", "#666")
			.attr('y', 15)
			.attr('x', 0);


		d3.selectAll(".legend" + (i))
			.each(calcPosition);

		function calcPosition() {


			var BBox = this.getBBox()


			//prevY =BBox.width
			d3.select(".legend" + (i))
				.attr("y", function(d) {
					if ((prevX + BBox.width + 50) > parseInt(graphic.style("width"))) {
						lineNoOld = lineNo;
						lineNo = lineNo + 1;
						prevX = 0;
					}
					return eval((lineNo * 20) + 20);
				})
				.attr("x", function(d) {
					return prevX + 25;
				})


			d3.select(".rect" + (i))
				.attr("y", function(d) {

					if ((prevX + BBox.width + 50) > parseInt(graphic.style("width"))) {
						lineNoOld = lineNo;
						lineNo = lineNo + 1;
						prevX = 0;
					}

					if (dvc.essential.legendStyle == "rect") {
						return eval((lineNo * 20) + 5);
					} else {
						return eval((lineNo * 20) + 12);

					}
				})
				.attr("x", function(d) {
					return prevX;
				})

			prevX = prevX + BBox.width + 50



		}; // end function calcPosition()
	}); // end foreach
} // end function createLegend()

//use pym to calculate chart dimensions
if (pymChild) {
		pymChild.sendHeight();
}


}//end of drawGraphic





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
