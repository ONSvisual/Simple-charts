dvc = {
  "essential": {
    "graphic_data_url": "data.csv",
    "dateFormat": "%d/%m/%Y",
    "legendLabels": ["UK regions", "UK", "Your selected region"],
    "colour_palette": ["#e7e7e7","#055477",'#D2376D'],
    "sourceText": "Adzuna",
    "yAxisLabel": "100 = average job adverts in February 2020",
    "yAxisScale": [0, 1.5]//can be auto_min_max, auto_zero_max or an array for the domain of the y-scale
  },

  "optional": {
    "mobileBreakpoint": 400, //breakpoint for mobile
    "mediumBreakpoint": 600, //breakpoint for medium
    "referenceline":{"display":true,"series":"reference", "colour":"#055477"},//display is true/false, if set to true the series is the column to use as the reference

    "margin": {
      "sm": {
        "top": 30,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
      "md": {
        "top": 30,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
      "lg": {
        "top": 30,
        "right": 40,
        "bottom": 26,
        "left": 40
      },
    },
    "aspectRatio": {
      "sm": [1, 1],
      "md": [2, 1],
      "lg": [2, 1]
    },

    "xAxisTextFormat": {
      "sm": "%b-%y",
      "md": "%b-%y",
      "lg": "%b-%y"
    },
    "x_ticks_every": {
      "sm": 30,
      "md": 30,
      "lg": 20
    },
    "y_num_ticks": {
      "sm": 3,
      "md": 3,
      "lg": 3
    },
  }
};
