from django.shortcuts import render
from django.http import HttpResponseRedirect,HttpResponse
import pickle
import os
# Create your views here.


def update_context(file_data):
    """update context"""
    context = {
        'email_address':file_data['Email'],    
        'occupied_slot': file_data['Slots'],
        'floor_height' : file_data['Height'],
        'panel_length' : file_data['Panel_Length'],
        'y_to_pin'    : file_data['Top_To_Pin'],
        'pin_to_pin'  : file_data['Pin_To_Pin'],
        'programmers_per_row': file_data['Flash_In_Row'],
        'button_state' :'Lock',
        'current_state' : 'Stop',
    }    
    return context

def data_request(request):
    """get value and throw back"""
    return page_render(request)

def page_render(request):
    """get value and throw back"""
    data_extract = pickle.load(open(os.path.join(os.path.dirname(__file__), "DjangoStoreMode.txt"),'rb'))
    js_form_state= update_context(file_data=data_extract)
    return render(request,'this.html',js_form_state)

"""require POST, GET request"""
def black_pearl_technology_main(request):
    """Decide function to run"""
    data_extract = pickle.load(open(os.path.join(os.path.dirname(__file__), "DjangoStoreMode.txt"),'rb'))
    return HttpResponse(f'Send batch report to {data_extract["email_address"]}.Have a good day!')


