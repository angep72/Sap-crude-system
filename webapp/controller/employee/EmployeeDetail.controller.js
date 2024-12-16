sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",  // Import the JSONModel
    "sap/m/MessageToast"            // Import MessageToast for user notifications
], function (Controller, UIComponent, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.myorg.myapp.controller.employee.EmployeeDetail", {

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
        },

        // Implement onShowResume function
        onShowResume: function (oEvent) {
            // Method 1: Try to get EmployeeID from binding context
            var oBindingContext = this.getView().getBindingContext();

            var sEmployeeId;
            if (oBindingContext) {
                // Try to get EmployeeID from the current binding context
                sEmployeeId = oBindingContext.getProperty("EmployeeID");
            }

            // Method 2: Fallback - extract from current route
            if (!sEmployeeId) {
                try {
                    // Get current hash
                    var oHashChanger = this.getOwnerComponent().getRouter().getHashChanger();
                    var sHash = oHashChanger.getHash();
                    
                    // Assuming route is like "employeeDetail/123"
                    var aHashParts = sHash.split('/');
                    sEmployeeId = aHashParts[1];
                } catch (error) {
                    console.error("Could not extract EmployeeID from route", error);
                }
            }

            // Validate and navigate
            if (sEmployeeId) {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("employeeResume", {
                    employeeId: sEmployeeId
                }, false);
            } else {
                // Show error message to user
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ErrorNavigatingToResume"));
                console.error("Could not determine Employee ID");
            }
        }
    });
});
