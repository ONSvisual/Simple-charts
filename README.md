# Instructions for creating a responsive line chart

The files for each chart should be of the following format:

![image1](https://user-images.githubusercontent.com/2945099/30038486-1e58ac22-91bd-11e7-8356-96fd6a65c33d.png)

The config file contains all the variables which you can adjust. Data.csv contains the data for your graph. The lib folder contains javascript libraries used. You'll also need the images folder.

If you’re making several charts they can share the same “lib” file as follows

![image2](https://user-images.githubusercontent.com/2945099/30038487-1e5cae94-91bd-11e7-9081-0ddaada98876.png)
![image3](https://user-images.githubusercontent.com/2945099/30038489-1e5d9f70-91bd-11e7-8ca6-8456a303b9da.png)
![image4](https://user-images.githubusercontent.com/2945099/30038488-1e5d650a-91bd-11e7-9746-3b1acf695c96.png)

## Data file
To make a responsive line chart save your data in csv form of the following format: 

| date | var1 | var 2 | var 3| 
| ------------- | ------------- | ------------- | ------------- |
| 2000 |   |   |   |
| 2001 |   |   |   |
| 2002 |  |   |   |
| 2003 |   |   |   |

It’s important to insure the date column is named exactly “date”, with a lower case d. 

## config.json

Open the “config.json” file.  You can open this in a text editor such as Notepad or TextEdit or download a code editor such as Dreamweaver, Brackets or Sublime Text 2.

### essentials
These contain the main variables which the chart will need and will possibly need changing for each new chart.
```
"graphic_data_url": "data.csv",
```
where data.csv is the name of the data file, must be in csv form

Specify the date format the data uses – see the [D3 wiki about time formatting](https://github.com/mbostock/d3/wiki/Time-Formatting). 

```"dateFormat":"%b-%y```

Legend label names, (if there is only one variable the legend will not appear)

```"legendLabels" : ["Legend label 2", "Legend label 1"],```

Specify the colours used

```"colour_palette": [ "#274796" , "green", "#E73F40", "#7BCAE2" ],```

Add text that will be used as a source, the data used with the date published and the specific table if there are multiple tables

```"sourceText":["Labour Market Statistics, February 2015, Table A02"],```

Link to source 

```"sourceURL":["http://www.ons.gov.uk/ons/publications/re-reference-tables.html?edition=tcm%3A77-350752"],```
        
Any annotations required for the medium and large (tablet and desktop) views of the chart, this text appears on the chart. If a new line is needed use a double space. Each annotation contains the X and Y values at which each annotation is to be positioned

```
"annotationChart": [
"xVal": "2003-06-23T00:00:00.000Z",
"yVal": 160,
"path": "",
"text": "T-bone hamburger swine pancetta kielbasa, ribeye boudin bresaola chicken. Flank andouille drumstick kielbasa biltong pancetta",
"textOffset": [0,0]
],
```
        
How each annotation text should be aligned. Choose from start,  middle or end

```
"annotationAlign":[
                "middle",
                "middle"
],
```

Any annotations required for the small (mobile) view of the chart, this text appears as bullet points beneath the chart, the text can be different from that of the chart annotations.

```
"annotationBullet": ["Claws in your leg",". Purr for no reason"],
```

      
Specify whether you’d like the data points at which the annotations occur highlighted. Choose from true or false

```
"circles" : true,    
"annotationCXCY":[
    ["Jan-93","68.4"],
    ["Jan-08","73"]
],
```


Specify the X and Y values of the data points to be highlighted 

```
"annotationCXCY":[
["Apr-93","68.4"],
["Apr-08","73"]
],
```
            

The y axis label appears at the top of the y-axis.

```
"yAxisLabel":"%",
```

Choose how the y axis is drawn, auto_min_max is the default – this chooses the minimum and maximum values of the y axis automatically. auto_zero_max sets the minimum y axis value to be zero and automatically chooses the maximum value.  To manually set the y axis values type the values in an array e.g. [60,80]. 

```
"yAxisScale":"auto_min_max",
```        


Where the y axis begins at a value other than zero the x axis and x axis labels are dropped. If the y axis starts at a value greater than zero an icon to symbolise a break in the y axis is enabled. 
The default is for the y axis break icon to be displayed, variable set to true if you wish to hide the icon set this variable to false

```
"yAxisBreak": true,
```

Specify the y value at which to icon is to be located. There are options for the three different screen sizes as sometimes the placement needs to be tweaked for each screen size.
```
"yAxisBreak_sm_md_lg": [65,65,65],
```


### optional

These variables are ones that may require slight adjustment for a new chart however will remain the same for the majority of charts.

The margins for the chart can be adjusted here. [top, right, bottom, left] there are options for each screen size, small (mobile), medium (tablet) and large (desktop). The margins should be as small as possible whilst still displaying the text as there are a second set of margins once it is iframed on visual.ons. Generally these should not require adjusting for line charts but will almost certainly need adjusting for bar charts.

```
"margin_sm": [20, 10, 35, 30],
"margin_md": [20, 10, 35, 30],
"margin_lg": [20, 10, 35, 30],
```


The aspect ratio of the chart can be set here. There are options for each screen size. Generally these should not require adjusting for line charts but will almost certainly need adjusting for bar charts.
        
```
"aspectRatio_sm" : [16,13],
"aspectRatio_md" : [16,12],
"aspectRatio_lg" : [16,10],
```

The point at which the chart changes from small (mobile) to medium (tablet) view is specified here. This should not normally require adjusting.        

```
"mobileBreakpoint" : 610, 
```

The date format for the x axis labels, specified for small (mobile), medium (tablet) and large (desktop) views  – see [D3 wiki page on time formatting](https://github.com/mbostock/d3/wiki/Time-Formatting) for options  
            
```
"xAxisTextFormat_sm_md_lg" : ["%y", "%Y", "%b %y"],
``` 
              
Specify a rough number of ticks to display on the x axis for small (mobile), medium (tablet) and large (desktop) views. NOTE: the d3 code which builds the chart uses the specified number as a suggestion only and may override this with what it determines to be the most clean and human-readable values

```
"x_num_ticks_sm_md_lg" : [7,17,17],
```
    
Specify a rough number of ticks to display on the y axis for small (mobile), medium (tablet) and large (desktop) views. NOTE: the d3 code which builds the chart uses the specified number as a suggestion only and may override this with what it determines to be the most clean and human-readable values

```
"y_num_ticks_sm_md_lg" : [6,8,10],
```

If you want lines drawn on to annotate something use ```vertical_line```. The array takes a start position [X1,Y1] followed by an end position [X2,Y2]. To add more lines, add in another array. 

```            
"vertical_line" : true,
"annotateLineX1_Y1_X2_Y2" : [ [["Jul-00", "200"],["Jul-00", "0"]], [["Jul-08", "100"],["Jul-08", "200"]] ],
```

If you want to drag a rectangle over something to highlight it use ```annotateRect```. The array takes a top left position of the rectangle [X1,Y1], followed by the position of the bottom right of the rectangle [X2,Y2]. For more than one rectangle, add in another array. 

```
"annotateRect" : true,
"annotateRectX_Y" : [ [["Jan-94", 200],["Jan-96", 0]], [["Jul-04", 180],["Jul-06", 40]] ],
"lineColor_opcty" : [["#ABCDEF", 0.2], ["#888", 0.4]],
```

If you want a thick line to emphasise something e.g. to highlight the base level of an index use ```centre_line```. The y value the centre line is drawn at can be specified here. Default is false. NOTE: If the y axis has negative values a centre line will automatically be drawn at 0 whether this variable is set to true or false.
```
"centre_line" : true,
"centre_line_value" : 25
```

Check final chart on as many browsers as possible (Firefox, IE, Chrome and Safari) and at the three window sizes. Also check on ipads, iphone and android phones (as owned in team).

Note: unless viewed via a webserver the chart will not be visible in any browser except Firefox because of security issues loading javascript libraries, therefore testing is best carried out on a mac. 

Once the chart is in its final state screenshot it and save the cropped image (approx. 645 × 490) with the file name fallback.png 



