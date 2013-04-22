// ----------------------------------------------------------------------
// <copyright file="Result.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Entities
{

    /// <summary>
    /// Result Object
    /// </summary>
    public class Result
    {
        #region Constructors and Destructors

        /// <summary>
        /// Initializes a new instance of the <see cref="Result"/> class.
        /// </summary>
        public Result()
        {
            this.ErrorCode = 0;
            this.ErrorMessage = "Successful";
            LockInfo = new NextLoginInfo();
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Result"/> class.
        /// </summary>
        /// <param name="errorCode">The error code.</param>
        /// <param name="errorMessage">The error message.</param>
        public Result(int errorCode, string errorMessage)
        {
            this.ErrorCode = errorCode;
            this.ErrorMessage = errorMessage;
        }

        #endregion

        #region Public Properties

        /// <summary>
        /// Gets or sets the error code.
        /// </summary>
        /// <value>
        /// The error code.
        /// </value>
        public int ErrorCode { get; set; }

        /// <summary>
        /// Gets or sets the error message.
        /// </summary>
        /// <value>
        /// The error message.
        /// </value>
        public string ErrorMessage { get; set; }


        public NextLoginInfo LockInfo { get; set; }

        #endregion

        public class NextLoginInfo
        {
            public NextLoginInfo()
            {
                Minute = 0;
                Second = 0;
            }
            public int Minute { get; set; }
            public int Second { get; set; }
        }
    }
}