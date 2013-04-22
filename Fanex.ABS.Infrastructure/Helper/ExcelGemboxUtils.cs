// ----------------------------------------------------------------------
// <copyright file="ExcelGemboxUtils.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Sunplus.Accounting.Core.Helper
{
    using System.Drawing;

    using ExcelUtil.Spreadsheet;

    /// <summary>
    /// Created by: Tran Van Khoa (Robert)
    /// Summary description for ExcelGemboxUtils
    /// </summary>
    public class ExcelGemboxUtils
    {
        #region Public Methods and Operators

        public CellStyle GetStyleIntNumber(decimal num, string symbol, int red, int green, int blue)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = "#,##0" + symbol + "_);(#,##0)" + symbol;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleIntNumber(
            string symbol, Color bgColor, bool isBold, bool isPossitiveColor, bool isNagativeColor)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);

            if (isNagativeColor)
            {
                style.NumberFormat = string.Format("#,##0{0}_);[RED]-#,##0{1}", symbol, symbol);
            }
            else if (isPossitiveColor)
            {
                style.NumberFormat = string.Format("[RED]#,##0{0}_);-#,##0{1}", symbol, symbol);
            }
            else
            {
                style.NumberFormat = string.Format("#,##0{0}_);-#,##0{1}", symbol, symbol);
            }

            style.FillPattern.SetSolid(bgColor);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (isBold)
            {
                style.Font.Weight = ExcelFont.BoldWeight;
            }

            return style;
        }

        public CellStyle GetStyleIntNumber(string symbol, Color bgColor, bool isBold, bool isPossitiveColor)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = string.Format(
                "{0}#,##0{1}_);-#,##0{2}", isPossitiveColor ? "[RED]" : string.Empty, symbol, symbol);
            style.FillPattern.SetSolid(bgColor);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (isBold)
            {
                style.Font.Weight = ExcelFont.BoldWeight;
            }

            return style;
        }

        public CellStyle GetStyleIntNumber(string symbol, Color bgColor, Color fontColor)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = "#,##0" + symbol + "_);(#,##0)" + symbol;
            style.FillPattern.SetSolid(bgColor);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;

            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Color = fontColor;

            return style;
        }

        public CellStyle GetStyleIntNumber(decimal num, bool IsEven, string symbol)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = "#,##0" + symbol + "_);(#,##0)" + symbol;
            if (IsEven)
            {
                style.FillPattern.SetSolid(Color.FromArgb(223, 234, 255));
            }

            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleIntNumberTotal(decimal num, bool IsEven, string symbol)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.FillPattern.SetSolid(Color.FromArgb(218, 238, 243));
            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.NumberFormat = "#,##0" + symbol + "_);(#,##0)" + symbol;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleIntNumberTotal(decimal num, string symbol)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);

            style.FillPattern.SetSolid(Color.FromArgb(218, 238, 243));

            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.NumberFormat = "#,##0" + symbol + "_);(#,##0)" + symbol;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleNumber(decimal num, bool IsEven, string symbol)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = "#,##0.00" + symbol + "_);(#,##0.00)" + symbol;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;

            if (IsEven)
            {
                style.FillPattern.SetSolid(Color.FromArgb(223, 234, 255));
            }
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleNumber(decimal num, string symbol, int red, int green, int blue)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = "#,##0.00" + symbol + "_);(#,##0.00)" + symbol;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleNumber(decimal num, string symbol, int red, int green, int blue, bool IsBold)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.NumberFormat = "#,##0.00" + symbol + "_);(#,##0.00)" + symbol;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            style.Font.Name = "Tahoma";
            if (IsBold)
            {
                style.Font.Weight = ExcelFont.BoldWeight;
            }
            style.Font.Size = 160;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleNumberCenter(decimal num, bool IsEven, string symbol)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (IsEven)
            {
                style.FillPattern.SetSolid(Color.FromArgb(223, 234, 255));
            }
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleNumberTotal(decimal num, string symbol, int red, int green, int blue)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.NumberFormat = "#,##0.00" + symbol + "_);(#,##0.00)" + symbol;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleNumberTotal(decimal num, string symbol)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.FillPattern.SetSolid(Color.FromArgb(218, 238, 243));
            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.NumberFormat = "#,##0.00" + symbol + "_);(#,##0.00)" + symbol;
            if (num < 0)
            {
                style.Font.Color = Color.Red;
            }
            return style;
        }

        public CellStyle GetStyleText(bool IsEven)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (IsEven)
            {
                style.FillPattern.SetSolid(Color.FromArgb(223, 234, 255));
            }
            return style;
        }

        public CellStyle GetStyleText(int red, int green, int blue)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            return style;
        }

        public CellStyle GetStyleText(int red, int green, int blue, bool IsBold)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            if (IsBold)
            {
                style.Font.Weight = ExcelFont.BoldWeight;
            }
            return style;
        }

        public CellStyle GetStyleText(int red, int green, int blue, HorizontalAlignmentStyle textAlign)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = textAlign;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            return style;
        }

        public CellStyle GetStyleText(int red, int green, int blue, HorizontalAlignmentStyle textAlign, bool IsBold)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = textAlign;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (IsBold)
            {
                style.Font.Weight = ExcelFont.BoldWeight;
            }
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            return style;
        }

        public CellStyle GetStyleText(Color fontcolor, int red, int green, int blue, HorizontalAlignmentStyle textAlign)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = textAlign;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.Font.Color = fontcolor;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            return style;
        }

        public CellStyle GetStyleTextCenter(bool IsEven)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            if (IsEven)
            {
                style.FillPattern.SetSolid(Color.FromArgb(223, 234, 255));
            }
            return style;
        }

        public CellStyle GetStyleTextCenter(int red, int green, int blue)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            return style;
        }

        public CellStyle GetStyleTextTotal()
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.FillPattern.SetSolid(Color.FromArgb(218, 238, 243));
            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            return style;
        }

        public CellStyle GetStyleTextTotal(int red, int green, int blue)
        {
            var style = new CellStyle();
            style.VerticalAlignment = VerticalAlignmentStyle.Center;
            style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            style.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            style.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            style.Font.Weight = ExcelFont.BoldWeight;
            style.Font.Name = "Tahoma";
            style.Font.Size = 160;
            return style;
        }

        public CellStyle GetStyleTitle()
        {
            var celltitle = new CellStyle();
            celltitle.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            celltitle.VerticalAlignment = VerticalAlignmentStyle.Center;
            celltitle.FillPattern.SetSolid(Color.FromArgb(82, 106, 128));
            celltitle.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            celltitle.Font.Weight = ExcelFont.BoldWeight;
            celltitle.Font.Color = Color.White;
            celltitle.Font.Name = "Tahoma";
            celltitle.Font.Size = 160;
            celltitle.WrapText = true;
            return celltitle;
        }

        public CellStyle GetStyleTitle(Color color)
        {
            var celltitle = new CellStyle();
            celltitle.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            celltitle.VerticalAlignment = VerticalAlignmentStyle.Center;
            celltitle.FillPattern.SetSolid(color);
            celltitle.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            celltitle.Font.Color = Color.Black;
            celltitle.Font.Name = "Tahoma";
            celltitle.Font.Size = 160;
            celltitle.Font.Weight = ExcelFont.BoldWeight;
            celltitle.WrapText = true;
            return celltitle;
        }

        public CellStyle GetStyleTitle(int red, int green, int blue)
        {
            var celltitle = new CellStyle();
            celltitle.HorizontalAlignment = HorizontalAlignmentStyle.Center;
            celltitle.VerticalAlignment = VerticalAlignmentStyle.Center;
            celltitle.FillPattern.SetSolid(Color.FromArgb(red, green, blue));
            celltitle.Borders.SetBorders(MultipleBorders.Outside, Color.Gray, LineStyle.Thin);
            celltitle.Font.Color = Color.Black;
            celltitle.Font.Name = "Tahoma";
            celltitle.Font.Size = 160;
            celltitle.Font.Weight = ExcelFont.BoldWeight;
            celltitle.WrapText = true;
            return celltitle;
        }

        #endregion
    }
}