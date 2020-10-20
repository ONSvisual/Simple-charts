var dvc = {
  "essential" : {
          //data to use for chart
          "graphic_data_url": "data.csv",
          //chart colour
          "colour_palette": [ "#206095" ],
          "negative_colour":["#118C7B"],
          //Set alternative screenreader text if more detail than default is needed
          "screenreadertext":"",
          //Source
          "sourceText":["Labour Market Statistics, February 2015, Table A02"],
          //desktop annotations (double space for new line)
          "annotationChart": [
          //    "Lorem ipsum  dolor sit amet",
          //     "adipiscing elit  sed do eiusmod"
           ],
          // mobile annotations
          "annotationBullet": [
          //    "Lorem ipsum  dolor sit amet",
          //     "adipiscing elit  sed do eiusmod"
           ],
          //position of annotaions specified using x, y values
          "annotationXY":[
              // ["1984","-1"],
              // ["2008","3"]
          ],
          //annotation alignment (start, middle or end)
          "annotationAlign":[
              // "middle",
              // "middle"
          ],
          //y axis label
          "xAxisLabel":"%",
          //y axis scale ("auto_zero_max", "auto_min_max" or custom e.g. [-3,5])
          "xAxisScale":["auto_min_max"]
  },
  "optional" : {
          //specifies margins at different window sizes
          "margin": {
            "sm": {
              "top": 35,
              "right": 20,
              "bottom": 5,
              "left": 185
            },
            "md": {
              "top": 15,
              "right": 20,
              "bottom": 5,
              "left": 185
            },
            "lg": {
              "top": 15,
              "right": 20,
              "bottom": 5,
              "left": 185
            }
          },
          //specifies aspect ratio of chart at different window sizes
          "aspectRatio": {
            "sm": [4, 6],
            "md": [3, 3],
            "lg": [16, 10]
          },
          //specifies smallest breakpoint (for mobile users)
          "mobileBreakpoint" : 510,
          //specifies middle breakpoint(for tablet users)
          "middleBreakpoint": 600,
          //specified the number of ticks required on the x axis at different window sizes
          "x_num_ticks": {
            "sm": 6,
            "md": 8,
            "lg": 10
          },
          //draws vertical_lines if required for annotations (set to true or false)
          "vertical_line" : false,
          //define start and end points of any annotation lines
          "annotateLineX1_Y1_X2_Y2":[
            [
              [25, "South East"],
              [25, "East"]
            ]
          ],
          //draws rectangles if required for annotations (set to true or false)
          "annotateRect" : false,
          //define start and end points of rectangles
          "annotateRectX_Y" : [
            [
              [40, "South West"],
              [75, "West Midlands"]
            ]
          ],
          //draws a line with a heavier stroke, used if the x axis is dropped or the data has negative and positive values
          "centre_line" : true,
          "centre_line_value" : 10
  }
}
