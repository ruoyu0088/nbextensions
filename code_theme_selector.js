/*
How to install:

download jquery.cookie.js and put it into nbextensions folder
put this file into nbextensions folder

add following code to custom.js:

$([IPython.events]).on('app_initialized.NotebookApp', function(){
    require(["nbextensions/code_theme_selector"]);
});
*/

define(["./jquery.cookie"], function (_){

    function change_cm_theme(theme)
    {
        IPython.CodeCell.options_default.cm_config.theme = theme;
        $("div.input .CodeMirror").removeClass().addClass("CodeMirror").addClass("cm-s-" + theme);
        $.cookie("ipython-code-theme", theme);
    };

    IPython.MainToolBar.prototype.add_themetoolbar_list = function () {
        var label = $('<span/>').addClass("navbar-text").text('Themes:');
        var select = $('<select/>').attr('id', 'theme_select');
        this.element.append(label).append(select);
        select.change(function() {
                change_cm_theme($(this).val());
        });
        

        var presets = [
                    "ipython",
                    "3024-day",
                    "3024-night",
                    "ambiance-mobile",
                    "ambiance",
                    "base16-dark",
                    "base16-light",
                    "blackboard",
                    "cobalt",
                    "eclipse",
                    "elegant",
                    "erlang-dark",
                    "lesser-dark",
                    "mbo",
                    "mdn-like",
                    "midnight",
                    "monokai",
                    "neat",
                    "night",
                    "paraiso-dark",
                    "paraiso-light",
                    "pastel-on-dark",
                    "rubyblue",
                    "solarized",
                    "the-matrix",
                    "tomorrow-night-eighties",
                    "twilight",
                    "vibrant-ink",
                    "xq-dark",
                    "xq-light"];
        for (var i=0; i<presets.length; i++) {
            var name = presets[i];
            select.append($('<option/>').attr('value', name).text(name));
            if(name != "ipython")
                $("head").append('<link rel="stylesheet" type="text/css" href="/static/components/codemirror/theme/' + name + '.css">');
        }
    };
     
    var add_selection = function(){
        IPython.toolbar.add_themetoolbar_list();
        var theme = $.cookie("ipython-code-theme");
        if(theme == null) theme = "ipython";
        $("#theme_select").val(theme);
        change_cm_theme(theme);          
    };
    
    return {add_selection:add_selection};
});