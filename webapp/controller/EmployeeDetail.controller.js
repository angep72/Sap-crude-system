sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.myorg.myapp.controller.EmployeeDetail", {

        onInit: function () {
            // Get the product ID from the route
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("employee").attachPatternMatched(this._onRouteMatched, this);
          },

          _onRouteMatched: function (oEvent) {
            var sProductId = oEvent.getParameter("arguments").EmployeeID;
            
            // Set the binding path to the product details based on the ID
            var oModel = this.getView().getModel();
            var oProduct = oModel.getProperty("/Employees").find(function (product) {
              return product.id === sProductId;
            });
            
            if (oProduct) {
              this.getView().bindObject({
                path: "/" + this.getProductIndex(sProductId),
                model: "Employees"
              });
            }
          },
          getProductIndex: function (sProductId) {
            var oModel = this.getView().getModel();
            var aProducts = oModel.getProperty("/Employees");
            return aProducts.findIndex(function (product) {
              return product.id === sProductId;
            });
          },
          onShowResume:function(){
            var oCtx = this.getView().getBindingContext();

			this.getRouter().navTo("employeeResume", {
				employeeId : oCtx.getProperty("EmployeeID")
			});
          }

		// _onBindingChange : function (oEvent) {
		// 	// No data for the binding
		// 	if (!this.getView().getBindingContext()) {
		// 		this.getRouter().getTargets().display("notFound");
		// 	}
		// },

		// onShowResume : function (oEvent) {
		// 	var oCtx = this.getView().getBindingContext();

		// 	this.getRouter().navTo("employeeResume", {
		// 		employeeId : oCtx.getProperty("EmployeeID")
		// 	});
		// }

	});

});
