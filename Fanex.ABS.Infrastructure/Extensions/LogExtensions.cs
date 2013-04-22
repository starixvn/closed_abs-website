// ----------------------------------------------------------------------
// <copyright file="LogExtensions.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;

    /**
     * public class Log Extensions
     * @Author: bobby.nguyen
     * @Date: 11012011
     **/

    public static class LogExtensions
    {
        #region Constants and Fields

        private static readonly Queue<Exception> _queueEx = new Queue<Exception>();

        private static BackgroundWorker _worker;

        #endregion Constants and Fields

        /**
         * Function: Exception Handler
         */

        #region Public Methods and Operators

        public static void ExceptionHandler(Exception ex)
        {
            //_queueEx.Enqueue(ex);
            //using (_worker = new BackgroundWorker())
            //{
            //    _worker.WorkerSupportsCancellation = true;
            //    _worker.DoWork += WorkerRunning;
            //    _worker.RunWorkerCompleted += WorkerCompleted;
            //    _worker.RunWorkerAsync();
            //}
            Fanex.Logging.Logger.Log.Error(ex.Message, ex);
        }

        #endregion Public Methods and Operators

        /**
         * Function: BackgroundWorker running
         */

        /**
         * Function: BackgroundWorker commpleted
         */

        #region Methods

        private static void WorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            ////TODO
        }

        private static void WorkerRunning(object sender, DoWorkEventArgs e)
        {
            if (_queueEx.Count > 0)
            {
                Exception ex = _queueEx.Dequeue();
                Fanex.Logging.Logger.Log.Error(ex.Message, ex);
            }
            else
            {
                _worker.CancelAsync();
            }
        }

        #endregion Methods
    }
}