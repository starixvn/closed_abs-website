$(document).ready(function () {
  pokerReport.renderMainReport();
});
var pokerReport = {
    mainData: null,
    title: 'test',  
    renderMainRow: function (row, cssClass) {
        var html = '';
        html = '<tr class="' + cssClass + '">\
                <td><div class="col100 c">12/05/2001</div></td>\
                <td><div class="col100 c">' + row.CurrencyName + '</div></td>\
                <td><div class="col80 r">' + row.GrossComm + '</div></td>\
                <td><div class="col80 r">' + row.MWinLoss + '</div></td>\
                <td><div class="col80 r">' + row.MComm + '</div></td>\
                <td><div class="col80 r">' + row.MTotal + '</div></td>\
                <td><div class="col80 r">' + row.AgentComm + '</div></td>\
                <td><div class="col80 r">' + row.MasterComm + '</div></td>\
                <td><div class="col80 r">' + row.SuperComm + '</div></td>\
                <td><div class="col80 r">' + row.CompanyComm + '</div></td>\
                <td><div class="col80 r">' + row.GrossCommBase + '</div></td>\
                <td><div class="col80 r">' + row.CompanyCommBase + '</div></td>\
            </tr>';
        return html;
    },
    renderTotalRow: function (row, cssClass, total) {
        var html = '';
        var totalhtml = '<td><div class="col100 c b">' + row.CurrencyName + '</div></td>';
        if (total > 0) {
            totalhtml = '<td rowspan="' + total + '" style="border-bottom:none 0px;"><div class="col100 b c">Total</div></td><td><div class="col100 b c">' + row.CurrencyName + '</div></td>';
        }
        html = '<tr class="' + cssClass + '">' + totalhtml + '\
                    <td><div class="col80 r">' + row.GrossComm + '</div></td>\
                    <td><div class="col80 r">' + row.MWinLoss + '</div></td>\
                    <td><div class="col80 r">' + row.MComm + '</div></td>\
                    <td><div class="col80 r">' + row.MTotal + '</div></td>\
                    <td><div class="col80 r">' + row.AgentComm + '</div></td>\
                    <td><div class="col80 r">' + row.MasterComm + '</div></td>\
                    <td><div class="col80 r">' + row.SuperComm + '</div></td>\
                    <td><div class="col80 r">' + row.CompanyComm + '</div></td>\
                    <td><div class="col80 r">' + row.GrossCommBase + '</div></td>\
                    <td><div class="col80 r">' + row.CompanyCommBase + '</div></td>\
                </tr>';
        return html;
    },
    renderGrandTotal: function (row) {
        var html = '<tr>\
                        <td colspan="10"><div class="r" style="width:867px">Grand Total</div></td>\
                        <td><div class="col80 r">' + row.GrossCommBase + '</div></td>\
                        <td><div class="col80 r">' + row.CompanyCommBase + '</div></td>\
                    </tr>';
        return html;
    },
    renderMainReport: function () {
        var winlossmain = $("#winlossmain");      
        var arr = []; 
        var numberitems = items.length;
      
        for (var i = 0; i < numberitems; i++) {
            arr.push(pokerReport.renderMainRow(items[i], (i % 2 == 0 ? "bgeven" : "")));
        }

//       
//        var numbertotalitems = totalitems.length;
//        for (var j = 0; j < numbertotalitems; j++) {
//            if (j == 0) {
//                arr.push(pokerReport.renderTotalRow(totalitems[j], "total", numbertotalitems));
//            }
//            else {
//                arr.push(pokerReport.renderTotalRow(totalitems[j], "total", 0));
//            }
//        }
        alert(arr.join(''));
        $("#tblwinlossmain").empty().html(arr.join(''));
 //       $("#tblFooter").empty().html(pokerReport.renderGrandTotal(grandtotalitems));

        winlossmain.removeClass("hidden").reRenderScroller(1036, 542, true); //100*10+10+10*2
    }
};

 var items=[
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    ];
 var totalitems=[
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000},
    {CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000}
    ]; 
 var grandtotalitems={CurrencyName:'US',GrossComm:100000,MWinLoss:100000,MComm:100000,MTotal:100000,AgentComm:100000,MasterComm:100000,SuperComm:100000,CompanyComm:100000,GrossCommBase:100000,CompanyCommBase:100000};
    