sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/library"
], function(Controller, JSONModel, MessageBox, coreLibrary) {
    "use strict";

    var ValueState = coreLibrary.ValueState;

    return Controller.extend("com.myorg.myapp.controller.Validate", {
        onInit: function() {
            // Initialize model for form data
            var oModel = new JSONModel({
                name: "",
                email: "",
                age: null
            });
            this.getView().setModel(oModel, "formData");
        },

        onOpenDialog: function() {
            // Use this to open the dialog defined in the fragment
            var oView = this.getView();
            var oDialog = oView.byId("validationDialog");
            
            // If dialog doesn't exist, it might be in a fragment
            if (!oDialog) {
                // Load the fragment if not already loaded
                if (!this._oDialog) {
                    this._oDialog = sap.ui.xmlfragment(oView.getId(), "com.myorg.myapp.view.ValidationDialog", this);
                    oView.addDependent(this._oDialog);
                }
                this._oDialog.open();
            } else {
                oDialog.open();
            }
        },

        onSubmit: function() {
            var oModel = this.getView().getModel("formData");
            var oData = oModel.getData();
            var bValidationError = false;

            // Get the dialog
            var oDialog = this.byId("validationDialog");

            // Find inputs within the dialog (adjust selectors as needed)
            var oNameInput = this.byId("nameInput");
            var oEmailInput = this.byId("emailInput");
            var oAgeInput = this.byId("ageInput");

            // Name validation
            if (!oData.name || oData.name.trim() === "") {
                oNameInput.setValueState(ValueState.Error);
                oNameInput.setValueStateText("Name is required");
                bValidationError = true;
            } else {
                oNameInput.setValueState(ValueState.None);
            }

            // Email validation
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!oData.email || !emailRegex.test(oData.email)) {
                oEmailInput.setValueState(ValueState.Error);
                oEmailInput.setValueStateText("Please enter a valid email");
                bValidationError = true;
            } else {
                oEmailInput.setValueState(ValueState.None);
            }

            // Age validation
            if (!oData.age || isNaN(oData.age) || oData.age < 18 || oData.age > 100) {
                oAgeInput.setValueState(ValueState.Error);
                oAgeInput.setValueStateText("Age must be between 18 and 100");
                bValidationError = true;
            } else {
                oAgeInput.setValueState(ValueState.None);
            }

            // If no validation errors, submit the form
            if (!bValidationError) {
                MessageBox.success("Form submitted successfully!\n" + 
                    "Name: " + oData.name + "\n" +
                    "Email: " + oData.email + "\n" +
                    "Age: " + oData.age
                );
                this.onCloseDialog();
            }
        },
        onBack:function(){
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("home");
        },

        onCloseDialog: function() {
            // Use this method to close the dialog
            var oDialog = this.byId("validationDialog");
            if (oDialog) {
                oDialog.close();
            } else if (this._oDialog) {
                this._oDialog.close();
            }
        }
    });
});