const graphic = d3.select('#graphic');
const keypoints = d3.select('#keypoints');
let graphic_data;
let pymChild = null;

function drawGraphic(width) {
  let threshold_md = 788;
  let threshold_sm = dvc.optional.mobileBreakpoint;
  let margin, size, chart_width, height, yDomain;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    margin = {
      top: dvc.optional.margin_sm[0],
      right: dvc.optional.margin_sm[1],
      bottom: dvc.optional.margin_sm[2],
      left: dvc.optional.margin_sm[3]
    };
    size = 0;	// used for margin_centre and x_ticks
    chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
    height = Math.ceil((chart_width * dvc.optional.aspectRatio_sm[1]) / dvc.optional.aspectRatio_sm[0]) - margin.top - margin.bottom;
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    margin = {
      top: dvc.optional.margin_md[0],
      right: dvc.optional.margin_md[1],
      bottom: dvc.optional.margin_md[2],
      left: dvc.optional.margin_md[3]
    };
    size = 1;
    chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
    height = Math.ceil((chart_width * dvc.optional.aspectRatio_md[1]) / dvc.optional.aspectRatio_md[0]) - margin.top - margin.bottom;
  } else {
    margin = {
      top: dvc.optional.margin_lg[0],
      right: dvc.optional.margin_lg[1],
      bottom: dvc.optional.margin_lg[2],
      left: dvc.optional.margin_lg[3]
    };
    size = 2;
    chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
    height = Math.ceil((chart_width * dvc.optional.aspectRatio_lg[1]) / dvc.optional.aspectRatio_lg[0]) - margin.top - margin.bottom;
  }

  // clear out existing graphics
  graphic.selectAll("*").remove();
  keypoints.selectAll("*").remove();

  let x = d3.scaleTime()
    .range([0, chart_width]);

  let y = d3.scaleLinear()
    .range([height, 0]);

  x.domain(d3.extent(graphic_data, function (d) {
    return d.date;
  }));

  let xAxis = d3.axisBottom(x)
    .tickFormat(function (d, i) {
      //specify date format for x axis depending on #graphic width
      if (parseInt(graphic.style("width")) <= threshold_sm) {
        let fmt = d3.timeFormat(dvc.optional.xAxisTextFormat_sm_md_lg[0]);
        return '\u2019' + fmt(d);
      } else if (parseInt(graphic.style("width")) <= threshold_md) {
        let fmt = d3.timeFormat(dvc.optional.xAxisTextFormat_sm_md_lg[1]);
        return fmt(d);
      } else {
        let fmt = d3.timeFormat(dvc.optional.xAxisTextFormat_sm_md_lg[2]);
        return fmt(d);
      }
    })
    .tickPadding(5);

  //specify number of ticks on x axis and whether 1st and last data point labels are included
  if (parseInt(graphic.style("width")) < threshold_sm) {
    xAxis.tickValues(x.ticks(dvc.optional.x_num_ticks_sm_md_lg[0]).concat(x.domain()));
  } else if (parseInt(graphic.style("width")) <= threshold_md) {
    xAxis.tickValues(x.ticks(dvc.optional.x_num_ticks_sm_md_lg[1])/*.concat( x.domain() )*/);
  } else {
    xAxis.tickValues(x.ticks(dvc.optional.x_num_ticks_sm_md_lg[2])/*.concat( x.domain() )*/);
  }

  let yAxis = d3.axisLeft(y);

  //specify number or ticks on y axis
  if (parseInt(graphic.style("width")) <= threshold_sm) {
    yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[0])
  } else if (parseInt(graphic.style("width")) <= threshold_md) {
    yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[1])
  } else {
    yAxis.ticks(dvc.optional.y_num_ticks_sm_md_lg[2])
  }

  //gridlines
  let y_axis_grid = function () {
    return yAxis;
  };

  let counter;

  let line = d3.line()
    .defined(function (d) {
      return d.amt || d.amt !== '0';
    }) // nobody can tell me what this line actually does
    .curve(d3.curveLinear)
    .x(function (d) {
      return x(d.date);
    })
    .y(function (d) {
      return y(d.amt);
    });

  // parse data into columns
  let lines = {};
  for (let column in graphic_data[0]) {
    if (column === 'date') continue;
    lines[column] = graphic_data.map(function (d) {
      return {
        'date': d.date,
        'amt': d[column]
      };
    });
  }

  // do some code to overwrite blanks with the last known point
  const keys = d3.keys(lines);
  for (i = 0; i < keys.length; i++) {
    lines[keys[i]].forEach(function (d, j) {
      if (d.amt !== "null") {
        counter = j;
      } else {
        d.date = lines[keys[i]][counter].date;
        d.amt = lines[keys[i]][counter].amt;
      }
    })
  }

  //y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
  if (dvc.essential.yAxisScale === "auto_zero_max") {
    yDomain = [
      0,
      d3.max(d3.entries(lines), function (c) {
        return d3.max(c.value, function (v) {
          let n = v.amt;
          return Math.ceil(n);
        });
      })
    ];
  } else if (dvc.essential.yAxisScale === "auto_min_max") {
    yDomain = [
      d3.min(d3.entries(lines), function (c) {
        return d3.min(c.value, function (v) {
          let n = v.amt;
          return Math.floor(n);
        });
      }),

      d3.max(d3.entries(lines), function (c) {
        return d3.max(c.value, function (v) {
          let n = v.amt;
          return Math.ceil(n);
        });
      })
    ];
  } else {
    yDomain = dvc.essential.yAxisScale;
  }

  y.domain(yDomain);

  //create svg for chart
  let legend = d3.select('#graphic').append('svg')
    .append("g")
    .attr("id", "legend");

  let svg = d3.select('svg')
    .attr("id", "chart")
    .style("background-color", "#fff")
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)  //+30)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("rect")
    .style("fill", "#fff")
    .attr("width", chart_width)
    .attr("height", height);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  svg.append('g')
    .attr('class', 'y grid')
    .call(y_axis_grid()
      .tickSize(-chart_width, 0, 0)
      .tickFormat('')
    );

  //y axis label
  svg.append("text")
  //.attr('class', 'unit')
    .attr('transform', 'translate(' + -margin.left + ',-10)') // " + eval(-margin.top + (lineNo+1)*20) + "
    .attr("font-size", "12px")
    .attr("fill", "#666")
    .text(function (d, i) {
      return dvc.essential.yAxisLabel
    });

  //create x axis, if y axis doesn't start at 0 drop x axis accordingly
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', function (d) {
      if (yDomain[0] != 0) {
        return 'translate(0,' + (height + 30) + ')'
      } else {
        return 'translate(0,' + height + ')'
      }
    })
    .call(xAxis);

  d3.select(".x").select("path").style("stroke", "#666")

  //create icon to symbolise break in y axis if required
  if (yDomain[0] > 0 && dvc.essential.yAxisBreak == true) {
    let paths = svg.append("defs")
      .append("g")
      .attr("id", "icon")
      .append("g");

    paths.append("polyline")
      .attr("points", "2.881,9.54 7.94,5.061 12.341,9.54 17.77,5.061")
      .attr("stroke", "#666")
      .attr("fill", "none")
    paths.append("polyline")
      .attr("points", "2.881,14.54 7.94,10.061 12.341,14.54 17.77,10.061")
      .attr("stroke", "#666")
      .attr("fill", "none");

    //specify position of icon
    svg.append("g").attr("id", "iconpath")
      .attr("transform", "translate(-10,3)")
      .append("use")
      .attr("xlink:href", "#icon")
      .attr("x", x(x.domain()[0]))
      .attr("y", function () {
        if (parseInt(graphic.style("width")) < threshold_sm) {
          return y(dvc.essential.yAxisBreak_sm_md_lg[0])
        } else if (parseInt(graphic.style("width")) < threshold_md) {
          return y(dvc.essential.yAxisBreak_sm_md_lg[1])
        } else {
          return y(dvc.essential.yAxisBreak_sm_md_lg[2])
        }
      });
  }

  //create centre line if required
  if (dvc.optional.centre_line === true) {
    svg.append("line")
      .attr("stroke", "#CCC")
      .attr("stroke-width", 3)
      .attr('y1', y(dvc.optional.centre_line_value))
      .attr('y2', y(dvc.optional.centre_line_value))
      .attr('x1', 0)
      .attr('x2', chart_width);
  } else if (yDomain[0] < 0) {
    svg.append("line")
      .attr("stroke", "#CCC")
      .attr("stroke-width", 3)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('x1', 0)
      .attr('x2', chart_width);
  }

  //create vertical line if required
  if (dvc.optional.vertical_line === true) {
    dvc.optional.annotateLineX1_Y1_X2_Y2.forEach(function (d, i) {
      svg.append("line")
        .attr('x1', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateLineX1_Y1_X2_Y2[i][0][0])))
        .attr('x2', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateLineX1_Y1_X2_Y2[i][1][0])))
        .attr('y1', y(dvc.optional.annotateLineX1_Y1_X2_Y2[i][0][1]))
        .attr('y2', y(dvc.optional.annotateLineX1_Y1_X2_Y2[i][1][1]))
        .style('stroke', '#888')
        .style('stroke-width', 2);
    })
  }

  //create rectangle
  if (dvc.optional.annotateRect === true) {
    dvc.optional.annotateRectX_Y.forEach(function (d, i) {
      svg.append("rect")
        .attr('x', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateRectX_Y[i][0][0])))
        .attr('y', y(dvc.optional.annotateRectX_Y[i][0][1]))
        .attr('height', y(dvc.optional.annotateRectX_Y[i][1][1]) - y(dvc.optional.annotateRectX_Y[i][0][1]))
        .attr('width', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateRectX_Y[i][1][0])) - x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateRectX_Y[i][0][0])))
        .style('fill', dvc.optional.lineColor_opcty[i][0])
        .style('stroke-width', 2)
        .style('opacity', dvc.optional.lineColor_opcty[i][1]);
    })
  }

  //create lines
  svg.append('g').selectAll('path')
    .data(d3.entries(lines).filter(line.defined()))
    .enter()
    .append('path')
    //.attr('class', 'line')
    .style("stroke", function (d) {
      return dvc.essential.colour_palette[d.key];
    })
    .style("fill", 'none')
    .style("stroke-width", 3)
    .style("stroke-linecap", 'round')
    .style("stroke-linejoin", 'round')
    .attr('d', function (d) {
      return line(d.value);
    });

  // add markers
  if (parseInt(graphic.style("width")) > threshold_sm && dvc.optional.lineMarkers === true) {
    for (let column in graphic_data[0]) {
      if (column === 'date') continue;
      svg.append("g")
        .selectAll("circles")
        .data(lines[column]) // raw data
        .enter()
        .append('circle')
        .style('fill', '#fff')
        .style('stroke', function (d) {
          return dvc.essential.colour_palette[column];
        })
        .style('stroke-width', 2)
        .attr("cx", function (d) {
          return x(d.date);
        })
        .attr("cy", function (d) {
          return y(d.amt);
        })
        .attr("r", function (d) {
          if (d[column] != 0) {
            return 3
          } else {
            return 0
          }
        });
    }
  } // ends if

  // circle annotations
  if (dvc.essential.circles === true) {
    dvc.essential.annotationCXCY.forEach(function (d, i) {
      svg.append("circle")
        .attr("cx", x(d3.timeParse(dvc.essential.dateFormat)(dvc.essential.annotationCXCY[i][0])))
        .attr("cy", y(dvc.essential.annotationCXCY[i][1]))
        .attr("r", 6)
        .attr("fill", dvc.essential.annotationColour)

      svg.append("text")
        .attr("x", x(d3.timeParse(dvc.essential.dateFormat)(dvc.essential.annotationCXCY[i][0])) - 20)
        .attr("y", y(dvc.essential.annotationCXCY[i][1]) - 15)
        .text(dvc.essential.annotationCXCY[i][0])
    })
  } // ends if

  writeAnnotation();

  //create link to source

  let sourceElement = d3.select('#source');
  sourceElement
    .text(sourceElement.text() + dvc.essential.sourceText);

  function writeAnnotation() {
    if (parseInt(graphic.style("width")) < threshold_sm) {
      dvc.essential.annotationBullet.forEach(function (d, i) {
        d3.select("#keypoints").append("svg")
          .attr("width", "15px")
          .attr("height", "15px")
          .attr("class", "circles")
          .append("circle")
          .attr("class", "annocirc" + (i))
          .attr("r", "2")
          .attr('cy', "9px")
          .attr("cx", "10px");

        d3.select("#keypoints")
          .append("p")
          .style("font-size", "12px")
          .style("font-weight", 400)
          .text(dvc.essential.annotationBullet[i]);
      })// end foreach
    } else {
      annotations = dvc.essential.annotationsChart;

      // For elements with time series
      for (i = 0; i < annotations.length; i++) {
        annotations[i].xVal = new Date(annotations[i].xVal);
      }

      let swoopy = d3.swoopyDrag()
        .x(function (d) {
          return x(d.xVal)
        })
        .y(function (d) {
          return y(d.yVal)
        })
        .draggable(dvc.essential.draggable)
        .annotations(annotations);

      let swoopySel = svg.append('g').attr("class", "annotations").call(swoopy); // Expected number, "translate()". error for each annotation

      svg.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '-10 -10 20 20')
        .attr('markerWidth', 20)
        .attr('markerHeight', 20)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')
        .attr('fill', '#808080');

      swoopySel.selectAll('path').attr('marker-end', 'url(#arrow)');

      d3.selectAll(".annotations path")
        .style("stroke", "#808080")
        .attr("fill", "none");

      swoopySel.selectAll('text')
        .attr('font-size', '13px')
        .attr('font-size', '13px')
        .attr("font-size", "13px")
        .attr("font-weight", 500)
        .each(function (d, i) {
          d3.select(this)
            .text('')                        //clear existing text
            .tspans(d3.wordwrap(d.text, dvc.essential.wordwrap[i])) //wrap after xx char
        });

      swoopySel.selectAll('text')
        .each(function (d, i) {
          d3.select(this).selectAll('tspan')
            .attr("text-anchor", dvc.essential.annoAlign[i]);
        });
    } // end else ...
  }// end function writeAnnotation()

