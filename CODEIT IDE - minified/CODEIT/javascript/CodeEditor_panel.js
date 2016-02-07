function CodeEditor_panel(e,t){CodeEditor_panel.baseConstructor.call(this,e),this.appRef=t,this.panelView=this.htmlElement.getChildById("PANEL_VIEW"),this.tabBar=this.htmlElement.getChildById("TAB_BAR"),CreateEventListener(this.tabBar,"mousedown",this.onMouseDownOnTabBar,this),this.unselectedActivatorButtonClassName="unselectedTab",this.selectedActivatorButtonClassName="selectedTab",this.hideActivePanel=!1,this.serviceUrl=window.location,this.loadingState=this.htmlElement.getChildById("LOADING_toolButton");var o=this;CreateEventListener(HTML("SAVE_DOCUMENT_toolButton"),"mousedown",function(e){o.saveDocument(o.activePanel)})}ExtendClass(CodeEditor_panel,CODEIT_PanelManager),CodeEditor_panel.prototype.onMouseDownOnTabBar=function(e){if("LI"==e.target.parentElement.nodeName){var t=e.target.parentElement.panelRef;if("A"==e.target.nodeName)return void this.removeDocument(t);this.setActivePanel(t)}},CodeEditor_panel.prototype.showLoadingState=function(){this.loadingState.style.display="block"},CodeEditor_panel.prototype.hideLoadingState=function(){this.loadingState.style.display="none"},CodeEditor_panel.prototype.loadDocument=function(e){var t=this.getDocumentByPathFile(e);if(null!=t)return void this.setActivePanel(t);var o=PathInfo(e),a=o.fileName,i=o.fileExtension,n="text";switch(i){case"js":n="javascript";break;case"php":n="application/x-httpd-php";break;case"xml":case"dae":n={name:"xml",mode:"text/xml",alignCDATA:!0};break;case"html":case"htm":n={name:"htmlmixed",mode:"text/html",tabMode:"indent"};break;case"css":n={name:"css",mode:"text/css"};break;case"less":n={name:"less",mode:"text/css"};break;case"md":n={name:"md",mode:"text/css"};break;case"sql":n={name:"sql",mode:"text/css"}}var r=SendAndLoad(this.serviceUrl,{action:"getFile",filePath:e},Bind(this,this.onLoadDocument));r.codeMirrorHtmlDoc=this.addDocument(a,"loading…",n),r.codeMirrorHtmlDoc.CodeMirror.filePath=e,r.codeMirrorHtmlDoc.activatorButton.setAttribute("title",e),this.showLoadingState()},CodeEditor_panel.prototype.onLoadDocument=function(e){var t=e.target;this.hideLoadingState(),t.codeMirrorHtmlDoc.CodeMirror.setValue(t.responseText),this.setDocumentSavedState(t.codeMirrorHtmlDoc,!0)},CodeEditor_panel.prototype.getDocumentByPathFile=function(e){for(var t,o=this.panelView.childNodes.length,a=0;o>a;a++)if(t=this.panelView.childNodes[a],t.CodeMirror.filePath==e)return t;return null},CodeEditor_panel.prototype.getDocumentsInPath=function(e){for(var t,o=[],a=this.panelView.childNodes.length,i=0;a>i;i++)t=this.panelView.childNodes[i],0==t.CodeMirror.filePath.indexOf(e)&&o.push(t);return o},CodeEditor_panel.prototype.updateDocumentsPath=function(e,t){for(var o,a=this.panelView.childNodes.length,i=0;a>i;i++)o=this.panelView.childNodes[i],0==o.CodeMirror.filePath.indexOf(e)&&(o.CodeMirror.filePath=o.CodeMirror.filePath.replace(e,t),o.activatorButton.setAttribute("title",o.CodeMirror.filePath),o.activatorButton.getElementsByTagName("div")[0].innerHTML=PathInfo(o.CodeMirror.filePath).fileName)},CodeEditor_panel.prototype.addDocument=function(e,t,o){var a=CodeMirror(this.panelView,{mode:o,lineNumbers:!0,scrollbarStyle:"overlay",matchBrackets:!0,fixedGutter:!0,theme:"twilight"});console.log(a);var i=a.getWrapperElement();i.applyScrollingByTouch();var n=document.createElement("li");n.setAttribute("title",e),n.innerHTML="<a>&nbsp;</a><div>"+e+"</div>",this.tabBar.appendChild(n),this.addPanel(e,i,n),this.setActivePanel(i);var r=this;return a.setSize(null,this.htmlElement.offsetHeight-30),a.setValue(t),a.on("change",function(e,t){r.onDocumentChanged(i)}),i},CodeEditor_panel.prototype.onResize=function(e){for(var t,o=this.panelView.childNodes.length,a=0;o>a;a++)t=this.panelView.childNodes[a],t.CodeMirror.setSize(null,this.htmlElement.offsetHeight-30)},CodeEditor_panel.prototype.removeDocument=function(e){if(!e.CodeMirror.isSaved){var t=e.CodeMirror.filePath,o=confirm(STR["Want to save the changes made in the document:"]+t);if(o)return void this.saveDocument(e)}e.activatorButton.parentElement.removeChild(e.activatorButton),e.parentElement.removeChild(e)},CodeEditor_panel.prototype.onDocumentChanged=function(e){1==e.CodeMirror.isSaved&&this.setDocumentSavedState(e,!1)},CodeEditor_panel.prototype.setDocumentSavedState=function(e,t){1==t?(e.activatorButton.removeClass("unsavedDoc"),e.activatorButton.addClass("savedDoc")):(e.activatorButton.removeClass("savedDoc"),e.activatorButton.addClass("unsavedDoc")),e.CodeMirror.isSaved=t},CodeEditor_panel.prototype.saveDocument=function(e){var t=new XMLHttpRequest;t.open("POST",this.serviceUrl,!0),t.onload=Bind(this,this.onSaveDocument),t.codeMirrorHtmlDoc=e;var o=new FormData;o.append("action","saveFile"),o.append("filePath",e.CodeMirror.filePath),o.append("fileData",e.CodeMirror.getValue()),t.send(o),this.showLoadingState()},CodeEditor_panel.prototype.onSaveDocument=function(e){this.hideLoadingState();var t=DefaultResponseXML(e);1==t&&this.setDocumentSavedState(e.target.codeMirrorHtmlDoc,!0)};