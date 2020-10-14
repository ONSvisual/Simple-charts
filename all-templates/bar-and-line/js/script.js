const graphic = d3.select('#graphic');
const keypoints = d3.select('#keypoints');
let pymChild = null;

function drawGraphic(width) {
  let lineNo = 0;

  //set variables for chart dimensions dependent on width of #graphic
  let size;
  if (parseInt(graphic.style("width")) < dvc.optional.mobileBreakpoint) {
    size = "sm";
  } else if (parseInt(graphic.style("width")) < dvc.optional.midBreakpoint) {
    size = "md"
  } else {
    size = "lg"
  }
  let margin = dvc.optional.margin[size];
  let chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  let height = Math.ceil((chart_width * dvc.optional.aspectRatio[size][1]) / dvc.optional.aspectRatio[size][0]);

  // clear out existing graphics
  graphic.selectAll("*").remove();
  keypoints.selectAll("*").remove();

  let startDate = new Date(graphic_data[0].date);
  let endDate = new Date(graphic_data[graphic_data.length - 1].date);
  endDate = endDate.setFullYear(endDate.getFullYear() + 1);

  let everyDate = d3.utcDay.range(startDate, endDate);
  let barWidth = chart_width / ((everyDate.length / 365)) - 5;

  let everyYear = d3.utcYear.range(startDate, endDate);

  let timeFormat = d3.timeFormat("%Y");

  let xOrdDomain = [];

  for (let i = 0; i < everyDate.length; i++) {
    xOrdDomain.push(timeFormat(everyDate[i]));
  }

  let x = d3.scaleTime().range([0, chart_width]);

  let xOrd = d3.scalePoint()
    .range([0, chart_width])
    .domain(xOrdDomain);

  let xOrdAxis = d3.axisBottom(xOrd)
    .tickFormat(function(d, i) {
      if (chart_width <= dvc.optional.mobileBreakpoint) {
        let str = d;
        return i % dvc.essential.ticksEvery[size] ? "" : '\u2019' + str.substring(2, 4);
      } else {
        return i % dvc.essential.ticksEvery[size] ? "" : d;
      }
    })
    .tickPadding(5)
    .ticks(23);

  let y = d3.scaleLinear()
    .range([height, 0]);

  let formatAsPercentage = d3.formatPrefix('%', 0);

  x.domain(d3.extent(graphic_data, function(d) {
    return d.year;
  }));

  let yAxis = d3.axisLeft(y)
    .tickSize(-chart_width - barWidth, 0, 0);

  //specify number or ticks on y axis
  yAxis.ticks(dvc.optional.y_num_ticks[size]);

  let line = d3.line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.amt);
    });

  // parse data into columns
  let lines = {};
  for (let column in graphic_data[0]) {
    if (column === 'date') continue;
    lines[column] = graphic_data.map(function(d) {
      return {
        'date': d.date,
        'amt': d[column]
      };
    });
  }


  let legend = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "legend");

  let svg = d3.select('svg')
    .attr("id", "chart")
    .style("background-color", "#fff")
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  createLegend();

  svg.append("text")
    .attr('class', 'unit')
    .attr('transform', "translate(" + -margin.left + "," + eval(-margin.top + (lineNo + 2) * 20) + ")")
    .attr("font-size", "12px")
    .attr("fill", "#666")
    .text(function(d, i) {
      return dvc.essential.yAxisLabel;
    });

  x.domain(d3.extent(graphic_data, function(d) {
    return d.date;
  }));

  //y domain calculations	: zero to intelligent max choice, or intelligent min and max choice,  or interval chosen manually
  let yDomain;
  if (dvc.essential.yAxisScale === "auto_zero_max") {
    yDomain = [
      0,
      d3.max(d3.entries(lines), function(c) {
        return d3.max(c.value, function(v) {
          let n = v.amt;
          return Math.ceil(n / 100) * 100;
        });
      })
    ];
  } else if (dvc.essential.yAxisScale === "auto_min_max") {
    yDomain = [
      d3.min(d3.entries(lines), function(c) {
        return d3.min(c.value, function(v) {
          let n = v.amt;
          return Math.floor(n);
        });
      }),
      d3.max(d3.entries(lines), function(c) {
        return d3.max(c.value, function(v) {
          let n = v.amt;
          return Math.ceil(n / 100) * 100;
        });
      })
    ];
  } else {
    yDomain = dvc.essential.yAxisScale;
  }

  y.domain(yDomain);

  svg.append('g')
    .attr('class', 'y axis')
    .attr("id", "yAxis")
    .call(yAxis);

  d3.select(".x").select("path").style("stroke", "#666")

  //create lines line if required
  dvc.optional.annotateLineX1_Y1_X2_Y2.forEach(function(d, i) {
    svg.append("line")
      .attr('x1', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateLineX1_Y1_X2_Y2[i][0][0])))
      .attr('x2', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateLineX1_Y1_X2_Y2[i][1][0])))
      .style('stroke', '#888')
      .style('stroke-width', 2)
      .style('stroke-dasharray', '5 5')
      .attr('y1', y(dvc.optional.annotateLineX1_Y1_X2_Y2[i][0][1]))
      .attr('y2', y(dvc.optional.annotateLineX1_Y1_X2_Y2[i][1][1]));
  })

  //create rectangle if required
  dvc.optional.annotateRect.forEach(function(d, i) {
    svg.append("rect")
      .attr('x', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateRect[i].topLeft[0])))
      .attr('y', y(dvc.optional.annotateRect[i].topLeft[1]))
      .attr('height', y(dvc.optional.annotateRect[i].bottomRight[1]) - y(dvc.optional.annotateRect[i].topLeft[1]))
      .attr('width', x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateRect[i].bottomRight[0])) - x(d3.timeParse(dvc.essential.dateFormat)(dvc.optional.annotateRect[i].topLeft[0])))
      .style('fill', dvc.optional.annotateRect[i].fill)
      .style('stroke-width', 2)
      .style('opacity', dvc.optional.annotateRect[i].opacity);
  })

  svg.append('g').attr("class", "lines")
    .selectAll('path')
    .data(d3.entries(lines))
    .enter()
    .append('path')
    .attr('class', function(d, i) {
      return 'line line-' + i;
    })
    .attr('d', function(d) {
      return line(d.value);
    })
    .style("stroke", function(d, i) {
      if (i != 0) {
        return dvc.essential.colour_palette[i];
      } else {
        return "none"
      }
    })
    .style("stroke-width", "2px");

  if (dvc.essential.markers === true) {
    let j = 0;
    for (let column in graphic_data[0]) {
      if (column === 'date') continue;

      svg.append("g")
        .selectAll("circle")
        .data(graphic_data)
        .enter()
        .append('circle')
        .attr("cx", function(d, i) {
          return x(d.date);
        })
        .attr("cy", function(d, i) {
          return y(d[column]);
        })
        .attr("r", 3)
        .attr("stroke", function(d, i) {
          if (j !== 0) {
            return dvc.essential.colour_palette[j];
          } else {
            return "none"
          }
        })
        .attr("stroke-width", "2px")
        .attr("fill", "#fff");

      j++
    }
  }

  svg.append('g')
    .attr("class", "bars")
    .selectAll('rect')
    .data(lines[dvc.essential.legendLabels[0]])
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', function(d) {
      if (d.amt < 0) {
        return y(0)
      } else {
        return y(d.amt)
      }
    })
    .attr('x', function(d, i) {
      return (x(d.date) - barWidth / 2);
    })
    .attr('height', function(d) {
      if (d.amt < 0) {
        return (y(d.amt) - y(0))
      } else {
        return (y(0) - y(d.amt))
      }
    })
    .attr('width', barWidth)
    .attr("fill", "#274796")
    .attr('opacity', 0.9);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "labels")
    .call(xOrdAxis);

  d3.select(".labels").attr("transform", "translate(0," + y(0) + ")");

  d3.selectAll(".labels").selectAll("text").attr("transform", "translate(" + barWidth / 2 + ",0)");
  d3.selectAll(".labels").selectAll("line").attr("transform", "translate(" + barWidth / 2 + ",0)");

  d3.selectAll(".labels")
    .selectAll("line")
    .style("display", function(d, i) {
      return i % dvc.essential.ticksEvery[size] ? "none" : ""
    });

  d3.selectAll(".bars").attr('transform', 'translate(' + barWidth / 2 + ',0)');
  d3.selectAll(".lines").attr('transform', 'translate(' + (barWidth / 2) + ',0)');
  d3.selectAll("circle").attr('transform', 'translate(' + (barWidth / 2) + ',0)');

  //get the lines existing length
  //gridlength = d3.select(".grid line").attr("x2");

  //d3.selectAll(".grid line").attr("x2", gridlength*1+barWidth);

  //	svg.append("line")
  //		.attr("id","ordline")
  //		.attr('y1',y(0))
  //		.attr('y2',y(0))
  //		.attr('x1',x(x.domain()[0]))
  //		.attr('x2',gridlength*1+barWidth);

  //create centre line if required
  if (dvc.optional.centre_line === true) {
    svg.append("line")
      .attr("id", "centreline")
      .attr('y1', y(dvc.optional.centre_line_value))
      .attr('y2', y(dvc.optional.centre_line_value))
      .attr('x1', 0)
      .attr('x2', x.range()[1] + margin.left);
  } else if (yDomain[0] < 0) {
    svg.append("line")
      .attr("id", "centreline")
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('x1', 0)
      .attr('x2', x.range()[1] + margin.left);
  }

  function createLegend() {
    let prevX = 0;
    let prevY = 0;
    let lineNoOld = 0;

    dvc.essential.legendLabels.forEach(function(d, i) {
      // draw legend text based on content of let legendLabels ...
      let var_group = d3.select("#legend").append("g");

      var_group.append("rect")
        .attr("class", "rect" + i)
        .attr("fill", dvc.essential.colour_palette[i])
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", function(d) {
          if (dvc.essential.legendStyle === "rect") {
            return 15;
          } else {
            return 20;
          }
        })
        .attr("height", function(d) {
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
        let BBox = this.getBBox();

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
          });


        d3.select(".rect" + (i))
          .attr("y", function(d) {
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
          .attr("x", function(d) {
            return prevX;
          })

        prevX = prevX + BBox.width + 50

        //d3.select("#chart").attr("transform", "translate(" + margin.left + "," +( margin.top + eval((lineNo+1)*margin.top))+ ")")
      } // end function calcPosition()
    }); // end foreach
  } // end function createLegend()

  writeAnnotation();

  function writeAnnotation() {
    if (parseInt(graphic.style("width")) < dvc.optional.mobileBreakpoint) {
      dvc.essential.annotationBullet.forEach(function(d, i) {
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
      }) // end foreach
    } else {
      let annotations = dvc.essential.annotationsChart;

      // For elements with time series
      for (let i = 0; i < annotations.length; i++) {
        annotations[i].xVal = new Date(annotations[i].xVal);
      }

      let swoopy = d3.swoopyDrag()
        .x(function(d) {
          return x(d.xVal)
        })
        .y(function(d) {
          return y(d.yVal)
        })
        .draggable(dvc.essential.draggable)
        .annotations(annotations);

      let swoopySel = svg.append('g').attr("class", "annotations").call(swoopy);

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
        .attr("font-size", "13px")
        .attr("font-weight", 500)
        .each(function(d, i) {
          d3.select(this)
            .text('') //clear existing text
            .tspans(d3.wordwrap(d.text, dvc.essential.wordwrap[i])) //wrap after xx char
        });

      swoopySel.selectAll('text')
        .each(function(d, i) {
          d3.select(this).selectAll('tspan')
            .attr("text-anchor", dvc.essential.annoAlign[i]);
        });
    } // end else ...
  } // end function writeAnnotation()

  let legendHeight = d3.select("#legend").node().getBBox().height;

  let svgHeight = d3.select('#graphic').select('svg').attr("height");

  d3.select('#graphic').select('svg').attr("height", +svgHeight + +legendHeight + 30);

  //create link to source
  d3.select('#source')
    .text('Source: ' + dvc.essential.sourceText);

  //Fix CSS

  d3.selectAll("path").attr("fill", "none");
  d3.selectAll("text").attr("font-family", "'Open Sans', sans-serif");
  d3.selectAll(".y text").attr("font-size", "12px").attr("fill", "#666");
  d3.selectAll(".y line").attr("stroke", "#CCC").attr("stroke-width", "1px").style("shape-rendering", "crispEdges");

  if (pymChild) {
    pymChild.sendHeight();
  }
}


if (Modernizr.svg) {
  //load config
  d3.json("config.json", function(error, config) {
    dvc = config;

    d3.csv(dvc.essential.graphic_data_url, function(error, data) {
      graphic_data = data;
      graphic_data.forEach(function(d, i) {
        d.date = d3.timeParse(dvc.essential.dateFormat)(d.date);
      });

      pymChild = new pym.Child({
        renderCallback: drawGraphic
      });
    });
  })
} else {
  pymChild = new pym.Child();

  if (pymChild) {
    pymChild.sendHeight();
  }
}