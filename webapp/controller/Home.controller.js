sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";

    return Controller.extend("com.myorg.myapp.controller.Home", {

        onInit: function () {
            // Initialization logic if needed
        },

        onDisplayNotFound: function () {
            // Get the router instance
            var oRouter = UIComponent.getRouterFor(this);

            // Correctly call getTargets() on the router instance
            oRouter.getTargets().display("notFound", {
                fromTarget: "main"
            });
        },

        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("main", {}, true); // Navigate to main
        },

        onNavToEmployees: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("employee"); // Navigate to employee
        },
        onValidDialog:function(){
           var oRouter = this.getOwnerComponent().getRouter()
           oRouter.navTo("validate")
        }

    });
});
