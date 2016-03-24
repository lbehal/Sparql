// ==UserScript==
// @name         SPARQL
// @namespace    lbsprql
// @version      0.1
// @description  Enhances http://publications.europa.eu/webapi/rdf/sparql with CODEMIRROR (http://codemirror.net/2/)
// @author       Ladislav Behal
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @require      https://raw.githubusercontent.com/codemirror/CodeMirror/master/lib/codemirror.js
// @require      https://raw.githubusercontent.com/lbehal/Sparql/master/codemirror-compressed.js
// @require      http://codemirror.net/2/lib/util/formatting.js
// @require      http://codemirror.net/2/lib/util/foldcode.js
// @match        http://publications.europa.eu/webapi/rdf/sparql
// @resource     codemirror_CSS https://raw.githubusercontent.com/codemirror/CodeMirror/master/lib/codemirror.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==
'use strict';
var cm_CssSrc = GM_getResourceText("codemirror_CSS");
GM_addStyle (cm_CssSrc);

$1 = this.jQuery = jQuery.noConflict(true);

var myTextArea = $1("#query");
var foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
var myCodeMirror = CodeMirror.fromTextArea(myTextArea.get(0),  { 
  //value: "prefix cdm: <http://publications.europa.eu/ontology/cdm#>\nselect * \nwhere\n {\n  ?s ?p ?o\n }\n",
  mode:  "sparql",
  lineNumbers: true,
  lineWrapping: true,
  viewportMargin: Infinity,
  onGutterClick: foldFunc,
  extraKeys: {"Ctrl-Q": function(cm){foldFunc(cm, cm.getCursor().line);}}
});
CodeMirror.commands["selectAll"](myCodeMirror);

$1('.CodeMirror').css("border","1px solid #eee");

var form = $1("#main > form > fieldset > label:nth-child(6)");
$1("#main > form > fieldset > label:nth-child(6)").append(" ");
var button = $1("<button type=\"button\">Reformat</button>");
button.click(function()
{
    var editor= $1('.CodeMirror')[0].CodeMirror;    
    
    var totalLines = editor.lineCount();
    var totalChars = editor.getTextArea().value.length;
    
    editor.autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});   
}
);
button.appendTo(form);
