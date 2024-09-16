const slowResponsesTemplate = () => {
  const text = `
  Dear Admin,

We have detected unusually high response times from the backend requests on the system. This issue may affect the overall performance and user experience.

Here are the key details:

- **Timestamp:** {{timestamp}}
- **Service/Endpoint:** {{service_name}}
- **Average Response Time:** {{response_time}} ms
- **Threshold:** {{threshold}} ms
- **Affected Requests:** {{affected_requests}} requests

Please investigate the issue and take the necessary steps to ensure the system operates smoothly. Continued high response times may lead to service disruption or user complaints.

Thank you for your immediate attention to this matter.

Best regards,  
Golden Feather Backend
  `;

  const html = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>High Response Time Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            padding: 20px;
        }

        .email-content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #d9534f;
        }

        p {
            color: #333333;
        }

        .details {
            background-color: #f9f9f9;
            padding: 15px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            margin-top: 20px;
        }

        .details p {
            margin: 5px 0;
        }

        a.button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #d9534f;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }

        a.button:hover {
            background-color: #c9302c;
        }

        footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888888;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="email-content">
            <h1>🚨 High Response Time Alert</h1>
            <p>Dear Admin,</p>
            <p>We have detected unusually high response times from the backend requests on the system. This issue may affect the overall performance and user experience.</p>

            <div class="details">
                <p><strong>Timestamp:</strong> {{timestamp}}</p>
                <p><strong>Service/Endpoint:</strong> {{service_name}}</p>
                <p><strong>Average Response Time:</strong> {{response_time}} ms</p>
                <p><strong>Threshold:</strong> {{threshold}} ms</p>
                <p><strong>Affected Requests:</strong> {{affected_requests}} requests</p>
            </div>

            <p>Please investigate the issue and take the necessary steps to ensure the system operates smoothly. Continued high response times may lead to service disruption or user complaints.</p>

            <footer>
                <p>Thank you for your immediate attention to this matter.</p>
                <p>Golden Feather Backend</p>
            </footer>
        </div>
    </div>
</body>

</html>

  `;

  return { text, html };
};

export default slowResponsesTemplate;
