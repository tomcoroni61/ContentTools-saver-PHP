
        //greate/small
var savePhp = '/../php/saver.php', savePartIP = '/192.168.56.1/';

(function() {
 

  window.onload = function() {
    if (window.location.href.indexOf(savePartIP)>0) executeIfFileExist(savePhp, InitEditor);  
    
  };

}).call(this);

function saveOk() {
  new ContentTools.FlashUI('ok');
  setTimeout(function(){
    location.reload();
}, 3000);
  
}


function InitEditor() {
 //alert("ready to edit");
 var el= document.getElementById('toggle');
 if (el!=null) {
   el.style.visibility = 'visible';

  setTimeout(function(){
    el.style.visibility = 'hidden';
  }, 2300);
 }

 var FIXTURE_TOOLS, IMAGE_FIXTURE_TOOLS, LINK_FIXTURE_TOOLS, editor;
 //ContentTools.IMAGE_UPLOADER = ImageUploader.createImageUploader;
 ContentTools.StylePalette.add([new ContentTools.Style('By-line', 'article__by-line', ['p']), 
 new ContentTools.Style('Caption', 'article__caption', ['p']),
  new ContentTools.Style('Example', 'example', ['pre']), new ContentTools.Style('Example + Good', 'example--good', ['pre']), 
  new ContentTools.Style('Example + Bad', 'example--bad', ['pre'])]);
 editor = ContentTools.EditorApp.get();
 editor.init('[data-editable], [data-fixture]', 'data-name');
 
 editor.addEventListener('saved', function(ev) {
   var saved, regions;
 
 // Check that something changed
 regions = ev.detail().regions;
  console.log(ev.detail().regions);
if (Object.keys(regions).length == 0) {
     return;
 }
editor.busy(true);

  saved = (function(_this) {
      return function() {
       editor.busy(false);
      // return 
     // new ContentTools.FlashUI('ok');
      return saveChanges(ev);
     };
   })(this);
   return setTimeout(saved, 2000);
 }); //eventlistener

 FIXTURE_TOOLS = [['undo', 'redo', 'remove']];
 IMAGE_FIXTURE_TOOLS = [['undo', 'redo', 'image']];
 LINK_FIXTURE_TOOLS = [['undo', 'redo', 'link']];
 return ContentEdit.Root.get().bind('focus', function(element) {
   var tools;
   if (element.isFixed()) {
     if (element.type() === 'ImageFixture') {
       tools = IMAGE_FIXTURE_TOOLS;
     } else if (element.tagName() === 'a') {
       tools = LINK_FIXTURE_TOOLS;
     } else {
       tools = FIXTURE_TOOLS;
     }
   } else {
     tools = ContentTools.DEFAULT_TOOLS;
   }
   if (editor.toolbox().tools() !== tools) {
     return editor.toolbox().tools(tools);
   }
 });

}


//Man könnte auch die Daten über die Zwischenablage und Windowsprogram bearbeiten, speichern.
function executeIfFileExist(src, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(ev) {

    if (ev.target.readyState == 4) {
      if (ev.target.status == '200') {
         // alert("oki2  2");
         callback();
      } else {
          alert(src+'\n not found')
        }
  }


      if (this.readyState === this.DONE) {
         // callback();
      }
  }
  //var data = {element: "Are you here?"};
  //var data = 'orem=ipsum&name=binny'; //'user=person&pwd=password&organization=place&requiredkey=key'
  xhr.open('POST', src, true);
  var foData = new FormData();
foData.append('isalive','Frage');
  xhr.send(foData);
  //alert("hello");
}



function saveChanges(ev) {
  const XHR = new XMLHttpRequest();
  var  name, editor, ChangeCnt=0, formData = new FormData(); //window.location.pathname href

  regions = ev.detail().regions; //window.url
  editor = ContentTools.EditorApp.get();
  formData.append('__page__', window.location.pathname);
 //payload.append("myfile", myBlob, "filename.txt");
 for (name in regions) {
     if (regions.hasOwnProperty(name)) {
      formData.append(name, regions[name]); //console.log(ev.detail().regions);
      console.log(name, regions[name]);
      ChangeCnt++;
     }
 }

 formData.append('__ChangeCount__', ChangeCnt); 

 // Define what happens on successful data submission
 XHR.addEventListener( 'load', function( event ) {
  if (event.target.status == '200') {
    // new ContentTools.FlashUI('ok'); alert("Oki 1");
    console.log( 'Yeah! Data sent and response loaded.' );
  } else { alert('onload Error: '+event.target.status);
   new ContentTools.FlashUI('no'); }
} );

onStateChange = function(ev) {
  // Check if the request is finished
  if (ev.target.readyState == 4) {
      editor.busy(false);
      if (ev.target.status == '200') {
         // alert("oki2  2");
         saveOk();
          return true; // new ContentTools.FlashUI('ok');
      } else {
          // Save failed, notify the user with a flash
          new ContentTools.FlashUI('no');
          console.log("PHP Error: "+ev.target.status);
          alert('onStateChange Error: '+ ev.target.status+ "\nsee saverlog.txt in php dir");
          return false;
      }
  }
};

//xhr = new XMLHttpRequest();
XHR.addEventListener('readystatechange', onStateChange);


// Set up our request
XHR.open( 'POST', savePhp , true );

// Send our FormData object; HTTP headers are set automatically
XHR.send( formData );



}


/* 
function saveDoc(ev) {
 var name, payload, xhr, editor, passive;

   regions = ev.detail().regions;
   editor = ContentTools.EditorApp.get();
   passive = false; 
    //	alert("save doc to file " + window.location.pathname);
// Collect the contents of each region into a FormData instance
    payload = new FormData(); //window.location.pathname
    payload.append('__page__', window.location.pathname);
    //payload.append("myfile", myBlob, "filename.txt");
    for (name in regions) {
        if (regions.hasOwnProperty(name)) {
            payload.append(name, regions[name]);
			 console.log(name, regions[name]);

        }
    }
  
  // Send the update content to the server to be saved
	
}	 */