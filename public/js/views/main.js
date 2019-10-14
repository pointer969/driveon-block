$(function(){
  'use strict';

  //convert Hex to RGBA
  function convertHex(hex,opacity){
    hex = hex.replace('#','');
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);

    var result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
   }
   
  
  //Random Numbers
  function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
   }

  // var elements = 16;
  // var labels = [];
  // var data = [];

  // for (var i = 2000; i <= 2000 + elements; i++) {
  //   labels.push(i);
  //   data.push(random(40,100));
  // }

  

  //Main Chart
  // var elements = 27;
  // var data1 = [];
  // var data2 = [];
  // var data3 = [];

  // for (var i = 0; i <= elements; i++) {
  //   data1.push(random(50,200));
  //   data2.push(random(80,100));
  //   data3.push(65);
  // }

  // var data = {
  //   labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
  //   datasets: [
  //     {
  //       label: 'My First dataset',
  //       backgroundColor: convertHex($.brandInfo,10),
  //       borderColor: $.brandInfo,
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 2,
  //       data: data1
  //     },
  //     {
  //       label: 'My Second dataset',
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandSuccess,
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 2,
  //       data: data2
  //     },
  //     {
  //       label: 'My Third dataset',
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandDanger,
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 1,
  //       borderDash: [8, 5],
  //       data: data3
  //     }
  //   ]
  // };

  // var options = {
  //   maintainAspectRatio: false,
  //   legend: {
  //     display: false
  //   },
  //   scales: {
  //     xAxes: [{
  //       gridLines: {
  //         drawOnChartArea: false,
  //       }
  //     }],
  //     yAxes: [{
  //       ticks: {
  //         beginAtZero: true,
  //         maxTicksLimit: 5,
  //         stepSize: Math.ceil(250 / 5),
  //         max: 250
  //       }
  //     }]
  //   },
  //   elements: {
  //     point: {
  //       radius: 0,
  //       hitRadius: 10,
  //       hoverRadius: 4,
  //       hoverBorderWidth: 3,
  //     }
  //   },
  // };
  // var ctx = $('#main-chart');
  // var mainChart = new Chart(ctx, {
  //   type: 'line',
  //   data: data,
  //   options: options
  // });


  //Social Box Charts
  // var labels = ['January','February','March','April','May','June','July'];

  // var options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   legend: {
  //     display: false,
  //   },
  //   scales: {
  //     xAxes: [{
  //       display:false,
  //     }],
  //     yAxes: [{
  //       display:false,
  //     }]
  //   },
  //   elements: {
  //     point: {
  //       radius: 0,
  //       hitRadius: 10,
  //       hoverRadius: 4,
  //       hoverBorderWidth: 3,
  //     }
  //   }
  // };

  // var data1 = {
  //   labels: labels,
  //   datasets: [{
  //     backgroundColor: 'rgba(255,255,255,.1)',
  //     borderColor: 'rgba(255,255,255,.55)',
  //     pointHoverBackgroundColor: '#fff',
  //     borderWidth: 2,
  //     data: [65, 59, 84, 84, 51, 55, 40]
  //   }]
  // };
  // var ctx = $('#social-box-chart-1');
  // var socialBoxChart1 = new Chart(ctx, {
  //   type: 'line',
  //   data: data1,
  //   options: options
  // });

  // var data2 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'rgba(255,255,255,.1)',
  //       borderColor: 'rgba(255,255,255,.55)',
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 2,
  //       data: [1, 13, 9, 17, 34, 41, 38]
  //     }
  //   ]
  // };
  // var ctx = $('#social-box-chart-2').get(0).getContext('2d');
  // var socialBoxChart2 = new Chart(ctx, {
  //   type: 'line',
  //   data: data2,
  //   options: options
  // });

  // var data3 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'rgba(255,255,255,.1)',
  //       borderColor: 'rgba(255,255,255,.55)',
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 2,
  //       data: [78, 81, 80, 45, 34, 12, 40]
  //     }
  //   ]
  // };
  // var ctx = $('#social-box-chart-3').get(0).getContext('2d');
  // var socialBoxChart3 = new Chart(ctx, {
  //   type: 'line',
  //   data: data3,
  //   options: options
  // });

  // var data4 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'rgba(255,255,255,.1)',
  //       borderColor: 'rgba(255,255,255,.55)',
  //       pointHoverBackgroundColor: '#fff',
  //       borderWidth: 2,
  //       data: [35, 23, 56, 22, 97, 23, 64]
  //     }
  //   ]
  // };
  // var ctx = $('#social-box-chart-4').get(0).getContext('2d');
  // var socialBoxChart4 = new Chart(ctx, {
  //   type: 'line',
  //   data: data4,
  //   options: options
  // });



  //Sparkline Charts
  // var labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  // var options = {
  //   legend: {
  //     display: false,
  //   },
  //   scales: {
  //     xAxes: [{
  //       display:false,
  //     }],
  //     yAxes: [{
  //       display:false,
  //     }]
  //   },
  //   elements: {
  //     point: {
  //       radius: 0,
  //       hitRadius: 10,
  //       hoverRadius: 4,
  //       hoverBorderWidth: 3,
  //     }
  //   },
  // };

  // var data1 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandPrimary,
  //       borderWidth: 2,
  //       data: [35, 23, 56, 22, 97, 23, 64]
  //     }
  //   ]
  // };
  // var ctx = $('#sparkline-chart-1');
  // var sparklineChart1 = new Chart(ctx, {
  //   type: 'line',
  //   data: data1,
  //   options: options
  // });

  // var data2 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandDanger,
  //       borderWidth: 2,
  //       data: [78, 81, 80, 45, 34, 12, 40]
  //     }
  //   ]
  // };
  // var ctx = $('#sparkline-chart-2');
  // var sparklineChart2 = new Chart(ctx, {
  //   type: 'line',
  //   data: data2,
  //   options: options
  // });

  // var data3 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandWarning,
  //       borderWidth: 2,
  //       data: [35, 23, 56, 22, 97, 23, 64]
  //     }
  //   ]
  // };
  // var ctx = $('#sparkline-chart-3');
  // var sparklineChart3 = new Chart(ctx, {
  //   type: 'line',
  //   data: data3,
  //   options: options
  // });

  // var data4 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandSuccess,
  //       borderWidth: 2,
  //       data: [78, 81, 80, 45, 34, 12, 40]
  //     }
  //   ]
  // };
  // var ctx = $('#sparkline-chart-4');
  // var sparklineChart4 = new Chart(ctx, {
  //   type: 'line',
  //   data: data4,
  //   options: options
  // });

  // var data5 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'transparent',
  //       borderColor: '#d1d4d7',
  //       borderWidth: 2,
  //       data: [35, 23, 56, 22, 97, 23, 64]
  //     }
  //   ]
  // };
  // var ctx = $('#sparkline-chart-5');
  // var sparklineChart5 = new Chart(ctx, {
  //   type: 'line',
  //   data: data5,
  //   options: options
  // });

  // var data6 = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       backgroundColor: 'transparent',
  //       borderColor: $.brandInfo,
  //       borderWidth: 2,
  //       data: [78, 81, 80, 45, 34, 12, 40]
  //     }
  //   ]
  // };
  // var ctx = $('#sparkline-chart-6');
  // var sparklineChart6= new Chart(ctx, {
  //   type: 'line',
  //   data: data6,
  //   options: options
  // });

  // Action for TOP Index
  // 1.Top Mileage 
  getTotMileage();
  getChartMileage();

  // 2. Idle Time
  getTotIdleTime();
  getChartIdleTime();

  // 3. Harsh Accelation
  getCntHAccOccur();
  getChartHAccOccur();
  
  // 4.Harsh Brake
  getCntHBrakeOccur();
  getChartHBrakeOccur();
  

  // Action for ACC Index
  // 1.Connected Dongles
  getConnected();
  // 2.Disconnected Dongles
  getDisconnected(); 
  // 3.SOS Alarms
  getSOS();
  // 4.Rebocados
  getReb(); 
  // 5. SUM Gas
  getGAS();  
  // 6.MIL Alarm
  getMIL(); 
});