// always create a legend on mobile. when not on mobile, only create a legend if not using direct line labeling.
  let onMobile = parseInt(graphic.style("width")) < dvc.optional.mobileBreakpoint;
  if (!dvc.essential.directLabeling || onMobile) {
    createLegend();
  } else {
    createLineLabels();
  }

  function createLegend() {
    let prevX = 0;
    let prevY = 0;
    lineNo = 0;
    let lineNoOld = 0;

    dvc.essential.legendLabels.forEach(function (d, i) {
      // draw legend text based on content of let legendLabels ...
      var_group = d3.select("#legend").append("g");

      var_group.append("rect")
        .attr("class", "rect" + i)
        .attr("fill", dvc.essential.colour_palette[d])
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function (d) {
          if (dvc.essential.legendStyle === "rect") {
            return 15;
          } else {
            return 20;
          }
        })
        .attr("height", function (d) {
          if (dvc.essential.legendStyle === "rect") {
            return 15;
          } else {
            return 3;
          }
        });

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
        let BBox = this.getBBox()

        d3.select(".legend" + (i))
          .attr("y", function (d) {
            if ((prevX + BBox.width + 50) > parseInt(graphic.style("width"))) {
              lineNoOld = lineNo;
              lineNo = lineNo + 1;
              prevX = 0;
            }
            return eval((lineNo * 20) + 20);
          })
          .attr("x", function (d) {
            return prevX + 25;
          });

        d3.select(".rect" + (i))
          .attr("y", function (d) {
            if ((prevX + BBox.width + 50) > parseInt(graphic.style("width"))) {
              lineNoOld = lineNo;
              lineNo = lineNo + 1;
              prevX = 0;
            }

            if (dvc.essential.legendStyle === "rect") {
              return eval((lineNo * 20) + 5);
            } else {
              return eval((lineNo * 20) + 12);
            }
          })
          .attr("x", function (d) {
            return prevX;
          });

        prevX = prevX + BBox.width + 50
      } // end function calcPosition()
    });	// end foreach
  }// end function createLegend()

  function createLineLabels() {
    for (let column in graphic_data[0]) {
      if (column === 'date') continue;
      svg.append("text")
      // place the line labels to the right of the lines and add label adjustment from config
        .attr("transform", function (d) {
          let xcoord = x(graphic_data[graphic_data.length - 1]["date"]) + dvc.essential.directLabelingAdjust[column]['x']
          let ycoord = y(graphic_data[graphic_data.length - 1][column]) + dvc.essential.directLabelingAdjust[column]['y'];
          return "translate(" + xcoord + "," + ycoord + ")";
        })
        .attr("x", 10)
        .attr("dy", ".35em")
        .attr("class", "label")
        .style("fill", dvc.essential.colour_palette[column])
        .text(column)
        .call(wrap, margin.right)
    } // end for loop running through data columns
  } // end function createLineLabels()

  function wrap(text, width) {
    text.each(function () {
      let text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y") + 5,
        dy = 0,
        tspan = text.text(null).append("tspan").attr("x", 5).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 5).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  // css fix
  d3.selectAll("path").attr("fill", "none");

  d3.selectAll("text").attr("font-family", "'Open Sans', sans-serif");

  d3.selectAll(".x text").attr("font-size", "12px").attr("fill", "#666");
  d3.selectAll(".y text").attr("font-size", "12px").attr("fill", "#666");

  d3.selectAll(".y line")
    .attr("stroke", "#CCC")
    .attr("stroke-width", "1px")
    .style("shape-rendering", "crispEdges");

  d3.selectAll(".x line")
    .attr("stroke", "#CCC")
    .attr("stroke-width", "1px")
    .style("shape-rendering", "crispEdges");


  // save SVG
  d3.select("#buttonid").on("click", function () {
    saveSvgAsPng(document.getElementById("chart"), "diagram.png")
  });

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }

}  // ends draw graphic

//check whether browser can cope with svg
if (Modernizr.svg) {
  //load config
  d3.json("config.json", function (error, config) {
    dvc = config;

    //load chart data
    d3.csv(dvc.essential.graphic_data_url, function (error, data) {
      graphic_data = data;

      graphic_data.forEach(function (d) {
        d.date = d3.timeParse(dvc.essential.dateFormat)(d.date);
      });

      //use pym to create iframed chart dependent on specified variables
      pymChild = new pym.Child({renderCallback: drawGraphic});
    });
  })
} else {
  //use pym to create iframe containing fallback image (which is set as default)
  pymChild = new pym.Child();
  if (pymChild) {
    pymChild.sendHeight();
  }
}