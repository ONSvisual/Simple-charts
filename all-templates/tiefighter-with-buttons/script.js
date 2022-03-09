var graphic = d3.select('#graphic');
var footer = d3.select("#footer");
var pymChild = null;

function drawGraphic() {

  //population accessible summmary
  d3.select('#accessibleSummary').html(dvc.essential.accessibleSummary)


  var threshold_md = dvc.optional.mediumBreakpoint;
  var threshold_sm = dvc.optional.mobileBreakpoint;

  //set variables for chart dimensions dependent on width of #graphic
  if (parseInt(graphic.style("width")) < threshold_sm) {
    size = "sm"
  } else if (parseInt(graphic.style("width")) < threshold_md) {
    size = "md"
  } else {
    size = "lg"
  }

  var uniqueSeries = graphic_data.map(function(d) {
    return d.name;
  }).filter(function(d, i, arr) {
    return arr.indexOf(d) === i
  })

  var margin = dvc.optional.margin[size]
  var chart_width = parseInt(graphic.style("width")) - margin.left - margin.right;
  //height is set by unique options in column name * a fixed height
  var height = dvc.optional.seriesHeight[size] * uniqueSeries.length

  // clear out existing graphics
  graphic.selectAll("*").remove();
  footer.selectAll("*").remove();

  //set up scales
  var x = d3.scaleLinear()
    .range([0, chart_width]);

  var y = d3.scalePoint()
    .padding(0.1)
    .range([0, height]);

  //use the data to find unique entries in the name column
  y.domain(uniqueSeries);

  //set up yAxis generator
  var yAxis = d3.axisLeft(y)
    .tickSize(0)
    .tickPadding(10)

  //set up xAxis generator
  var xAxis = d3.axisBottom(x)
    .tickSize(-height);

  //find unique entries in Category column
  buttonsSeries = graphic_data.map(function(d) {
    return d.Category
  }).filter(function(d, i, arr) {
    return arr.indexOf(d) === i
  });

  //make the buttons dynamically rather than hardcoded in the html
  var buttonDivs = d3.select("#buttonForm").selectAll('div.form-group')
    .data(buttonsSeries)
    .enter()
    .append('div')
    .attr('class', 'form-group form-group-fullwidth')
    .attr('role', 'radio')
    .attr('tabindex', 0)

  buttonDivs.append('input')
    .attr('id', function(d, i) {
      return 'button-' + i
    })
    .attr('class', 'radio-primary radio-primary-fullwidth')
    .attr('type', 'radio')
    .attr('name', 'button')
    .attr('value', function(d) {
      return d
    })
    .attr('aria-checked', function(d, i) {
      if (i == 0) {
        return true
      } else {
        return false
      }
    })
    .property('checked', function(d, i) {
      if (i == 0) {
        return true
      }
    })

  buttonDivs.append('label')
    .attr('class', 'label-primary label-primary-fullwidth')
    .attr('for', function(d, i) {
      return 'button-' + i
    })
    .html(function(d) {
      return d
    })


  // Set up the legend
  var legenditem = d3.select('#legend')
  .selectAll('div.legenditem')
  .data(d3.zip(dvc.essential.legendLabels,dvc.essential.colour_palette))
  .enter()
  .append('div')
  .attr('class','legenditem')

  legenditem.append('div').attr('class','square')
  .style('background-color',function(d){return d[1]})

  legenditem.append('div').style('padding-left','5px')
  .append('p').attr('class','legendtext').html(function(d){return d[0]})


  //create svg for chart
  svg = d3.select('#graphic').append('svg')
    .attr("width", chart_width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "chart")
    .style("background-color", "#fff")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")

  drawTieFighter(graphic_data.filter(function(d) {
    return d.Category == "England"
  }))

  //a function that draws the chart given some data
  function drawTieFighter(data) {
    var max = d3.max(data, function(d) {
      return d3.max([+d.min, +d.max])
    })
    x.domain([0, max]) //sometimes you might want min,max or custom
    // x.domain([0,100])

    t = d3.transition()
      .duration(1000)

    svg.selectAll('g.x.axis')
      .data([""])
      .enter()
      .append('g')
      .merge(d3.select('g.x.axis'))
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'x axis')
      .transition(t)
      .call(xAxis)

    svg.selectAll('g.y.axis')
      .data([""])
      .enter()
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    svg.selectAll('line.between')
      .data(data)
      .enter()
      .append('line')
      .merge(d3.selectAll('line.between'))
      .attr('class', 'between')
      .attr('stroke', '#E5E6E7')
      .attr('stroke-width', 3)
      .transition(t)
      .attr('x1', function(d) {
        return x(d.min)
      })
      .attr('x2', function(d) {
        return x(d.max)
      })
      .attr('y1', function(d) {
        return y(d.name)
      })
      .attr('y2', function(d) {
        return y(d.name)
      })

    svg.selectAll('circle.min')
      .data(data)
      .enter()
      .append('circle')
      .merge(d3.selectAll('circle.min'))
      .attr('class', 'min')
      .attr('r', 5)
      .attr('fill', dvc.essential.colour_palette[0])
      .transition(t)
      .attr('cx', function(d) {
        return x(d.min)
      })
      .attr('cy', function(d) {
        return y(d.name)
      })

    svg.selectAll('circle.max')
      .data(data)
      .enter()
      .append('circle')
      .merge(d3.selectAll('circle.max'))
      .attr('class', 'max')
      .attr('r', 5)
      .attr('fill', dvc.essential.colour_palette[1])
      .transition(t)
      .attr('cx', function(d) {
        return x(d.max)
      })
      .attr('cy', function(d) {
        return y(d.name)
      })
  }


  //code for clicking on buttons to switch the dataset
  d3.selectAll("input[name='button']")
    .on('click', function() {
      var foo = this.value
      drawTieFighter(graphic_data.filter(function(d) {
        return d.Category == foo
      }))
    })


  //code for keyboard control buttons
  d3.selectAll(".form-group-fullwidth")
    .on('keydown', function(e) {
      if (d3.event.keyCode === 13 || d3.event.keyCode === 32) {
        d3.select(this).select("input").attr("aria-checked", "true").property("checked", true);
        var foo = d3.select(this).select("input").node().value
        drawTieFighter(graphic_data.filter(function(d) {
          return d.Category == foo
        }))
      }
    })

  //create link to source
  d3.select("#footer").append("h5")
    .text("Source – " + dvc.essential.sourceText)

  //use pym to calculate chart dimensions
  if (pymChild) {
    pymChild.sendHeight();
  }
}


//check whether browser can cope with svg
if (Modernizr.svg) {
  //load config
  // d3.json("config.json", function(error, config) {
  //   dvc = config;

    d3.queue()
      .defer(d3.csv, dvc.essential.graphic_data_url)
      .await(function(error, data) {
        //load chart data
        graphic_data = data

        //use pym to create iframed chart dependent on specified variables
        pymChild = new pym.Child({
          renderCallback: drawGraphic
        });

      });
  // })

} else {
  //use pym to create iframe containing fallback image (which is set as default)
  pymChild = new pym.Child();
  if (pymChild) {
    pymChild.sendHeight();
  }
}
