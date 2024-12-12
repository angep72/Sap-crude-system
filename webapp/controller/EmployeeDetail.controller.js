sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",  // Import the JSONModel
    "sap/m/MessageToast"            // Import MessageToast for user notifications
], function (Controller, UIComponent, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.myorg.myapp.controller.EmployeeDetail", {

        onInit: function () {
            // Get the router correctly using UIComponent.getRouterFor(this)
            var oRouter = UIComponent.getRouterFor(this);

            // Attach the matched event for the "employeeDetail" route
            oRouter.getRoute("employeeDetail").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var sEmployeeId = oArgs.EmployeeID; // Assuming employeeId is passed in the route

            // Log the employeeId (for debugging)
            console.log("Employee ID: " + sEmployeeId);

            // Fetch employee data from the JSON model
            var oModel = new JSONModel("model/Employees.json");
            this.getView().setModel(oModel, "employee");

            // After loading the model, filter the data to show the specific employee's details
            oModel.attachRequestCompleted(function () {
                var oData = oModel.getData();
                var oEmployee = oData.Employees.find(function (employee) {
                    return employee.EmployeeID === parseInt(sEmployeeId, 10); // Match the EmployeeID
                });

                if (oEmployee) {
                    // Set the model with the filtered employee data
                    this.getView().setModel(new JSONModel(oEmployee), "employee");
                    console.log("Employee Details:", oEmployee); // For debugging
                } else {
                    MessageToast.show("Employee not found");
                }
            }, this);
        }
    });
});
