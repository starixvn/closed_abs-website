// ----------------------------------------------------------------------
// <copyright file="SendMailExtension.cs" company="Nexcel">
//     Copyright statement. All right reserved
// </copyright>
//
// ------------------------------------------------------------------------

namespace Fanex.ABS.Infrastructure.Extensions
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.IO;
    using System.Net;
    using System.Net.Mail;
    using System.Text;

    using Fanex.ABS.Infrastructure.Configurations;

    using Nexcel.Statistics.Services.Models;

    public class SendMailExtension
    {
        #region Constants and Fields

        private static readonly Queue<MailSend> _queueMail = new Queue<MailSend>();

        private static bool _sendMailStatus = true;

        private static BackgroundWorker _worker;

        #endregion

        /**
         * Accounting - Send mail & notification
         **/

        #region Public Methods and Operators

        public static bool AccSendMail(
            MailSection.HostName hostName, string to, string cc, string mailTitle, string subject, string body)
        {
            return AccSendMail(hostName, to, cc, mailTitle, subject, body, null);
        }

        public static bool AccSendMail(
            MailSection.HostName hostName,
            string to,
            string cc,
            string mailTitle,
            string subject,
            string body,
            MailAttachment mailAttachment)
        {
            return AccSendMail(hostName, to, cc, string.Empty, mailTitle, subject, body, mailAttachment, null);
        }

        public static bool AccSendMail(
            MailSection.HostName hostName,
            string to,
            string cc,
            string bcc,
            string mailTitle,
            string subject,
            string body,
            MailAttachment mailAttachment)
        {
            return AccSendMail(hostName, to, cc, bcc, mailTitle, subject, body, mailAttachment, null);
        }

        public static bool AccSendMail(
            MailSection.HostName hostName,
            string to,
            string cc,
            string bcc,
            string mailTitle,
            string subject,
            string body,
            MailAttachment mailAttachment,
            AlternateView altView)
        {
            try
            {
                var mailSend = new MailSend
                    {
                        HostName = hostName,
                        To = to,
                        Cc = cc,
                        Bcc = bcc,
                        Title = mailTitle,
                        Subject = subject,
                        Body = body,
                        Attachment = mailAttachment,
                        AltView = altView
                    };

                _queueMail.Enqueue(mailSend);

                using (_worker = new BackgroundWorker())
                {
                    _worker.WorkerSupportsCancellation = true;
                    _worker.DoWork += WorkerRunning;
                    _worker.RunWorkerCompleted += WorkerCompleted;
                    _worker.RunWorkerAsync();
                }
                return true;
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return false;
        }

        /**
         * Function: Backgroundworker running
         */

        public static bool SendMail(MailSend mailSend)
        {
            try
            {
                MailElement mailSetting = MailSection.Instance[MailSection.Setting.Server][MailSection.Instance.Active];

                var msg = new MailMessage();

                if (!string.IsNullOrEmpty(mailSend.To))
                {
                    mailSend.To.Split(';').ForEach(toMail => { msg.To.Add(toMail); });
                }

                msg.From = new MailAddress(mailSetting.Username, mailSend.Title, Encoding.UTF8);

                if (!string.IsNullOrEmpty(mailSend.Cc))
                {
                    mailSend.Cc.Split(';').ForEach(ccMail => { msg.CC.Add(ccMail); });
                }

                if (!string.IsNullOrEmpty(mailSend.Bcc))
                {
                    mailSend.Bcc.Split(';').ForEach(bccMail => msg.Bcc.Add(bccMail));
                }

                msg.Subject = mailSend.Subject;
                msg.SubjectEncoding = Encoding.UTF8;

                msg.IsBodyHtml = true;
                msg.Body = mailSend.Body;
                msg.BodyEncoding = Encoding.UTF8;

                MailAttachment attachFile = mailSend.Attachment;
                if (attachFile != null && attachFile.Content != null)
                {
                    attachFile.Content.Seek(0, SeekOrigin.Begin);
                    var attachment = new Attachment(attachFile.Content, attachFile.FileName, attachFile.ContentType);
                    msg.Attachments.Add(attachment);
                }

                if (mailSend.AltView != null)
                {
                    msg.AlternateViews.Add(mailSend.AltView);
                }
                msg.Priority = MailPriority.High;

                var client = new SmtpClient { Port = mailSetting.Port, Host = mailSetting.Host };
                if (mailSetting.Auth)
                {
                    client.Credentials = new NetworkCredential(mailSetting.Username, mailSetting.Password);
                    client.EnableSsl = true;
                }
                client.Send(msg);
                return true;
            }
            catch (Exception ex)
            {
                LogExtensions.ExceptionHandler(ex);
            }
            return false;
        }

        #endregion

        #region Methods

        private static void WorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            _sendMailStatus = (bool)e.Result;
        }

        private static void WorkerRunning(object sender, DoWorkEventArgs e)
        {
            if (_queueMail.Count > 0)
            {
                MailSend queueMail = _queueMail.Dequeue();
                e.Result = SendMail(queueMail);
            }
            else
            {
                _worker.CancelAsync();
            }
        }

        #endregion
    }

    public class MailSend
    {
        #region Public Properties

        public AlternateView AltView { get; set; }

        public MailAttachment Attachment { get; set; }

        public string Bcc { get; set; }

        public string Body { get; set; }

        public string Cc { get; set; }

        public MailSection.HostName HostName { get; set; }

        public string Subject { get; set; }

        public string Title { get; set; }

        public string To { get; set; }

        #endregion
    }
}