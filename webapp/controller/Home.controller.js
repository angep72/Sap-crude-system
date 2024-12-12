sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.myorg.myapp.controller.Home", {

        onInit() {


        },
        onDisplayNotFound: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("notfound");
        },
        onNavBack: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("main", {}, true);
        },
        onNavToEmployees:function(){
            const oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("employee")
         
        }
    });


});