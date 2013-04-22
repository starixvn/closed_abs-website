<%@ Page Language="C#" AutoEventWireup="true" CodeFile="test.aspx.cs" Inherits="test" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Untitled Page</title>
</head>
<body>
    <div>
        <div id="winlossmain" class="content-warper hidden">
            <div class="content-toolbox bgtitle">
                <div id="gridtitle" class="gridtitle">Testing
                </div>
                <div class="btngroup">
                    <%-- <input type="button" onclick="pokerReport.goBack();" value="  " name="btnBack"
                                    id="btnBackToMain" class="btnBack" title="Back To Main" />--%>
                    <%--<input type="button" onclick="pokerReport.exportExcel();" value="  " name="btnExport"
                        id="btnExport" class="btnExcel" title="Export to Excel" />--%></div>
            </div>
            <div class="content-header clearfix">
                <div class="header-scroll">
                    <table class="tbl-header-scroll">
                        <tr>
                            <td rowspan="2" style="border-bottom: none 0px;">
                                <div class="col100 c">
                                    Date</div>
                            </td>
                            <td rowspan="2" style="border-bottom: none 0px;">
                                <div class="col100 c">
                                    Currency</div>
                            </td>
                            <td rowspan="2" style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Gross Comm</div>
                            </td>
                            <td colspan="3">
                                <div class="c">
                                    Member</div>
                            </td>
                            <td colspan="4">
                                <div class="c">
                                    Comm</div>
                            </td>
                            <td rowspan="2" style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Gross Comm Base (RM)</div>
                            </td>
                            <td rowspan="2" style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Company Comm Base (RM)</div>
                            </td>
                        </tr>
                        <tr>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Win/Loss</div>
                            </td>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Comm</div>
                            </td>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Total</div>
                            </td>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Agent</div>
                            </td>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Master</div>
                            </td>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Super</div>
                            </td>
                            <td style="border-bottom: none 0px;">
                                <div class="col80 c">
                                    Company</div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="content-body clearfix">
                <div class="body-scroll">
                    <table id="tblwinlossmain" class="tbl-body-scroll">
                    </table>
                </div>
            </div>
            <div class="content-footer clearfix">
                <div class="footer-scroll">
                    <table class="tbl-footer-scroll" id="tblFooter">
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="../Scripts/Lib/jquery-1.6.2.min.js" type="text/javascript"></script>
    <script src="../Scripts/Lib/gridscroller.js" type="text/javascript"></script>
    <script src="test.js" type="text/javascript"></script>

</body>
</html>
