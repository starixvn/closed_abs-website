namespace Fanex.ABS.Web.Models
{
    using System.ComponentModel.DataAnnotations;

    public class UnderMaintenanceModel
    {
        #region Public Properties

        [Required]
        [Display(Name = "From")]
        public string From { get; set; }

        [Required]
        [Display(Name = "To")]
        public string To { get; set; }

        #endregion
    }
}