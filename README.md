**Setup and running step**



If already set up, ignore this step:

**For react install, will need:**

react i
react i react-scripts
npm i, npm install sweetalert-react, npm i react-datepicker, npm i react-select, npm i date-fns,npm install react-icons, npm i react-router-dom@latest, npm install jspdf papaparse


**For Django install will need:**

python -m pip install Django &&
python -m pip install -U channels["daphne"] &&
pip install ctime &&
pip install datetime &&
pip install pathlib &&
pip install asgiref &&
pip install pyserial &&
pip install redmail &&
pip install psycopg2




**To Run:**
***If it's first time running, Server will also need to set up database, use password value in Database in setting.py of Backend DBeaver passport before attenmpting migration using "python manage.py migrate"***
CD into Backend file first
python manage.py runserver 0.0.0.0:8000

CD into frontend file
npm start