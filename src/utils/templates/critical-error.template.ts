import { LogData } from '../../lib/mongoose/log-model.mongoose';

const criticalErrorTemplate = (logData: LogData) => {
  const text = `
  Critical Error Alert

Dear Admin,

A critical error has occurred in the system. Below are the details of the error:

Error Information:
- Message: ${logData.message}
- Timestamp: ${logData.timestamp}
- URL: ${logData.url}
- Method: ${logData.method}
- Response Code: ${logData.code}
- Response Time: ${logData.responseTimeMS} ms
- IP Address: ${logData.ip}
- User ID: ${logData.userId}

Request Headers:
- User-Agent: ${logData.headers.userAgent}
- Referer: ${logData.headers.referer}
- Content-Type: ${logData.headers.contentType}
- Authorization: ${logData.headers.authorization}

Request Body:
${logData.body}

Stack Trace:
${logData.stackTrace}

---

This is an automated message. Please do not reply.

  `;

  const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Critical Error Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background-color: #d9534f;
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }
        .content {
            margin-top: 20px;
        }
        .content p {
            margin: 5px 0;
        }
        .highlight {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #888;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>Critical Error Alert</h1>
    </div>

    <div class="content">
        <p>Dear Admin,</p>
        <p>A critical error has occurred in the system. Below are the details of the error:</p>

        <h3>Error Information</h3>
        <div class="highlight">
            <p><strong>Message:</strong> ${logData.message}</p>
            <p><strong>Timestamp:</strong> ${logData.timestamp}</p>
            <p><strong>URL:</strong> ${logData.url}</p>
            <p><strong>Method:</strong> ${logData.method}</p>
            <p><strong>Response Code:</strong> ${logData.code}</p>
            <p><strong>Response Time:</strong> ${logData.responseTimeMS} ms</p>
            <p><strong>IP Address:</strong> ${logData.ip}</p>
            <p><strong>User ID:</strong> ${logData.userId}</p>
        </div>

        <h3>Request Headers</h3>
        <div class="highlight">
            <p><strong>User-Agent:</strong> ${logData.headers.userAgent}</p>
            <p><strong>Referer:</strong> ${logData.headers.referer}</p>
            <p><strong>Content-Type:</strong> ${logData.headers.contentType}</p>
            <p><strong>Authorization:</strong> ${logData.headers.authorization}</p>
        </div>

        <h3>Request Body</h3>
        <div class="highlight">
            <p>${logData.body}</p>
        </div>

        <h3>Stack Trace</h3>
        <div class="highlight">
            <pre>${logData.stackTrace}</pre>
        </div>
    </div>

    <div class="footer">
        <p>This is an automated message. Please do not reply.</p>
    </div>
</div>

</body>
</html>
  `;

  return { text, html };
};

export default criticalErrorTemplate;
