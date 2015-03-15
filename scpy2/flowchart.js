(function(IPython){

    jQuery([IPython.events]).on('execute.CodeCell', function(notebook, evt){
        var cell = evt.cell;
        var index = evt.index;
        var firstline;
        var text;
        text = cell.get_text();
        firstline = text.substr(0, text.indexOf("\n"));
        text = text.substring(text.indexOf("\n") + 1);
        if(firstline != "%%flowchart") return;
        var dia = flowchart.parse(text);
        dia.drawSVG(cell.output_area.element[0]);
        var svg = cell.output_area.element.html();
        var output = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' + svg;
        var json = {
            output_type:"display_data", 
            data:{"image/svg+xml":output}, 
            metadata:{}};
        cell.output_area.element.html("");
        cell.output_area.append_output(json);
    });  

}(IPython));