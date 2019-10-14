/*****
* Search 
*/
'use strict';


function getLotByTAG(){
  var taginfo = $('#tag').val();
      // jQuery AJAX call for JSON
      $.getJSON( '/lots/search/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          if (data){
            $.each(data, function(){
              $('#lotno').val(this.id)
              $('#lotnm').val(this.lotno)
              $('#blockchain').val(this.blockchain.encryptedData)            
            })
          }else{
            $('#lotno').val("")
            $('#lotnm').val("No data found")
            $('#blockchain').val("") 
          }
  
      })
}

function getSOByTAG(){
  var taginfo = $('#tag').val();
      // jQuery AJAX call for JSON
      $.getJSON('/processing/batch/shipping/search/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          // alert('Data Console:' + JSON.stringify(data))
          if (data){
            $.each(data, function(){              
              $('#sono').val(this.id)
              $('#sonm').val(this.so)
              $('#blockchain').val(this.blockchain.encryptedData)            
            })
          }else{
            $('#sono').val("")
            $('#sonm').val("No data found")
            $('#blockchain').val("") 
          }
  
      })
}


function getLotByTAGOF(){
  var taginfo = $('#tag').val();
      // jQuery AJAX call for JSON
    if(taginfo) {  
      $.getJSON( '/lots/search/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          if (data){
            $.each(data, function(){ 
              console.log('Data ID = :' + this.id)
              $('#lotid').val(this.id)
              $('#lotnm').val(this.lotno)              
              $('#product').val(this.product) 
              var pdesc = this.product
              $('#description').val(pdesc)            
              $('#tank').val(this.tank)  
            })
          }else{
            $('#lotid').val("")
            $('#lotnm').val("No data found")
            $('#product').val("") 
            $('#description').val("") 
            $('#tank').val("") 
          }
  
      })
    }else{
      $('#tag').val("Please, insert a valid value to search.")
    }
}

function getPositionsByTAG(){
  var taginfo = $('#tag').val();
      // jQuery AJAX call for JSON
      if(taginfo) {
        $.getJSON( '/lots/search/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          if (data){
            $.each(data, function(){
              var lotid =this.id
              $.getJSON( '/processing/tracking/show/' + lotid , function( xys ) {
                if (xys){
                  var tlat= 0
                  var tlng= 0
                  $.each(xys, function(){
                    // console.log('xys=>'+ JSON.stringify(xys[0]))
                      
                        tlat= xys[0].lat
                        tlng= xys[0].lng
                      
                  })
                  // console.log('tlat='+ tlat + ' tlng='+tlng);

                  var centerpos = new google.maps.LatLng(tlat, tlng);

                  var map = new google.maps.Map(document.getElementById('map'), {
                    center: centerpos,
                    zoom: 14
                  });

                  var routePath = new google.maps.Polyline({
                    path: xys,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                  });

                  routePath.setMap(map);
                }else{
                  $('#tag').val("No tracking info. for this Lot.")
                }
              })                        
            })
          }else{
            $('#tag').val("Lot not found") 
          }
  
      })
    }else{
      $('#tag').val("Please, insert a valid value to search.")
    }
      
}

function getPositionsBySO(){
  var taginfo = $('#tag').val();
      // jQuery AJAX call for JSON
      if(taginfo) {
        $.getJSON( '/processing/batch/shipping/search/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          if (data){
            $.each(data, function(){
              var lotid =this.id
              $.getJSON( '/processing/tracking/show/' + lotid , function( xys ) {
                if (xys){
                  var tlat= 0
                  var tlng= 0
                  $.each(xys, function(){
                    // console.log('xys=>'+ JSON.stringify(xys[0]))
                      
                        tlat= xys[0].lat
                        tlng= xys[0].lng
                      
                  })
                  // console.log('tlat='+ tlat + ' tlng='+tlng);

                  var centerpos = new google.maps.LatLng(tlat, tlng);

                  var map = new google.maps.Map(document.getElementById('map'), {
                    center: centerpos,
                    zoom: 14
                  });

                  var routePath = new google.maps.Polyline({
                    path: xys,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                  });

                  routePath.setMap(map);
                }else{
                  $('#tag').val("No tracking info. for this Sales Order.")
                }
              })                        
            })
          }else{
            $('#tag').val("Sales Order not found") 
          }
  
      })
    }else{
      $('#tag').val("Please, insert a valid value to search.")
    }
      
}

function getLotByTAGINV(){
  var taginfo = $('#tag').val();
      // jQuery AJAX call for JSON
    if(taginfo) {  
      $.getJSON( '/lots/stock/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          if (data){
            $.each(data, function(){ 
              $('#lotid').val(this.id)
              $('#lotnm').val(this.lotno)              
              $('#productone').val(this.product) 
              $('#qty').val(this.qty)  
            })
          }else{
            $('#lotid').val("")
            $('#lotnm').val("")              
            $('#productone').val("No Lot found") 
            $('#qty').val("0")  
          }
  
      })
    }else{
      $('#tag').val("Please, insert a valid value to search.")
    }
}

function setSerialList(){
    var serialNo = $('#serialone').val();    
    var o = new Option(serialNo, serialNo);
    o.selected=true;
    $('#seriallist').append(o);
    $('#serialone').val('');
}

function usetSerialList(){

  var serialno = $("#seriallist option:selected").text();
  if (!serialno) {
    $("#seriallist option:selected").remove();
  }
   
}

function setLotList(){
  var lotNo = $('#productone').val() +' - ' +$('#qty').val()    
  var o = new Option(lotNo, lotNo)
  o.selected=true
  $('#lotlist').append(o)
  $('#productone').val('')
  $('#qty').val('0')
}

function usetSerialList(){

var lotno = $("#lotlist option:selected").text();
if (!lotno) {
  $("#lotlist option:selected").remove();
}
 
}

function getSOByQR(){
  // let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  // scanner.addListener('scan', function (content) {
  //   console.log(content);
  // });
  // Instascan.Camera.getCameras().then(function (cameras) {
  //   if (cameras.length > 0) {
  //     scanner.start(cameras[0]);
      var taginfo = $('#reader').val();
      // jQuery AJAX call for JSON
      $.getJSON('/processing/batch/shipping/search/' + taginfo , function( data ) {
          // For each item in our JSON, add a table row and cells to the content string
          // alert('Data Console:' + JSON.stringify(data))
          if (data){
            $.each(data, function(){              
              $('#sono').val(this.id)
              $('#sonm').val(this.so)           
            })
          }else{
            $('#sono').val("")
            $('#sonm').val("No data found")
          }
      })
  //   } else {
  //     console.error('No cameras found.');
  //   }
  // }).catch(function (e) {
  //   console.error(e);
  // });

    
    

     
}