// Fill table with data
function getTotMileage() {
  
      // Empty content string
      var tableContent = '0 Km';  

      $.ajax
      ({
        type: "post",
        url: "/cntMileageMonth",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  
        retrnCnt = data.sumcurrentTripMileage + ' Km';
        $('#SumCurMileage').html(retrnCnt);    
      });

  };

function getChartMileage() {
      $.ajax
      ({
        type: "post",
        url: "/chartMileageMonth",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {            
        fn_chart01_load(data)   
      });  
 };

function fn_chart01_load(data){
   var lbl = []      
   var dts = []
   $.each(data, function(index, value) {      //Cards with Charts
      var rawDrecv = value.dreceived
      var cumTot   = value.TotDeslocamento

      rawDrecv =  rawDrecv.toString().substr(6,2) + '/' + rawDrecv.toString().substr(4,2)  

      lbl.push(rawDrecv);
      dts.push(cumTot);
   });
  
  // var labels = lbl;  
  var data = {
    labels: labels,
    datasets: [
      {
        label: 'Distância Percorrida',
        backgroundColor: $.brandPrimary,
        borderColor: 'rgba(255,255,255,.55)',
        data: dts
      },
    ]
  };
  var options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            color: 'transparent',
            zeroLineColor: 'transparent'
          },
          ticks: {
            fontSize: 2,
            fontColor: 'transparent',
          }

        }],
        yAxes: [{
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, data.datasets[0].data) - 5,
            max: Math.max.apply(Math, data.datasets[0].data) + 5,
          }
        }],
      },
      elements: {
        line: {
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4,
        },
      }
    };
    var ctx = $('#card-chart1');
    var cardChart1 = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options
    });
   
    
 }


  // Fill table with data
