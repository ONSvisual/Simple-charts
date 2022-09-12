var dvc = {
    "essential": {
        //data to use for chart
        "graphic_data_url": "data.csv",
        //chart colour
        "colour_palette": ["rgba(32, 96, 149, 0.7)"],
        "negative_colour": ["rgba(243, 148, 49, 0.7)"],
        "stroke_colour": ["#206095"],
        "negative_stroke": ["#a66521"],
        //x values are not loaded as dates but option to do so exists below
        //"dateFormat":"%Y",
        //Set alternative screenreader text if more detail than default is needed
        "screenreadertext": "",
        //Source
        "sourceText": ["Office for National Statistics"],
        //desktop annotations (double space for new line)
        "annotationChart": [
            "This is a double histogram"
        ],
        // mobile annotations
        "annotationBullet": [
            "This is a double histogram"
        ],
        //position of annotaions specified using x, y values
        "annotationXY": [
            ["210", "450000"]
        ],
        //annotation alignment (start, middle or end)
        "annotationAlign": [
            "middle"
        ],
        //legend labels
        "legendLabels": ["VAT", "PAYE"],
        //axis labels
        "yAxisLabel": "Y-label",
        "xAxisLabel": "X-label",
        //y axis scale ("auto_zero_max", "auto_min_max" or custom e.g. [-3,5])
        "yAxisScale": [0, 500000],
        //set y axis break to true if y axis dosen't start at 0 and doesn't contain negative values
        //this enables the x axis to be dropped
        //x axis scale
        "xAxisScale": [-100, 750],
        "yAxisBreak": false,
        //specifies position of "break" icon
        "yAxisBreak_sm_md_lg": [5, 5, 5]
    },
    "optional": {
        //specifies margins at different window sizes
        "margin_sm": [20, 10, 55, 55],
        "margin_md": [25, 10, 45, 55],
        "margin_lg": [25, 10, 45, 55],
        //specifies aspect ratio of chart at different window sizes
        "aspectRatio_sm": [16, 13],
        "aspectRatio_md": [16, 12],
        "aspectRatio_lg": [16, 10],
        //specifies smallest breakpoint (for mobile users)
        "mobileBreakpoint": 610,
        //specified the number of ticks required on the y axis at different window sizes
        "y_num_ticks_sm_md_lg": [5, 5, 5],
        //draws vertical_lines if required for annotations (set to true or false)
        "vertical_line": false,
        //define start and end points of any annotation lines
        "annotateLineX1_Y1_X2_Y2": [
        ],
        //draws rectangles if required for annotations (set to true or false)
        "annotateRect": false,
        //define start and end points of rectangles
        "annotateRectX_Y": [
            [["1990", 6], ["1993", -3]],
            [["1999", 6], ["2001", -3]]
        ],
        //defines colour and opacity of rectangles
        "rectStyle": [
        ],
        //draws a line with a heavier stroke, used if the x axis is dropped or the data has negative and positive values
        "centre_line": false,
        "centre_line_value": 0
    }
}
