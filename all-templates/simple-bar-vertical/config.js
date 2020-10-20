var dvc = {
  "essential" : {
          //data to use for chart
          "graphic_data_url": "data.csv",
          //chart colour
          "colour_palette": [ "#206095" ],
          "negative_colour":["#118C7B"],
          //x values are not loaded as dates but option to do so exists below
          //"dateFormat":"%Y",
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
          "yAxisLabel":"%",
          //y axis scale ("auto_zero_max", "auto_min_max" or custom e.g. [-3,5])
          "yAxisScale":["auto_min_max"],
          //set y axis break to true if y axis dosen't start at 0 and doesn't contain negative values
          //this enables the x axis to be dropped
          "yAxisBreak": false,
          //specifies position of "break" icon
          "yAxisBreak_sm_md_lg": [5,5,5]
  },
  "optional" : {
          //specifies margins at different window sizes
          "margin_sm": [20, 10, 55, 30],
          "margin_md": [20, 10, 45, 30],
          "margin_lg": [20, 10, 45, 30],
          //specifies aspect ratio of chart at different window sizes
          "aspectRatio_sm" : [16,13],
          "aspectRatio_md" : [16,12],
          "aspectRatio_lg" : [16,10],
          //specifies smallest breakpoint (for mobile users)
          "mobileBreakpoint" : 610,
          //specified the number of ticks required on the y axis at different window sizes
          "y_num_ticks_sm_md_lg" : [6,8,10],
          //draws vertical_lines if required for annotations (set to true or false)
          "vertical_line" : false,
          //define start and end points of any annotation lines
          "annotateLineX1_Y1_X2_Y2":[
              [["1995",6],["1995",-3]],
              [["2013",6],["2013",-3]]
          ],
          //draws rectangles if required for annotations (set to true or false)
          "annotateRect" : false,
          //define start and end points of rectangles
          "annotateRectX_Y" : [
              [["1990", 6],["1993", -3]],
              [["1999", 6],["2001", -3]]
          ],
          //defines colour and opacity of rectangles
          "rectStyle" : [
              ["#888", 0.2],
              ["red", 0.2]
          ],
          //draws a line with a heavier stroke, used if the x axis is dropped or the data has negative and positive values
          "centre_line" : true,
          "centre_line_value" : 0
  }
}
