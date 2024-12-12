sap.ui.define(
	[
		"./BaseController",
		"sap/m/MessageBox",
		"sap/ui/core/UIComponent",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/v2/ODataModel",
	],
	function (Controller, MessageBox, UIComponent, JSONModel, ODataModel) {
		"use strict";

		return Controller.extend("com.myorg.myapp.controller.FlexibleListDetail", {
			onInit: function () {
				let oRouter = UIComponent.getRouterFor(this);
				oRouter.getRoute("productdescription").attachPatternMatched(this.onProductMatched, this);

				let oModel = new ODataModel("http://localhost:3000/odata", {
					maxDataServiceVersion: "3.0"
				});
				this.getView().setModel(oModel);

			},
			onNavBack: function () {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("main", {}, true);
			},
			onProductMatched: function (oEvent) {
				const sProductId = oEvent.getParameter("arguments").productId; // Ensure this is a valid ID

				const oModel = this.getView().getModel(); // Retrieve the current model from the view
				// // Read the product data from the OData service
				var sPath = "/Products(" + sProductId + ")?$expand=ProductDetail";
				var oBindingContext = oModel.createBindingContext(sPath);
				this.getView().setBindingContext(oBindingContext); // B

				oModel.read(`/Products(${sProductId})`, {
					success: (data) => {
						// this.getView().setModel(new JSONModel(data));
						this.byId("productidflex").setText(data.ID);
						this.byId("productDNameflex").setText(data.Name);
						this.byId("descriptionflex").setText(data.Description);
						// this.byId("productRating").setText("Rating: " + data.Rating);
						this.byId("supplierProduct").setText(
							data.ReleaseDate
						);
                        
					},
				});
			},
		});
	}
);
