sap.ui.define([
    "sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.nav.controller.NotFound", {

		onInit: function () {

		},
        onNavBack : function () {
			var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("main")
		}

	});

});
