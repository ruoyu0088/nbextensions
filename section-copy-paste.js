
/*
 * IPython Notebook's Section Cut-Copy-Paste
 * Author: ruoyu0088@gmail.com
 
require(["nbextensions/section-copy-paste"], function (copy_paste) {
    console.log('copy_paste extension loaded');
    copy_paste.load_ipython_extension();
});

*/

define( function (){

    var show_copy_box = function(text) {
        var that = this;
        var title = "Copy";
        var info = 'Copy the JSON code in the following textarea the press ESC:'
        if(text == ""){
            title = "Paste";
            info = "Paste JSON code to the following textarea, then click OK button:"
        }
        
        var dialog = $('<div/>').append(
            $("<p/>").addClass("copy-dialogbox")
                .text(info)
        ).append(
            $("<br/>")
        ).append(
            $('<textarea/>').css('font-size','8px').attr('rows', '10').css('width', '90%').val(text)
        );
        var settings = {
            title: title,
            body: dialog,
            buttons : {
                "OK": {
                    class: "btn-primary",
                    click: function(){
                        var text = $(this).find("textarea").val();
                        var cells = JSON.parse(text);
                        paste_cells(cells);
                    }
                }},
           open: function(event, ui){
                console.log("opened");
                var that = $(this);
                that.find("textarea").focus().select();
           }
        };
        
        if(text != ""){
            delete settings.buttons["OK"];
        }
        IPython.dialog.modal(settings);
    };

    var copy_section = function(){
        var cells, cell, level, i;
        cell = IPython.notebook.get_selected_cell();
        if(cell.cell_type != "heading") return "";
        level = cell.level;
        cells = [];
        while(true){
            cells.push(cell.toJSON());
            cell = IPython.notebook.get_next_cell(cell);
            if(cell == null) break;
            if(cell.cell_type == "heading" && cell.level == level) break;
        }
        return JSON.stringify(cells);    
    };
    
    var paste_cells = function(cells){
        cells.forEach(function(cell) {
            var new_cell = IPython.notebook.insert_cell_below(cell.cell_type);
            new_cell.fromJSON(cell);
            new_cell.focus_cell();
        });    
    };
    
    
    var register_section_copy_paste_keys = function(){
        var copy_settings = {
            help    : 'copy section',
            help_index : '',
            handler : function (event) {
                var text = copy_section();
                if(text != "") show_copy_box(text);
                return true;
            }    
        };
        
        var paste_settings = {
            help    : 'paste cells',
            help_index : '',
            handler : function (event) {
                show_copy_box("");
                return true;
            }       
        };
        
        IPython.keyboard_manager.command_shortcuts.add_shortcut("space", copy_settings, true);
        IPython.keyboard_manager.command_shortcuts.add_shortcut("shift-space", paste_settings, true);    
    };
    
    var load_ipython_extension = function (){
         $([IPython.events]).on("notebook_loaded.Notebook", function () {
            register_section_copy_paste_keys();
         });
    };

    return {
        load_ipython_extension : load_ipython_extension,
    };

});