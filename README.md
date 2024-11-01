**Setup and running step**



If already set up, ignore this step:

**For react install, will need:**

react i
react i react-scripts
npm i, npm install sweetalert-react, npm i react-datepicker, npm i react-select, npm i date-fns,npm install react-icons, npm i react-router-dom@latest


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

**Set Up Database Before Running**
OPTIONAL: Use DBeaver to view the database

In this application, we used Python's ORM (Object Relational Mapping) to create our models and migrate it to the database (can view the models in the models.py file)

In the settings.py file, change the database password with your own database password and save the project. Also create the database with the exact database name and username (Dbeaver highly recommended)

Before running, please use command "python manage.py migrate" to migrate the models to PostgreSQL.

**To Run:**
CD into Backend file first
python manage.py runserver 0.0.0.0:8000

CD into frontend file
npm start

