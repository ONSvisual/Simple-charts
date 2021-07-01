var pymChild = null;
var graphic = d3.select('#graphic');
var footer = d3.select("#footer");
var xpos;
var ypos;
var makeAnnotations;

d3.select("#accessibleSummary").text(dvc.essential.accessibleSummary)


function drawGraphic() {
  // initialise breakpoint for medium and small screens
  var threshold_md = dvc.optional.mediumBreakpoint;
  var threshold_sm = dvc.optional.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm" // set mobile size margins, height and width
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  } // end else ...

  // set variables for chart dimensions dependent on width of #graphic
  var margin = dvc.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  var height = Math.ceil((chart_width * dvc.optional.aspectRatio[size][1]) / dvc.optional.aspectRatio[size][0]);

  // clear out existing graphics
  graphic.selectAll("*").remove();
  footer.selectAll("*").remove();



  var svg = d3.select('#graphic').append('svg')
    .attr('width', chart_width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom + 50);

  var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .attr('overflow', 'hidden');

  if (dvc.essential.AxisScale == "auto_min_max") {
    var minX = d3.min(graphic_data, function(d) {
      return +d[dvc.essential.xdata]
    })
    var maxX = d3.max(graphic_data, function(d) {
      return +d[dvc.essential.xdata]
    })
    var minY = d3.min(graphic_data, function(d) {
      return +d[dvc.essential.ydata]
    })
    var maxY = d3.max(graphic_data, function(d) {
      return +d[dvc.essential.ydata]
    })
  } else {
    var minX = dvc.essential.xAxisScale[0];
    var maxX = dvc.essential.xAxisScale[1];
    var minY = dvc.essential.yAxisScale[0];
    var maxY = dvc.essential.yAxisScale[1];
  }

  var ratio = height / chart_width;

  x = d3.scaleLinear()
    .range([0, chart_width])
    .domain([minX, maxX]);

  y = d3.scaleLinear()
    .range([height, 0])
    .domain([minY, maxY]);


  var line = d3.line()
    .x(function(d) {
      return x(d[0]);
    })
    .y(function(d) {
      return y(d[1]);
    });


  var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

  //specify number or ticks on y axis
  yAxis.ticks(dvc.optional.y_num_ticks[size])

  //specify number or ticks on y axis
  xAxis.ticks(dvc.optional.x_num_ticks[size])


  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis)
    .append('text')
    .attr('x', chart_width)
    .attr('dy', '2.5em')
    .attr('text-anchor', 'end')
    .attr('fill', 'rgb(54, 54, 54)')
    .attr('font-size', '1.2em')
    .text(function(d, i) {
      return dvc.essential.xAxisLabel
    });

  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .append('text')
    .attr('y', 10)
    .attr('dy', '-2em')
    .attr('dx', '-3em')
    .attr('text-anchor', 'start')
    .attr('fill', 'rgb(54, 54, 54)')
    .attr('font-size', '1.2em')
    .text(function(d, i) {
      return dvc.essential.yAxisLabel
    })

  var main = g.append('g')
    .attr('class', 'main')

  dvc.optional.annotateLineX1_Y1_X2_Y2.forEach(function(d, i) {
    main.append('path')
      .datum(dvc.optional.annotateLineX1_Y1_X2_Y2[i])
      .attr('d', line)
      .attr('stroke', dvc.optional.lineColor_opcty[i][0])
      .attr('stroke-width', 2)
      .attr('stroke-opacity', dvc.optional.lineColor_opcty[i][1])
      .attr('fill', 'none')
      .attr('class', 'line');
  })

  main.selectAll('.circles').data(graphic_data).enter().append('circle')
    .attr("class", function(d, i) {
      return "circles " + d.group;
    })
    .attr("id", function(d, i) {
      return "circle" + i;
    })
    .attr("cx", function(d) {
      return x(d[dvc.essential.xdata]);
    })
    .attr("cy", function(d) {
      return y(d[dvc.essential.ydata]);
    })
    .attr('r', 4)
    .attr('fill', 'white')
    .attr('stroke', "red")
    .attr('stroke-width', 1)
    .attr('class', 'circles');

  //create link to source
  d3.select('#footer')
    .append('h6')
    .text('Source: ' + dvc.essential.sourceText);

  // make rectangle annotations
  dvc.essential.rectannotations.forEach(function(d, i) {
    main.append('rect')
      .datum(dvc.essential.rectannotations[i])
      .attr("x", x(d.x))
      .attr("y", y(d.y))
      .attr("width", Math.abs(x(dvc.essential.rectannotations[i].width) - x(0)))
      .attr("height", Math.abs(y(dvc.essential.rectannotations[i].height) - y(0)))
      .attr('class', 'rect')
      .attr("fill", d.colour)
      .attr("opacity", d.opacity);
  })

  // make written annotations
  dvc.essential.textAnnotations.forEach(function(d, i) {
    main.append('text')
      .datum(dvc.essential.textAnnotations[i])
      .attr("x", x(d.x))
      .attr("y", y(d.y))
      .attr("class", "annotext")
      .text(d.text)
      .call(wrap, dvc.essential.textAnnotationWrap);
  })


  //d3-annotations tooltips(from https://bl.ocks.org/Fil/17fc857c3ce36bf8e21ddefab8bc9af4/167bce6e2b706016004a3baf14f838203646a27a)

  // create a container for tooltips
  tipg = svg.append("g")
    .attr("class", "annotation-tip");

  // this function will call d3.annotation when a tooltip has to be drawn
  function tip(d) {
    annotationtip = d3.annotation()
      .type(d3.annotationCalloutCircle)
      .annotations([d].map(function(d) {
        return {
          data: {
            x: d.data[0],
            y: d.data[1]
          },
          dx: (d[0] > chart_width / 2) ? -50 : 50,
          dy: (d[1] > height / 2) ? -50 : 50,
          note: {
            title: graphic_data[d.index].name || "??",
            label: dvc.essential.xAxisLabel + ": " + d3.format('.0f')(d.data[0]) + ", " + dvc.essential.yAxisLabel + ": " + d3.format('.0f')(d.data[1]),
            wrap: dvc.essential.d3AnnotationWrap
          },
          subject: {
            radius: 4,
            radiusPadding: 0,
          },

        };
      }))
      .accessors({
        x: function(d) {
          return x(d.x) + margin.left
        },
        y: function(d) {
          return y(d.y) + margin.top
        }
      })
    tipg.call(annotationtip);

    d3.select("rect.annotation-note-bg").attr("fill", "#eee").attr("fill-opacity", 1).attr("opacity", 0.9).attr("rx", 5).attr("ry", 5).attr("stroke", "#eee").attr("stroke-width", "10px");
    d3.select(".annotation-note-label").attr("fill", "#666");
    d3.select(".annotation-note-title").attr("fill", "#666");

  }

  //reformat the data for the voronoi
  var makingdata = [];
  makingdata.push(makedata());

  function makedata() {
    var data = [];
    for (var i = 0; i < graphic_data.length; i++) {
      data.push([graphic_data[i][dvc.essential.xdata], graphic_data[i][dvc.essential.ydata]]);
    }
    return data;
  }
  //voronoi
  var vorData = d3.merge(makingdata);

  var voronoi = d3.voronoi()
    .x(function(d) {
      return x(d[0]);
    })
    .y(function(d) {
      return y(d[1]);
    })
    .size([chart_width, height])(vorData);

  var voronoiRadius = chart_width;

  //focus
  var focus = g.append('g').style('display', 'none');

  focus.append('line')
    .attr('id', 'focusLineX')
    .attr('class', 'focusLine');
  focus.append('line')
    .attr('id', 'focusLineY')
    .attr('class', 'focusLine');
  focus.append('circle')
    .attr('id', 'focusCircle')
    .attr('r', 4)
    .attr('class', 'circle focusCircle');

  if (parseInt(graphic.style("width")) > dvc.optional.mobileBreakpoint) {

    svg.append('rect')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
      .attr("class", "overlay")
      .attr("width", chart_width)
      .attr("height", height)
      .attr("opacity", 0)
      .on('mouseover', function() {
        focus.style('display', null);
      })
      .on('mouseout', function() {
        focus.style('display', 'none');
        tipg.selectAll("g").remove();
      })
      .on('mousemove', function() {

        //var [mx, my] = d3.mouse(this); ES6 version
        var mx = d3.mouse(this)[0],
          my = d3.mouse(this)[1]


        // use the new diagram.find() function to find the Voronoi site
        // closest to the mouse, limited by max distance voronoiRadius
        var site = voronoi.find(mx, my, voronoiRadius);

        tip(site); //tooltip stuff
        var xpos = site[0];
        var ypos = site[1];

        focus.select('#focusCircle')
          .attr('cx', xpos)
          .attr('cy', ypos);
        focus.select('#focusLineX')
          .attr('x1', xpos).attr('y1', y(y.domain()[0]))
          .attr('x2', xpos).attr('y2', ypos);
        focus.select('#focusLineY')
          .attr('x1', x(x.domain()[0])).attr('y1', ypos)
          .attr('x2', xpos).attr('y2', ypos);


      })


  } //end if wider than mobileBreakpoint then do stuff

  //word wrapping function from https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }


} //end drawGraphic


//then, onload, check to see if the web browser can handle 'inline svg'
if (Modernizr.svg) {
  //load chart data
  d3.csv(dvc.essential.graphic_data_url, function(error, data) {
    // read in and store data held in CSV as global data variable.
    graphic_data = data;

    pymChild = new pym.Child({
      renderCallback: drawGraphic
    });
  }) // end data load
} // end modernizr if ...
else {
  //use pym to create iframe containing fallback image (which is set as default)
  pymChild = new pym.Child();

  d3.select("#graphic").empty();
  d3.select("#graphic").append("img").attr("src", "fallback.png");

  if (pymChild) {
    pymChild.sendHeight();
  }
} // end else ...
