ignore :needed:https://channels.readthedocs.io/en/stable/installation.html


python -m pip install Django
python -m pip install -U channels["daphne"]
pip install ctime
pip install datetime
pip install pathlib
pip install asgiref
pip install pyserial
pip install redmail
pip install psycopg2

RUN USING: python manage.py runserver 0.0.0.0:8000


access website at http://localhost:8000/
