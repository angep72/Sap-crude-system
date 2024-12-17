sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, UIComponent, JSONModel, MessageToast) {
    "use strict";

    // Define valid tab keys to prevent invalid navigation
    var _aValidTabKeys = ["Info", "Projects", "Hobbies", "Notes"];

    return Controller.extend("com.myorg.myapp.controller.employee.ResumeDetail", {
        /**
         * Initialization method called when the controller is instantiated
         * Sets up models, routing, and initial configurations
         */
        onInit: function () {
            // Create and configure the employees JSON model
            var oEmployeesModel = new JSONModel();
            
            // Add detailed logging for model loading
            oEmployeesModel.attachRequestCompleted(function(oEvent) {
                if (oEvent.getParameter("success")) {
                    console.log("Employees model loaded successfully");
                    var aEmployees = oEvent.getSource().getData().Employees;
                    console.log("Total employees loaded: ", aEmployees ? aEmployees.length : 0);
                } else {
                    console.error("Failed to load employees model");
                }
            });

            // Load employee data
            oEmployeesModel.loadData("model/employees.json");
            
            // Set the model to the view with a specific name
            this.getView().setModel(oEmployeesModel, "employees");

            // Create a separate model for view-specific data
            this.getView().setModel(new JSONModel(), "view");

            // Get the router and set up route matching
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
        },

        /**
         * Route matched event handler
         * Manages view setup and tab selection when route is matched
         */
        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            var oView = this.getView();
            var oQuery = oArgs["?query"];
            var oModel = this.getView().getModel("employees");
        
            // Validate employeeId
            if (!oArgs.employeeId || isNaN(parseInt(oArgs.employeeId))) {
                console.error("Invalid employee ID");
                this.getOwnerComponent().getRouter().getTargets().display("notFound");
                return;
            }
        
            // Store the employeeId to ensure it's constant across route changes
            this._employeeId = oArgs.employeeId;

            oModel.dataLoaded().then(function() {
                try {
                    this._bindEmployeeData(oArgs, oView);
                } catch (error) {
                    console.error("Error binding employee data:", error);
                    this.getOwnerComponent().getRouter().getTargets().display("notFound");
                }
            }.bind(this)).catch(function(error) {
                console.error("Model loading failed:", error);
                MessageToast.show("Unable to load employee data");
            });
        
            // Handle tab selection
            if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1) {
                oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
            } else {
                // Default to first tab if no valid tab is provided
                this.getOwnerComponent().getRouter().navTo("employeeResume", {
                    employeeId: oArgs.employeeId,
                    "?query": { tab: _aValidTabKeys[0] }
                }, true);
            }
        },

        /**
         * Binds employee data to the view
         * @param {Object} oArgs - Route arguments
         * @param {sap.ui.core.mvc.View} oView - Current view
         */
        _bindEmployeeData: function (oArgs, oView) {
            // Enhanced binding with explicit model and error handling
            oView.bindElement({
                path: "/Employees/" + this._employeeId,  // Use the stored employeeId
                model: "employees",
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },

        /**
         * Binding change event handler
         * Redirects to "not found" page if no binding context exists
         */
        _onBindingChange: function () {
            // Check if no binding context exists
            if (!this.getView().getBindingContext("employees")) {
                // Navigate to the "not found" target
                this.getOwnerComponent().getRouter().getTargets().display("notFound");
            }
        },

        /**
         * Tab selection event handler
         * Updates route when a different tab is selected
         * @param {sap.ui.base.Event} oEvent - The tab select event
         */
        onTabSelect: function (oEvent) {
            var oRouter = this.getOwnerComponent().getRouter();
            
            // Use the stored employeeId for navigation
            if (this._employeeId) {
                oRouter.navTo("employeeResume", {
                    employeeId: this._employeeId,  // Use stored employeeId
                    "?query": { 
                        tab: oEvent.getParameter("selectedKey") 
                    }
                }, true); // No browser history
            } else {
                console.error("EmployeeID is not available.");
                MessageToast.show("Unable to select tab: Employee data not found.");
            }
        }
    });
});
