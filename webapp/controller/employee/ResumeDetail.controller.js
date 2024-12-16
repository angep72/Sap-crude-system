sap.ui.define([
    // Import required SAP UI5 modules
    "sap/ui/core/mvc/Controller",        // Base controller class
    "sap/ui/core/UIComponent",           // UI Component for application-level operations
    "sap/ui/model/json/JSONModel",       // JSON Model for local view data
    "sap/m/MessageToast"                 // For showing brief, non-intrusive messages
], function (Controller, UIComponent, JSONModel, MessageToast) {
    "use strict";

    // Define valid tab keys as a module-level variable
    // This ensures the keys are consistent and can be reused
    var _aValidTabKeys = ["Info", "Projects", "Hobbies", "Notes"];

    // Extend the base Controller class with our specific implementationon 
    return Controller.extend("com.myorg.myapp.controller.employee.ResumeDetail", {
        /**
         * Initialization method called when the controller is instantiated
         * Used for setting up initial view configurations and route handling
         */
        onInit: function () {
            // Get the router from the application component
            var oRouter = this.getOwnerComponent().getRouter();
            
            // Create a JSON model specifically for view-related data
            // This allows storing temporary or UI-specific data separately from backend data
            this.getView().setModel(new JSONModel(), "view");
        
            // Attach a route matched event handler
            // This ensures that when the "employeeResume" route is matched, 
            // our custom logic is executed
            oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
        },

        /**
         * Route matched event handler
         * Handles setting up the view when the route is matched
         * @param {sap.ui.base.Event} oEvent - The routing event
         */
        _onRouteMatched: function (oEvent) {
            // Declare variables for storing route arguments, view, and query parameters
            var oArgs, oView, oQuery;

            // Get the route arguments from the event
            oArgs = oEvent.getParameter("arguments");

            // Get the current view
            oView = this.getView();

            // Bind the view to a specific employee entity
            // This creates a data context for the entire view
            oView.bindElement({
                // Construct the path to the specific employee using the employeeId from route
                path: "/Employees(" + oArgs.employeeId + ")",
                
                // Define event handlers for the binding lifecycle
                events: {
                    // Handler for when the binding changes
                    change: this._onBindingChange.bind(this),
                    
                    // Show busy indicator when data is being requested
                    dataRequested: function (oEvent) {
                        oView.setBusy(true);
                    },
                    
                    // Hide busy indicator when data is received
                    dataReceived: function (oEvent) {
                        oView.setBusy(false);
                    }
                }
            });

            // Get query parameters from route arguments
            oQuery = oArgs["?query"];

            // Validate and set the selected tab
            if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1) {
                // If the query tab is valid, set it in the view model
                oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
            } else {
                // If no valid tab is provided, navigate to the first valid tab
                this.getOwnerComponent().getRouter().navTo("employeeResume", {
                    // Maintain the current employee ID
                    employeeId: oArgs.employeeId,
                    
                    // Set the first tab from _aValidTabKeys as the default
                    "?query": {
                        tab: _aValidTabKeys[0]
                    }
                }, true /* suppress browser history entry */);
            }
        },

        /**
         * Binding change event handler
         * Checks if the binding context is valid, redirects to "not found" if no context exists
         * @param {sap.ui.base.Event} oEvent - The binding change event
         */
        _onBindingChange: function (oEvent) {
            // Check if no binding context exists (i.e., employee not found)
            if (!this.getView().getBindingContext()) {
                // Navigate to the "not found" target
                this.getOwnerComponent().getRouter().getTargets().display("notFound");
            }
        },

        /**
         * Tab selection event handler
         * Updates the route when a different tab is selected
         * @param {sap.ui.base.Event} oEvent - The tab select event
         */
        onTabSelect: function (oEvent) {
            // Safely extract the selected key
            var sSelectedKey = oEvent.getParameter("selectedKey");
        
            // Get the current route arguments
            var oRouter = this.getOwnerComponent().getRouter();
            var oCurrentHash = oRouter.oHashChanger.getHash();
            
            // Parse the current hash to extract existing parameters
            var oCurrentRouteParams = this._parseRouteHash(oCurrentHash);
        
            // Navigate to the same route with updated tab parameter
            oRouter.navTo("employeeResume", {
                // Maintain the current employee ID from existing route
                employeeId: oCurrentRouteParams.employeeId,
                
                // Update the tab query parameter with the newly selected tab
                "?query": {
                    tab: sSelectedKey
                }
            }, true /* suppress browser history entry */);
        },
        
        // Helper method to parse the current route hash
        _parseRouteHash: function(sHash) {
            // Split the hash into route and query parts
            var aParts = sHash.split('?');
            var sRoutePart = aParts[0];
            
            // Extract employeeId (assuming it's the last part of the route)
            var aRouteParts = sRoutePart.split('/');
            var sEmployeeId = aRouteParts[aRouteParts.length - 1];
        
            // Parse query parameters if they exist
            var oQuery = {};
            if (aParts[1]) {
                aParts[1].split('&').forEach(function(sParam) {
                    var aPair = sParam.split('=');
                    oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
                });
            }
        
            return {
                employeeId: sEmployeeId,
                query: oQuery
            };
        }
        
    });
});