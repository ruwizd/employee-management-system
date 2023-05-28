from flask import Flask, jsonify, request, render_template, redirect, url_for
import pandas as pd
from random import randrange

from flask_cors import CORS
import numpy as np
import pickle

# setup application
app = Flask(__name__)
CORS(app)
def prediction(lst):
    filename = 'model/predictor.pickle'
    with open(filename, 'rb') as file:
        model = pickle.load(file)
    pred_value = model.predict([lst])
    return pred_value

@app.route('/', methods=['POST', 'GET'])
def index():
    response = jsonify("Hello World")
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/predict", methods=['POST', 'GET'])
def predict():
    req_data = request.get_json(force=True)
    Male = 0
    Female = 0

    pred_value = -1
    print(request.method)
    Salary = int(req_data['Salary'])
    PerformanceScore = int(req_data['PerformanceScore'])
    EngagementSurvey = float(req_data['EngagementSurvey'])
    SpecialProjectsCount= int(req_data['SpecialProjectsCount'])
    DaysLateLast30= int(req_data['DaysLateLast30'])
    Absences = int(req_data['Absences'])
    Position= req_data['Position']
    
    DateOfHire= req_data['DateOfHire']
    #get separatly year month and day
    DateOfHire = DateOfHire.split('-')
    DateOfHireYear = int(DateOfHire[0])
    DateOfHireMonth = int(DateOfHire[1])
    DateOfHireDay = int(DateOfHire[2])
    
    DateOfBirth= req_data['DateOfBirth']
    #get separatly year month and day
    DateOfBirth = DateOfBirth.split('-')
    DateOfBirthYear = int(DateOfBirth[0])
    DateOfBirthMonth = int(DateOfBirth[1])
    DateOfBirthDay = int(DateOfBirth[2])
    
    getGender = req_data['Gender']
    #Gender check
    if getGender == 'Female':
        Female = 1
    else:
        Male = 1
    
    MaritalStatus= req_data['MaritalStatus']
    Department= req_data['Department']
    ManagerName= req_data['ManagerName']
    RecruitmentSource= req_data['RecruitmentSource']

    position_list=['Architect','Director','Engineer','Manager','Other','TechnicianI','TechnicianII']
    Marital_Status_list=['Divorced','Married','Separated','Single','Widowed']
    Department_list=['AdminOffices','ExecutiveOffice','IT/IS','Production','Sales','SoftwareEngineering']
    ManagerName_list=['AlexSweetwater',
    'AmyDunn', 'BoardofDirectors', 'BrandonR.LeBlanc',
    'BrannonMiller', 'BrianChampaigne', 'DavidStanley',
    'DebraHoulihan', 'ElijiahGray', 'EricDougall',
    'JanetKing', 'JenniferZamora', 'JohnSmith',
    'KelleySpirea', 'KetsiaLiebig', 'KissySullivan',
    'LynnDaneault', 'MichaelAlbert', 'PeterMonroe',
    'SimonRoup', 'WebsterButler']
    RecruitmentSource_list=['CareerBuilder',
    'DiversityJobFair', 'EmployeeReferral', 'GoogleSearch',
    'Indeed', 'LinkedIn', 'On-lineWebApplication', 'Other',
    'Website']
    
    def traverse_list(lst, value):
        for item in lst:
            if item == value:
                feature_list.append(1)
            else:
                feature_list.append(0)
    
    feature_list = []
    feature_list.append(Salary)
    feature_list.append(PerformanceScore)
    feature_list.append(EngagementSurvey)
    feature_list.append(SpecialProjectsCount)
    feature_list.append(DaysLateLast30)
    feature_list.append(Absences)
    feature_list.append(DateOfBirthYear)
    feature_list.append(DateOfBirthMonth)
    feature_list.append(DateOfBirthDay)
    feature_list.append(DateOfHireYear)
    feature_list.append(DateOfHireMonth)
    feature_list.append(DateOfHireDay)
    traverse_list(position_list,Position)
    feature_list.append(Female)
    feature_list.append(Male)
    traverse_list(Marital_Status_list, MaritalStatus )
    traverse_list(Department_list, Department)
    traverse_list(ManagerName_list, ManagerName)
    traverse_list(RecruitmentSource_list, RecruitmentSource)

    # print(feature_list)
    # print(feature_list)
    pred_value = prediction(feature_list)
    response = jsonify({"data":np.int(pred_value[0])})
    response.headers.add('Access-Control-Allow-Origin', '*')
    # return response
    return response

if __name__ == '__main__':
    app.run(debug=True)