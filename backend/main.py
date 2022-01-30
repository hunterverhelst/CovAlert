from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from flask import Flask, request
from flask_cors import CORS
from twilio_wrapper import Twilipy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import engine
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

account_sid = 'account_sid'
auth_token = 'auth_token'
twilio = Twilipy(account_sid, auth_token)

db_user = 'db_user'
db_pass = 'db_pass'
db_name = 'antispam_tracking'
db_host = 'db_host'
db_socket_dir = '/cloudsql'
instance_connection_name = 'name'
# Extract port from db_host if present,
# otherwise use DB_PORT environment variable.
host_args = db_host.split(":")
if len(host_args) == 1:
 db_hostname = db_host
 db_port = 'port'
elif len(host_args) == 2:
 db_hostname, db_port = host_args[0], int(host_args[1])
# # configuration
app.config["SECRET_KEY"] = "key"
app.config["SQLALCHEMY_DATABASE_URI"]= engine.url.URL.create(
     drivername="mysql+pymysql",
     username=db_user,  # e.g. "my-database-user"
     password=db_pass,  # e.g. "my-database-password"
     host=db_hostname,  # e.g. "127.0.0.1"
     port=db_port,  # e.g. 3306
     database=db_name,  # e.g. "my-database-name"
 )
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]= True

db = SQLAlchemy(app)

class sender_info(db.Model):
    table_name = 'sender_info'
    phone = db.Column(db.String(12), primary_key=True)
    last_time = db.Column(db.DateTime)

    def __init__(self, number, time):
        self.table_name = 'sender_info'
        self.phone = number
        self.last_time = time

@app.route("/bot", methods=['GET', 'POST'])
def bot():
    incoming_msg = request.get_json()
    print("res: ")
    print(incoming_msg)
    for number, date in zip(incoming_msg['phoneNums'], incoming_msg['dateTimes']):
        if number == "":
            continue
        verify = verify_number(number)
        print(verify)
        if verify:
            if date:
                send_alert(number, f" on {date[:10]}")
            else:
                send_alert(number, "")
    return "Success", 200



def send_alert(number, date):
    message = f"""
This is an important message about your health.

An anonymous acquaintance sent this notification \
to let you know you may have been exposed to Covid-19{date}.

We recommend you follow the CDC's guidelines which currently \
suggest home quarantine for 5 days (if you are asymptomatic).

If experiencing any severe symptoms of Covid-19, seek medical attention.

For more information please refer to the CDC guidelines found at \
https://www.cdc.gov/coronavirus/2019-ncov/your-health/index.html \
which contains a self checker.

This was an auto generated message sent from \
www.covalert.tech.
        """
    twilio.send_sms_message(number, message)

def verify_number(number):
    out = sender_info.query.filter_by(phone=number).first()
    today = datetime.now()
    if out is not None:
        day = timedelta(days=1)
        print(f"{out.phone} on {out.last_time}")
        if (today - out.last_time) < day:
            return False
        else:
            out.last_time = today
            db.session.commit()
            return True
    else:
        new_number = sender_info(number, today)
        db.session.add(new_number)
        db.session.commit()
        return True

if __name__ == "__main__":
    app.run()
