# This functionality was not implemented in the front-end due to time constraints

import twilio
import sendgrid
import os
from sendgrid.helpers.mail import Mail, Email, To, Content

api_key = ""


sg = sendgrid.SendGridAPIClient(api_key)
from_email = Email("email@gmail.com")  # Change to your verified sender
to_email = To("email@gmail.com")  # Change to your recipient
subject = "Information"
message = """
CovAlert

Public Health Alert 

Related Person has been confirmed COVID + and has sent this notification for a contact tracing alert. According to (sendee) last meeting date was on 00/00/0000. Please limit public presence for 5 days after date of last contact. 

If experiencing any severe symptoms of COVID, seek medical attention.
Nearby testing locations can be found at ….


For more information regarding COVID please refer to the CDC guidelines found at
    https://www.cdc.gov/od/ocio/links/index.html

Do not Reply
"""
content = Content("text/plain", message)


mail = Mail(from_email, to_email, subject, content)

# Get a JSON-ready representation of the Mail object
mail_json = mail.get()

# Send an HTTP POST request to /mail/send
response = sg.client.mail.send.post(request_body=mail_json)
print(response.status_code)
print(response.headers) 
