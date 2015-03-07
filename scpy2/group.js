// add button to make codecell read-only
"use strict";

var group_extension = (function() {

    var groupColors = ["#f5f5f5", "#efefff", "#efffef", "#ffefef"];
    
    var groupKey = {
        "Alt-0" : function(){setSelectedGroup(0);},
        "Alt-1" : function(){setSelectedGroup(1);},
        "Alt-2" : function(){setSelectedGroup(2);},
        "Alt-3" : function(){setSelectedGroup(3);},
    };
        
    var runGroupKey = {
        "Alt-0" : {help:"clear group", handler:function(){setSelectedGroup(0);}},
        "Alt-1" : {help:"add to group 1", handler:function(){setSelectedGroup(1);}},
        "Alt-2" : {help:"add to group 2", handler:function(){setSelectedGroup(2);}},
        "Alt-3" : {help:"add to group 3", handler:function(){setSelectedGroup(3);}},
        "Ctrl-Alt-1" : {help:"run group 1", handler:function(){IPython.notebook.execute_group(1);}}, 
        "Ctrl-Alt-2" : {help:"run group 2", handler:function(){IPython.notebook.execute_group(2);}},
        "Ctrl-Alt-3" : {help:"run group 3", handler:function(){IPython.notebook.execute_group(3);}},
    };
    
    IPython.notebook.keyboard_manager.command_shortcuts.add_shortcuts(runGroupKey);
    
    var collect = function() {
        var ret = {};
        var len = arguments.length;
        for (var i=0; i<len; i++) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p)) {
                    ret[p] = arguments[i][p];
                }
            }
        }
        return ret;
    };
    
    IPython.Notebook.prototype.execute_group = function (group_id) {
        var current_index = this.get_selected_index();
        this.command_mode();
        for (var i=0; i<this.ncells(); i++) {
            var cell = this.get_cell(i);
            if(cell.metadata.group_control.group == group_id){
                this.select(i);
                this.execute_cell();
            }
        }
        this.select(current_index);
    };    

    var setGroup = function (cell, group) {
        if (group == undefined) {
            group = 1;
        }
        if (cell.metadata.group_control == undefined) {
            cell.metadata.group_control = {};
        }
        cell.metadata.group_control.group = group;
        cell.group = group;
        var prompt = cell.element.find('div.input_area');
        prompt.css("background-color",groupColors[group]); 
    };
    
    function setSelectedGroup(group) {
        var cell = IPython.notebook.get_selected_cell();
        if ((cell instanceof IPython.CodeCell)) {
            if (cell.metadata.group_control == undefined){
                cell.metadata.group_control = {};    }
            setGroup(cell, group);
        }
    };
    

    function toggleGroup() {
        var cell = IPython.notebook.get_selected_cell();
        if ((cell instanceof IPython.CodeCell)) {
            if (cell.metadata.group_control == undefined){
                cell.metadata.group_control = {};    }
            setGroup(cell, (cell.metadata.group_control.group + 1) % 4);
        }
    };

    function assign_key(cell) {
        var keys = cell.code_mirror.getOption('extraKeys');
        cell.code_mirror.setOption('extraKeys', collect(keys, groupKey ));  
    }

    var create_cell = function (event,nbcell) {
        var cell = nbcell.cell;
        if ((cell instanceof IPython.CodeCell)) { assign_key(cell); }
    };

    IPython.toolbar.add_buttons_group([
                {
                    id : 'group_codecell',
                    label : 'Toggle group codecell',
                    icon : 'fa-flag',
                    callback : toggleGroup
                },
                
                {
                    id : 'run_group_1',
                    label : 'Run group 1',
                    icon : 'fa-play',
                    callback : function(){IPython.notebook.execute_group(1)}
                },
                
                {
                    id : 'run_group_2',
                    label : 'Run group 2',
                    icon : 'fa-play',
                    callback : function(){IPython.notebook.execute_group(2)}
                },
               
                {
                    id : 'run_group_3',
                    label : 'Run group 3',
                    icon : 'fa-play',
                    callback : function(){IPython.notebook.execute_group(3)}
                },
                
          ]);
          
    $("#run_group_1").css("background-color", groupColors[1]);
    $("#run_group_2").css("background-color", groupColors[2]);
    $("#run_group_3").css("background-color", groupColors[3]);
    
    /* loop through notebook and set read-only cells defined in metadata */
    var cells = IPython.notebook.get_cells();
    for(var i in cells){
        var cell = cells[i];
        if ((cell instanceof IPython.CodeCell)) {
            assign_key(cell);
            if (cell.metadata.group_control != undefined) {
                setGroup(cell, cell.metadata.group_control.group);
            } else { setGroup(cell, 0); }
        }
    };

    $([IPython.events]).on('create.Cell',create_cell);    
})();
