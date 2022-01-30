from twilio.rest import Client

class Twilipy:
    def __init__(self, account_sid, auth_token):
        self.client = Client(account_sid, auth_token)

    def send_sms_message(self, number, message):
        message = self.client.messages \
            .create(
            body=message,
            from_='+18013370504',
            to=number
        )

        print(message.sid)

    def send_call_message(self, phone, msg):
        call = self.client.calls.create(
            twiml=f'<Response><Pause length="3"/><Say>{msg}</Say></Response>',
            to=phone,
            from_='+18013370504'
        )
        print(call.sid)