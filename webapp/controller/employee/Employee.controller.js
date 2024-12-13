sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.myorg.myapp.controller.employee.Employee", {

        onInit: function () {
            // Create a new JSON model instance
            var oModel = new JSONModel();

            // Load the data from mockdata.json file
            oModel.loadData("model/Employees.json");

            // Set the model to the view
            this.getView().setModel(oModel);

            // You can directly access the model data if needed
            var oData = oModel.getData();  // This gets the raw data from the model
            console.log(oData);  // Log the data to the console
        },
        onNavBackToHome: function () {
            const oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("home")

        },
        onListItemPressed: function (oEvent) {
            var oSelectedItem = oEvent.getSource(); // The selected list item (or table row)

            // Retrieve the binding context for the selected item
            var oBindingContext = oSelectedItem.getBindingContext();

            // Access the EmployeeID from the binding context, assuming the property is called 'EmployeeID'
            const employeeID = oBindingContext.getProperty("EmployeeID");
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("employeeDetail", {
                EmployeeID: employeeID
            })
        }

    });
});
