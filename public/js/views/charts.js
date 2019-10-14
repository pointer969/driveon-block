$(function (){
  // 'use strict';
  var dongle = '3WN-16010056';
  var maininfo = getMotorTemperature(dongle);
   
  // 1.Bat Lvl
  var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
  var lineChartData = {
      labels : maininfo.dreceived,
      datasets : [
        {
          label: '3WN-16010054',
          backgroundColor : 'rgba(220,220,220,0.2)',
          borderColor : 'rgba(220,220,220,1)',
          pointBackgroundColor : 'rgba(220,220,220,1)',
          pointBorderColor : '#fff',
          data : maininfo.temperatura
        }
      ]
    }

  var ctx = document.getElementById('canvas-1');
  var chart = new Chart(ctx, {
    type: 'line',
    data: lineChartData,
    options: {
      responsive: true
    }
  });


  var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
  var barChartData = {
      labels : ['Nov 03 2017'],
      datasets : [
        {
          label: '3WN-16010054',
          backgroundColor : 'rgba(220,220,220,0.5)',
          borderColor : 'rgba(220,220,220,0.8)',
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data : [246.65]
        }
      ]
    }
  var ctx = document.getElementById('canvas-2');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: barChartData,
    options: {
      responsive: true
    }
  });


  var doughnutData = {
      labels: [
        'Freada Brusca',
        'Aceleração Brusca',
        'Curva Acentuada',
      ],
      datasets: [{
        data: [0, 0, 0],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };
  var ctx = document.getElementById('canvas-3').getContext("2d");;
  var chart = new Chart(ctx, {
      type: 'doughnut',
      data: doughnutData,
      options: {
        responsive: true
      }
    });


  var radarChartData = {
      labels: ['Freadas Bruscas', 'Alta Aceleração', 'Alta Velocidade'],
      datasets: [
        {
          label: '3WN-16010054',
          backgroundColor: 'rgba(220,220,220,0.2)',
          borderColor: 'rgba(220,220,220,1)',
          pointBackgroundColor: 'rgba(220,220,220,1)',
          pointBorderColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: [0,0,32.4]
        }
      ]
    };
  var ctx = document.getElementById('canvas-4');
  var chart = new Chart(ctx, {
      type: 'radar',
      data: radarChartData,
      options: {
        responsive: true
      }
    });


  var pieData = {
      labels: [
        'Red',
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [300, 50, 100],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ]
      }]
    };
  var ctx = document.getElementById('canvas-5');
  var chart = new Chart(ctx, {
      type: 'pie',
      data: pieData,
      options: {
        responsive: true
      }
    });


  var polarData = {
      datasets: [{
        data: [
            0
        ],
        backgroundColor: [
          '#FF6384'
        ],
        label: '3WN-16010054' // for legend
      }],
      labels: [
        'DTC'
      ]
    };
  var ctx = document.getElementById('canvas-6');
  var chart = new Chart(ctx, {
      type: 'polarArea',
      data: polarData,
      options: {
        responsive: true
      }
    });

    var lineChartData = {
      labels : ['Nov 03 2017'],
      datasets : [
        {
          label: '3WN-16010054',
          backgroundColor : 'rgba(120,220,220,0.2)',
          borderColor : 'rgba(220,250,120,1)',
          pointBackgroundColor : 'rgba(220,220,220,1)',
          pointBorderColor : '#fff',
          data : [0]
        }
      ]
    }
    
    // var ctx = document.getElementById('canvas-5');
    // var chart = new Chart(ctx, {
    //   type: 'line',
    //   data: lineChartData,
    //   options: {
    //     responsive: true
    //   }
    // });

}
);



// Fill table with data
function getMotorTemperature(dongle) {
  
      // Empty content string
      var tableContent = '0 Km';  

      $.ajax
      ({
        type: "post",
        url: "/getmotorTemp/"+dongle,
        dataType: "json",
        crossDomain: "false",
        contentType: "application/json; charset=UTF-8"                                                             
      }).done(function ( data ) {  
         return data;          
      });

  };