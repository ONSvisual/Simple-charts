var dvc = {
  "essential": {
    "accessibleSummary":"This chart has been hidden from screen readers. The chart title summarises the chart and the data is available below",
    "graphic_data_url": "dummydata.csv",
    "xdata": "SPDflows", //this is the column for the x axis
    "ydata": "Censusflows", //this is the column from the y axis
    "sourceText": "My source information text here",
    "rectannotations": [
      //   {
      //   "x":0,
      //   "y":5000,
      //   "width":5000,
      //   "height":5000,
      //   "colour":"grey",
      //   "opacity":0.1
      // },
      // {
      //   "x":-8000,
      //   "y":0,
      //   "width":8000,
      //   "height":8000,
      //   "colour":"grey",
      //   "opacity":0.1
      // }
    ],
    "textAnnotations": [
      // {
      //   "x":1000,
      //   "y":4000,
      //   "text":"example annotation text"
      // },{
      //   "x":-7000,
      //   "y":-1000,
      //   "text":"example annotation text"
      //   }
    ],
    "textAnnotationWrap": 100,
    "d3AnnotationWrap": 300,
    "xAxisLabel": "X label",
    "yAxisLabel": "Y Label",
    "AxisScale": "auto_min_max",
    "xAxisScale": [-8000, 5000],
    "yAxisScale": [-8000, 5000]

  },
  "optional": {
    "margin": {
      "sm": {
        "top": 25,
        "right": 20,
        "bottom": 20,
        "left": 40
      },
      "md": {
        "top": 25,
        "right": 20,
        "bottom": 20,
        "left": 40
      },
      "lg": {
        "top": 25,
        "right": 20,
        "bottom": 20,
        "left": 40
      }
    },

    "aspectRatio": {
      "sm": [5, 6],
      "md": [15, 6],
      "lg": [15, 9]
    },

    "mobileBreakpoint": 410,
    "mediumBreakpoint": 600,

    "x_num_ticks": {
      "sm": 4,
      "md": 4,
      "lg": 5
    },
    "y_num_ticks": {
      "sm": 4,
      "md": 4,
      "lg": 5
    },

    "annotateLineX1_Y1_X2_Y2": [
      // [
      //   [-8000, -4000],
      //   [5000, 2000]
      // ],
      // [
      //   [-6000, 2000],
      //   [0, 0]
      // ]
    ],
    "lineColor_opcty": [
      ["#704C27", 1],
      ["#36ADD9", 0.5]
    ]


  }
};