function getTotIdleTime() {
  
      // Empty content string
      var tableContent = '0 Minutos';  
      
      $.ajax
      ({
        type: "post",
        url: "/cntIdleTime",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  
        retrnCnt = data.sumIdleTime + ' Minutos';
        $('#SumIdleEngine').html(retrnCnt);    
      });

 };  

function getChartIdleTime(){
  $.ajax
  ({
    type: "post",
    url: "/chartIdleTime",
    dataType: "json",
    crossDomain: "false",
    contentType: "application/json; charset=UTF-8"                                                             
  }).done(function ( data ) {            
    fn_chart02_load(data)   
  });  
 }

function fn_chart02_load(data){
  var lbl = []      
  var dts = []
  $.each(data, function(index, value) {      //Cards with Charts
     var rawDrecv = value.Data
     var cumTot   = value.Min

     rawDrecv =  rawDrecv.toString().substr(6,2) + '/' + rawDrecv.toString().substr(4,2)  

     lbl.push(rawDrecv);
     dts.push(cumTot);
  
  });

  var data = {
    labels: lbl,
    datasets: [
      {
        label: 'Motor Ocioso',
        backgroundColor: $.brandInfo,
        borderColor: 'rgba(255,255,255,.55)',
        data: dts
      },
    ]
  };
  var options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, data.datasets[0].data) - 5,
          max: Math.max.apply(Math, data.datasets[0].data) + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    }
  };
  var ctx = $('#card-chart2');
  var cardChart2 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
 }


function getCntHAccOccur() {
    // Empty content string
    var tableContent = '0 Ocorrências';  
    
    $.ajax
    ({
      type: "post",
      url: "/cntHACCOccur",
      dataType: "json",
      crossDomain: "false",
      contentType: "application/json; charset=UTF-8"                                                             
    }).done(function ( data ) {  

      retrnCnt = data.cntHACCOccur + ' Ocorrências';
      $('#SumHACCOccur').html(retrnCnt);    
    });

 };

function getChartHAccOccur(){
  $.ajax
  ({
    type: "post",
    url: "/chartHACCOccur",
    dataType: "json",
    crossDomain: "false",
    contentType: "application/json; charset=UTF-8"                                                             
  }).done(function ( data ) {           
    fn_chart03_load(data)   
  });  
 };

function fn_chart03_load(data){
  var lbl = []      
  var dts = []
  $.each(data, function(index, value) {      //Cards with Charts
     var rawDrecv = value.Data
     var cumTot   = value.Min

     rawDrecv =  rawDrecv.toString().substr(6,2) + '/' + rawDrecv.toString().substr(4,2)  

     lbl.push(rawDrecv);
     dts.push(cumTot);  
  });

  var options = {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }],
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    }
  };
  var data = {
    labels: lbl,
    datasets: [
      {
        label: 'Altas Acelerações',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: dts
      },
    ]
  };
  var ctx = $('#card-chart3');
  var cardChart3 = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });
 }

