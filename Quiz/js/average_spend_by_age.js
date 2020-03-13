
  var ageNames;
  var graphic = d3.select('#graphic');
  var keypoints = d3.select('#keypoints');
  var footer = d3.select(".footer");
  var pymChild = null;



  function drawGraphic(width) {

    var threshold_md = 788; // new code ..
    var threshold_sm = dvc.optional.mobileBreakpoint; // new code ..

    //set variables for chart dimensions dependent on width of #graphic
    if (parseInt(graphic.style("width")) < threshold_sm) {
      var margin = {
        top: dvc.optional.margin_sm[0],
        right: dvc.optional.margin_sm[1],
        bottom: dvc.optional.margin_sm[2],
        left: dvc.optional.margin_sm[3]
      };
      var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
      var height = Math.ceil((chart_width * dvc.optional.aspectRatio_sm[1]) / dvc.optional.aspectRatio_sm[0]) - margin.top - margin.bottom;
    } else if (parseInt(graphic.style("width")) < threshold_md) {
      var margin = {
        top: dvc.optional.margin_md[0],
        right: dvc.optional.margin_md[1],
        bottom: dvc.optional.margin_md[2],
        left: dvc.optional.margin_md[3]
      };
      var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
      var height = Math.ceil((chart_width * dvc.optional.aspectRatio_md[1]) / dvc.optional.aspectRatio_md[0]) - margin.top - margin.bottom;
    } else {
      var margin = {
        top: dvc.optional.margin_lg[0],
        right: dvc.optional.margin_lg[1],
        bottom: dvc.optional.margin_lg[2],
        left: dvc.optional.margin_lg[3]
      }
      var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
      var height = Math.ceil((chart_width * dvc.optional.aspectRatio_lg[1]) / dvc.optional.aspectRatio_lg[0]) - margin.top - margin.bottom;
    }


    // clear out existing graphics
    graphic.selectAll("*").remove();
    keypoints.selectAll("*").remove();
    footer.selectAll("*").remove();

    var num_ticks = 10;
    var color = d3.scaleOrdinal().range(dvc.essential.colour_palette);


    x0 = d3.scaleBand().rangeRound([0, chart_width]).paddingInner(0.1);;
    var x1 = d3.scaleBand();
    var y = d3.scaleLinear().range([height, 0]);


    var parseDate = d3.timeParse("%Y");

    var xAxis = d3.axisBottom(x0)
      .tickFormat(function(d, i) {

        //specify date format for x axis depending on #graphic width
        if (parseInt(graphic.style("width")) <= threshold_sm) {
          var fmt = d3.timeFormat(dvc.optional.xAxisTextFormat_sm_md_lg[0]);
          //return '\u2019' + fmt(d);
        } else if (parseInt(graphic.style("width")) <= threshold_md) {
          var fmt = d3.timeFormat(dvc.optional.xAxisTextFormat_sm_md_lg[1]);
          //return  fmt(d);
        } else {
          var fmt = d3.timeFormat(dvc.optional.xAxisTextFormat_sm_md_lg[2]);
          //return fmt(d);
        }

        if (dvc.essential.GraphType == "clusterBar") {
          return d;
        } /* new code */
        else {
          return fmt(d);
        } /* new code */

      })
      .tickPadding(5);

    var legend = d3.select('#graphic').append('svg')
      .attr("width", chart_width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 30)
      .append("g")
      .attr("id", "legend")

    var svg = d3.select('svg')
      .attr("id", "chart")
      .style("background-color", "#fff")
      .attr("width", chart_width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 30)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + (margin.top + 30) + ")")


    x0.domain(graphic_data.map(function(d) {
      return d.state;
    }));
    x1.domain(ageNames).range([0, x0.bandwidth()]);



    //y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
    if (dvc.essential.yAxisScale == "auto_zero_max") {
      var yDomain = [0, Math.ceil(dvc.maxVal / 100) * 100];
    } else if (dvc.essential.yAxisScale == "auto_min_max") {
      var yDomain = [dvc.minVal, Math.ceil(dvc.maxVal / 100) * 100];
    } else {
      var yDomain = dvc.essential.yAxisScale;
    }


    y.domain(yDomain);

    var yAxis = d3.axisLeft(y);


    //specify number or ticks on y axis
    if (parseInt(graphic.style("width")) <= threshold_sm) {
      yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[0])
    } else if (parseInt(graphic.style("width")) <= threshold_md) {
      yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[1])
    } else {
      yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[2])
    }




    //create centre line if required
    if (dvc.optional.centre_line == true) {
      svg.append("line")
        .attr("id", "centreline")
        .attr('y1', y(dvc.optional.centre_line_value))
        .attr('y2', y(dvc.optional.centre_line_value))
        .attr('x1', 0)
        .attr('x2', chart_width);
    } else if (yDomain[0] < 0) {
      svg.append("line")
        .attr("id", "centreline")
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('x1', 0)
        .attr('x2', chart_width);
    }

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.tickSize(-chart_width, 0))

    //create x axis, if y axis doesn't start at 0 drop x axis accordingly
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', function(d) {
        if (yDomain[0] != 0) {
          return 'translate(0,' + (height + 30) + ')'
        } else {
          return 'translate(0,' + (height) + ')'
        }
      })
      .call(xAxis);

    d3.select(".x").select("path").style("stroke", "#666")


    //specify number of ticks on x axis and whether 1st and last data point labels are included
    if (parseInt(graphic.style("width")) < threshold_sm) {
      xAxis.tickValues(x0(dvc.optional.x_num_ticks_sm_md_lg[0]) /*.concat( x.domain())*/ );
    } else if (parseInt(graphic.style("width")) <= threshold_md) {
      xAxis.tickValues(x0(dvc.optional.x_num_ticks_sm_md_lg[1]));
    } else {
      xAxis.tickValues(x0(dvc.optional.x_num_ticks_sm_md_lg[2]));
    }


    var state = svg.selectAll(".state")
      .data(graphic_data)
      .enter()
      .append("g")
      .attr("class", "g")
      .attr("transform", function(d, i) {
        return "translate(" + parseFloat(x0(d.state)) + ",0)";
      });



    writeAnnotation();

    function writeAnnotation() {

      if (parseInt(graphic.style("width")) < threshold_sm) {

        dvc.essential.annotationBullet.forEach(function(d, i) {

          d3.select("#keypoints").append("svg")
            .attr("width", "20px")
            .attr("height", "20px")
            .attr("class", "circles")
            .append("circle")
            .attr("class", "annocirc" + (i))
            .attr("r", "2")
            .attr('cy', "12px")
            .attr("cx", "10px");

          d3.select("#keypoints")
            .append("p")
            .style("font-size", "12px")
            .style("font-weight", 400)
            .text(dvc.essential.annotationBullet[i]);

        }) // end foreach
      } else {

        dvc.essential.annotationChart.forEach(function(d, i) {

          // draw annotation text based on content of var annotationArray ...
          svg.append("text")
            .text(dvc.essential.annotationChart[i])
            .attr("class", "annotext" + i)
            .attr("text-anchor", dvc.essential.annotationAlign[i])
            .attr('y', y(dvc.essential.annotationXY[i][1]))
            .attr('x', x0((dvc.essential.annotationXY[i][0])));

          d3.selectAll(".annotext" + (i))
            .attr("fill", "#666")
            .attr("font-size", "13px")
            .attr("font-weight", 500)
            .each(insertLinebreaks)
            .each(createBackRect);



          function insertLinebreaks() {

            var str = this;

            var el1 = dvc.essential.annotationChart[i];
            var el = el1.data;

            var words = el1.split('  ');

            d3.select(this /*str*/ ).text('');

            for (var j = 0; j < words.length; j++) {
              var tspan = d3.select(this).append('tspan').text(words[j]);
              if (j > 0)
                tspan.attr('x', x0(dvc.essential.annotationXY[i][0])).attr('dy', '22');
            }
          };

          function createBackRect() {

            var BBox = this.getBBox()

            svg.insert("rect", ".annotext" + (i))
              .attr("width", BBox.width)
              .attr("height", BBox.height)
              .attr("x", BBox.x)
              .attr("y", BBox.y)
              .attr("fill", "white")
              .attr("opacity", 0.4);

          }; // end function createBackRect()

        }); // end foreach

      } // end else ...

      return;

    } // end function writeAnnotation()

    if (dvc.optional.vertical_line == true) {
      dvc.optional.annotateLineX1_Y1_X2_Y2.forEach(function(d, i) {
        svg.append("line")
          .attr('x1', x0(dvc.optional.annotateLineX1_Y1_X2_Y2[i][0][0]))
          .attr('x2', x0(dvc.optional.annotateLineX1_Y1_X2_Y2[i][1][0]))
          .style('stroke', '#888')
          .style('stroke-width', 2)
          .attr('y2', y(dvc.optional.annotateLineX1_Y1_X2_Y2[i][1][1]));
      })
    }

    if (dvc.optional.annotateRect == true) {

      dvc.optional.annotateRectX_Y.forEach(function(d, i) {

        svg.append("rect")
          .attr('x', x0(dvc.optional.annotateRectX_Y[i][0][0]))
          .attr('y', y(dvc.optional.annotateRectX_Y[i][0][1]))
          .attr('height', y(dvc.optional.annotateRectX_Y[i][1][1]) - y(dvc.optional.annotateRectX_Y[i][0][1]))
          .attr('width', x0(dvc.optional.annotateRectX_Y[i][1][0]) - x0(dvc.optional.annotateRectX_Y[i][0][0]))
          .style('fill', dvc.optional.lineColor_opcty[i][0])
          .style('stroke-width', 2)
          .style('opacity', dvc.optional.lineColor_opcty[i][1]);

      })
    }


    createLegend();


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
          .attr("fill", dvc.essential.colour_palette[i])
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

          //d3.select("#chart").attr("transform", "translate(0, 0)")

        }; // end function calcPosition()
      }); // end foreach
    } // end function createLegend()

    legend_height = d3.select("#legend").node().getBBox()

    d3.select('#chart').attr("height", height + margin.top + margin.bottom + legend_height.height)

    d3.select('#graphic').select('svg')
      .append("g")
      .attr("id", "source")
      .append("text")
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .style("fill", "#666")
      .attr('y', height + margin.top + margin.bottom + legend_height.height - 5)
      .attr('x', 0)
      .text("Source: ")
      .append("a")
      .style("fill", "#4774CC")
      .attr("xlink:href", dvc.essential.sourceURL)
      .attr("target", "_blank")
      .text(dvc.essential.sourceText);



    svg.append("text")
      .attr('class', 'unit')
      .attr('transform', "translate(" + -margin.left + "," + eval(-margin.top + (lineNo + 1) * 20) + ")")
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text(function(d, i) {
        return dvc.essential.yAxisLabel
      });


    svg.append("text")
      .attr('class', 'unit')
      .attr("transform", "translate(" + chart_width / 2.2 + "," + (height + (margin.bottom / 2)) + ")") // centre below axis
      .attr("font-size", "12px")
      .attr("fill", "#666")
      .text(function(d, i) {
        return dvc.essential.xAxisLabel
      });

    state.selectAll("rect")
      .data(function(d) {
        return d.ages;
      })
      .enter()
      .append("rect")
      .attr("width", x1.step())
      .attr("x", function(d) {
        return x1(d.name);
      })
      .attr("y", function(d) {
        if (d.value < 0) {
          return y(0);
        } else {
          return y(d.value);
        }
      })
      .attr("height", function(d) {
        if (d.value > 0) {
          return y(0) - y(d.value);
        } else {
          return y(d.value) - y(0);
        }
      })
      .style("fill", function(d) {
        return color(d.name);
      })
      .style("opacity", 1);


    d3.selectAll("path").attr("fill", "none");

    d3.selectAll("text").attr("font-family", "'Open Sans', sans-serif");

    d3.selectAll(".y text").attr("font-size", "12px").attr("fill", "#666");
    d3.selectAll(".x text").attr("font-size", "12px").attr("fill", "#666"); // dates - timelines

    d3.selectAll(".y line")
      .attr("stroke", "#CCC")
      .attr("stroke-width", "1px")
      .style("shape-rendering", "crispEdges");

    if (pymChild) {
      pymChild.sendHeight();
    }
  }


  if (Modernizr.svg) {
    //load config
    d3.json("chartconfig.json", function(error, config) {

      dvc = config;

      d3.csv(dvc.essential.graphic_data_url, function(error, data) {

        graphic_data = data;

        ageNames = d3.keys(graphic_data[0]).filter(function(key) {
          return key !== "state";
        });


        /* START MODIFIED */
        dvc.dataMinArray = [];
        dvc.dataMaxArray = [];
        /* END MODIFIED */

        graphic_data.forEach(function(d, i) {

          /* START MODIFIED */
          dvc.dataMinArray[i] = [];
          dvc.dataMaxArray[i] = [];
          dvc.minVal = Infinity;
          dvc.maxVal = -Infinity;
          /* END MODIFIED */

          d.ages = ageNames.map(function(name) {

            /* START MODIFIED */
            if (+d[name] <= dvc.minVal) {
              dvc.minVal = +d[name];
              dvc.dataMinArray[i] = +d[name];
            }

            if (+d[name] >= dvc.maxVal) {
              dvc.maxVal = +d[name];
              dvc.dataMaxArray[i] = +d[name];
            }
            /* END MODIFIED */

            return {
              name: name,
              value: +d[name]
            };
          });

        });

        pymChild = new pym.Child({
          renderCallback: drawGraphic
        });
      });
    })
  } else {
    pymChild = new pym.Child();
    pymChild.sendHeight();
  }
