const nodemailer = require("nodemailer")

const MailService = async (emailTo, emailSubject,emailText,message) => {

	const htmlTemplate = `<head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Generate OTP verification</title>
    <style media="all" type="text/css">
    @media only screen and (max-width: 480px) {
        table[class=body] h1 {
            font-size: 24px !important;
        }
        table[class=body] h2 {
            font-size: 20px !important;
        }
        table[class=body] h3 {
            font-size: 14px !important;
        }
        table[class=body] .content,
        table[class=body] .wrapper {
            padding: 15px !important;
        }
        table[class=body] .container {
            width: 100% !important;
            padding: 0 !important;
        }
        table[class=body] .column {
            width: 100% !important;
        }
        table[class=body] .stats .column {
            width: 50% !important;
        }
        table[class=body] .hero-image,
        table[class=body] .thumb {
            width: 100% !important;
            height: auto !important;
        }
        table[class=body] .btn table,
        table[class=body] .btn a {
            width: 100% !important;
        }
        table[class=body] .stats-table {
            display: none !important;
        }
        table[class=body] .stats-labels .label,
        table[class=body] .category-labels .label {
            font-size: 10px !important;
        }
        table[class=body] .credits table {
            table-layout: auto !important;
        }
        table[class=body] .credits .label {
            font-size: 11px !important;
        }
    }
    </style>
    <style type="text/css">
    @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 300;
        src: local('Open Sans Light'), local('OpenSans-Light'), url(https://fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTYnF5uFdDttMLvmWuJdhhgs.ttf) format('truetype');
    }
    
    @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 400;
        src: local('Open Sans'), local('OpenSans'), url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3aCWcynf_cDxXwCLxiixG1c.ttf) format('truetype');
    }
    
    @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 600;
        src: local('Open Sans Semibold'), local('OpenSans-Semibold'), url(https://fonts.gstatic.com/s/opensans/v13/MTP_ySUJH_bn48VBG8sNSonF5uFdDttMLvmWuJdhhgs.ttf) format('truetype');
    }
    </style>
    </head>
    
    <body style="font-size: 16px; background-color: #fdfdfd; margin: 0; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; line-height: 1.5; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; height: 100% !important; width: 100% !important;">
    <table bgcolor="#fdfdfd" class="body" style="box-sizing: border-box; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; width: 100%; background-color: #fdfdfd; border-collapse: separate !important;" width="100%">
        <tbody>
            <tr>
                <td style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
                <td class="container" style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; display: block; width: 600px; max-width: 600px; margin: 0 auto !important;" valign="top" width="600">
                    <div class="content" style="box-sizing: border-box; display: block; max-width: 600px; margin: 0 auto; padding: 10px;"><span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Let's confirm your email address.</span>
                        <div class="header" style="box-sizing: border-box; width: 100%; margin-bottom: 30px; margin-top: 15px;">
                            <table style="box-sizing: border-box; width: 100%; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; border-collapse: separate !important;" width="100%">
                                <tbody>
                                    <tr>
                                        <td align="left" class="align-left" style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; text-align: left;" valign="top">
                                            <h2 style="margin: 0; margin-bottom: 20px; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-weight: bold; line-height: 1.5; font-size: 28px; color: #294661 !important;">Meal Planning</h2>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="block" style="box-sizing: border-box; width: 100%; margin-bottom: 30px; background: #ffffff; border: 1px solid #f0f0f0;">
                            <table style="box-sizing: border-box; width: 100%; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; border-collapse: separate !important;" width="100%">
                                <tbody>
                                    <tr>
                                        <td class="wrapper" style="box-sizing: border-box; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; padding: 30px;" valign="top">
                                            <table style="box-sizing: border-box; width: 100%; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; border-collapse: separate !important;" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;" valign="top">
                                                            <h2 style="margin: 0; margin-bottom: 30px; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-weight: 300; line-height: 1.5; font-size: 24px; color: #294661 !important;">You're on your way!<br>
                                                                    Let's confirm your email address.</h2>
                                                            <p style="margin: 0; margin-bottom: 30px; color: #294661; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 300;">Use the code below to confirm your email address:</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;" valign="top">
                                                            <table cellpadding="0" cellspacing="0" class="btn btn-primary" style="box-sizing: border-box; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; width: 100%; border-collapse: separate !important;" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="center" style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                                                            <table cellpadding="0" cellspacing="0" style="box-sizing: border-box; border-spacing: 0; mso-table-rspace: 0pt; mso-table-lspace: 0pt; width: auto; border-collapse: separate !important;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" id="otp" onclick="copyToClipboard('${emailText}')" style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top; background-color: #212423; border-radius: 2px; text-align: center; cursor: pointer;" valign="top">
                                                                                            <span style="box-sizing: border-box; border-color: #212423; font-weight: 400; text-decoration: none; display: inline-block; margin: 0; color: #ffffff; background-color: #101112; border-radius: 2px; font-size: 20px; padding: 10px 25px;">
                                                                                                ${emailText}
                                                                                            </span>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </td>
                <td style="box-sizing: border-box; padding: 0; font-family: 'Open Sans', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 16px; vertical-align: top;" valign="top">&nbsp;</td>
            </tr>
        </tbody>
    </table>
    
    <script>
    function copyToClipboard(text) {
        var dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        alert("Copied the OTP: " + text);
    }
    </script>
    </body>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "matrerajesh.igenerate@gmail.com",
      pass: "pdvjnlgltnvprkha",
    },
  });

  const info = await transporter.sendMail({
    from: "IGENERATE TECHNOLOGY PRIVATE LIMITED",
    to: emailTo,
    subject: emailSubject,
    // text:emailText,
    html: htmlTemplate
  });

  return info.accepted;
};

module.exports = MailService