function getCntHBrakeOccur() {  
      // Empty content string
      var tableContent = '0 Ocorrências';  
      
      $.ajax
      ({
        type: "post",
        url: "/cntHBRAKEOccur",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  

        retrnCnt = data.cntHBRAKEOccur + ' Ocorrências';
        $('#SumHBRAKEOccur').html(retrnCnt);    
      });

  };

function getChartHBrakeOccur(){
    $.ajax
    ({
      type: "post",
      url: "/chartHBRAKEOccur",
      dataType: "json",
      crossDomain: "false",
      contentType: "application/json; charset=UTF-8"                                                             
    }).done(function ( data ) {          
      fn_chart04_load(data)   
    });  
   };

function fn_chart04_load(data){
  var lbl = []      
  var dts = []
  $.each(data, function(index, value) {      //Cards with Charts
     var rawDrecv = value.Data
     var cumTot   = value.Min

     rawDrecv =  rawDrecv.toString().substr(6,2) + '/' + rawDrecv.toString().substr(4,2)  

     lbl.push(rawDrecv);
     dts.push(cumTot);  
  });

  var options = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false,
          barPercentage: 0.6,
        }],
        yAxes: [{
          display: false,
        }]
      },

    };
    var data = {
      labels: lbl,
      datasets: [
        {
          backgroundColor: 'rgba(255,255,255,.3)',
          borderColor: 'transparent',
          data: dts
        },
      ]
    };
    var ctx = $('#card-chart4');
    var cardChart4 = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });
 }

function getConnected() {
  
      // Empty content string
      var tableContent = '0 ';  

      $.ajax
      ({
        type: "post",
        url: "/cntDevConnected",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  
        // console.log('cntDevConnected:'+ JSON.stringify(data))
        retrnCnt = data.total;
        $('#VehicleON').html(retrnCnt);    
      });

  }; 


function getDisconnected() {
  
      // Empty content string
      var tableContent = '0 ';  

      $.ajax
      ({
        type: "post",
        url: "/cntDevDisconnected",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  
        // console.log('cntDevConnected:'+ JSON.stringify(data))
        retrnCnt = data.total;
        $('#VehicleOFF').html(retrnCnt);    
      });

  };  

function getSOS() {
    
        // Empty content string
        var tableContent = '0 ';  
  
        $.ajax
        ({
          type: "post",
          url: "/cntSOS",
          dataType: "json",
          crossDomain: "false",
          contentType: "application/json; charset=UTF-8"                                                             
        }).done(function ( data ) {  
          // console.log('cntDevConnected:'+ JSON.stringify(data))
          retrnCnt = data.total;
          $('#SOScnt').html(retrnCnt);    
        });
  
    };   

function getReb() {
      
          // Empty content string
          var tableContent = '0 ';  
    
          $.ajax
          ({
            type: "post",
            url: "/cntReb",
            dataType: "json",
            crossDomain: "false",
            contentType: "application/json; charset=UTF-8"                                                             
          }).done(function ( data ) {  
            // console.log('cntDevConnected:'+ JSON.stringify(data))
            retrnCnt = data.total;
            $('#Rebcnt').html(retrnCnt);    
          });
    
      }; 

function getMIL() {
      // Empty content string
      var tableContent = '0 ';  

      $.ajax
      ({
        type: "post",
        url: "/cntMIL",
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  
        // console.log('cntDevConnected:'+ JSON.stringify(data))
        retrnCnt = data.total;
        $('#MILcnt').html(retrnCnt);    
      });

  }; 

function getGAS() {
  // Empty content string
  var tableContent = '0 ';  

  $.ajax
  ({
    type: "post",
    url: "/sumGAS/33574e2d3136303130303535",
    dataType: "json",
    crossDomain: "false",
    contentType: "application/json; charset=UTF-8"                                                             
  }).done(function ( data ) {  
    console.log('cntDevConnected:'+ JSON.stringify(data))
    retrnCnt = parseInt(data.total) * 0.1;
    $('#SumFuel').html(retrnCnt);    
  });

  // $.ajax
  // ({
  //   type: "post",
  //   url: "/stub",
  //   dataType: "json",
  //   crossDomain: "false",
  //   contentType: "application/json; charset=UTF-8"                                                             
  // }).done(function ( data ) {  
  //   console.log('Stub:'+ JSON.stringify(data))      
  // });


};   