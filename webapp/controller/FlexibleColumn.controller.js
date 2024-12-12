sap.ui.define([
    "sap/ui/core/mvc/controller",

], function (Controller) {
    "use strict"
    return Controller.extend("com.myorg.myapp.controller.flexibleColumn", {
        onInit: function () {
            const productModel = this.getOwnerComponent().getModel("productModel");
            this.getView().setModel(productModel)
            
        }
    })
})