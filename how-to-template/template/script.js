var graphic = d3.select('#graphic');
var pymChild = null;

console.log('Running script.js!');
console.log('Heres the config '+JSON.stringify(dvc));

function drawGraphic() {
  console.log('Running drawGraphic');
  graphic.selectAll('*').remove();
}

//check whether browser can cope with svg
if (Modernizr.svg) {
  //load chart data
  console.log('get csv');
  d3.csv(dvc.essential.graphic_data_url, function(error, data) {

    graphic_data = data;
    console.log(graphic_data);
    // graphic_data.forEach(function(d) {
    //   d.date = d3.timeParse(dvc.essential.dateFormat)(d.date);
    // });

    //use pym to create iframed chart dependent on specified variables
    pymChild = new pym.Child({ renderCallback: drawGraphic});
  });


} else {
  //use pym to create iframe containing fallback image (which is set as default)
  pymChild = new pym.Child();
  if (pymChild) {
    pymChild.sendHeight();
  }
}
