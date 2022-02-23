import re, jinja2,json


rme = open('../README.md').readlines()
items = re.findall('\|(.+?)\s*\|\s*\[View\]\((.+?)\)\s*\|\s*\[`</>`\]\((.+?)\)', ''.join(rme))


sort = {}
for id,i in enumerate(items):
    categories = i[0].strip().split(' - ')
    if categories[0] not in sort:
        sort[categories[0]] = [dict(name = categories[-1], url = i[1], code = i[2],id=id)]
    else :
        sort[categories[0]].append(dict(name = categories[-1], url = i[1], code = i[2], id=id))


# optional nested list of all the plots 
with open('allplots.json','w') as f:
    f.write(json.dumps(sort, indent = 3)) 



template = '''
<!DOCTYPE html>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200&display=swap" rel="stylesheet">

<style>
h1,h2,a {
    font-family: 'Nunito', sans-serif;
}
iframe{width:100%;height:600px;overflow:hidden;scrolling:no;border:none;} 
a{ text-align: center;margin:auto;text-decoration: none;}
</style>

{% for item in sort %}
<h1>{{item}}</h1>
{% for subitem in sort[item] %}



    <a href="{{subitem.code}}">
        <h2> {{subitem.name.title()}} </h2>
        <iframe id = 'iframe-{{subitem.id}}' src="{{subitem.url}}" frameborder="0" onload='AdjustIframeHeightOnLoad("iframe-{{subitem.id}}")'></iframe>
    </a>


{% endfor %}
{% endfor %}

<div style="border:2px solid #666; border-radius:11px; padding:20px;">


<script type="text/javascript">
[...document.querySelectorAll('iframe')].forEach(function(iframe) {iframe.contentWindow.console.log = ()=>{};});


function AdjustIframeHeightOnLoad(id) { 

    var iframe = document.getElementById(id);
    console.warn('----',id,iframe);

    iframe.contentWindow.console.log = ()=>{};
    
    iframe.style.height = iframe.contentWindow.document.body.scrollHeight + "px"; }

</script>



'''


jinja2.Template(template).stream(sort = sort).dump('index.html')


import os
os.system('open index.html')