$(function() {

    $.ajax({
      type: "GET",
      url: "/report/pivot/lot",
      dataType: "json",
      contentType: "application/json; charset=UTF-8" 
    }).done(function ( lotsdata ) {  
      if (lotsdata) {
        // console.log('lotsdata=>'+ JSON.stringify(lotsdata))

        $("#output").pivot(
          lotsdata,
          {
              rows: ["description"],
              cols: ["status"]
          }
        );

        
        // $("#output").pivot(
        //   lotsdata,
        //   {
        //       rows: ["description"],
        //       cols: ["status"]
        //   }
        // );
        // $.pivotUtilities.tipsData, {
        //   rows: ["sex", "smoker"],
        //   cols: ["day", "time"],
        //   vals: ["tip", "total_bill"],
        //   aggregatorName: "Sum over Sum",
        //   rendererName: "Heatmap"
        // }
        // $("#output").pivotUI(lotsdata, {
        //   // rows: ["product"],
        //   // cols: ["process"]
        //   // ,
        //   // aggregatorName: "Count",
        //   // vals: ["status"],
        //   // rendererName: "Table"
        //   // ,
        //   // rendererOptions: {
        //   //     table: {
        //   //         clickCallback: function(e, value, filters, pivotData){
        //   //             var names = [];
        //   //             pivotData.forEachMatchingRecord(filters,
        //   //                 function(record){ names.push(record.Name); });
        //   //             alert(names.join("\n"));
        //   //         }
        //   //     }
        //   // }
        // });
      }
    });
    
   });