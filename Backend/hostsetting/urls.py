from django.urls import path
from . import views

urlpatterns = [

    path('data_request/',views.data_request,name="data_request"),
    path('data_request/black_pearl_technology_main',views.black_pearl_technology_main, name="black_pearl_technology_main"),
]