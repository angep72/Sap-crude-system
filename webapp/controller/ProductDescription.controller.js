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

		return Controller.extend("com.myorg.myapp.controller.ProductDescription", {
			onInit: function () {
				let oRouter = UIComponent.getRouterFor(this);
				oRouter
					.getRoute("productdescription")
					.attachPatternMatched(this.onProductSelect, this);

				let oModel = new ODataModel("http://localhost:3000/odata", {
					maxDataServiceVersion: "3.0",
				});
				this.getView().setModel(oModel);
			},
			onNavBack: function () {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("main", {}, true);
			},
			onProductSelect: function (oEvent) {
				const sProductId = oEvent.getParameter("arguments").productId; // Ensure this is a valid ID
				// if (sProductId) {
				// 	console.log(sProductId); // Call your method to load the product details
				// } else {
				// 	console.error("Invalid Product ID");
				// }
				// const productId = oArguments.ID;
				const oModel = this.getView().getModel(); // Retrieve the current model from the view

				// // Read the product data from the OData service
				var sPath = "/Products(" + sProductId + ")?$expand=ProductDetail";
				console.log(sPath);
				var oBindingContext = oModel.createBindingContext(sPath);
				this.getView().setBindingContext(oBindingContext); // B

				oModel.read(`/Products(${sProductId})`, {
					success: (data) => {
						// this.getView().setModel(new JSONModel(data));
						this.byId("productDId").setText(data.ID);
						 this.byId("productDName").setText( data.Name);
						this.byId("description").setText(data.Description);
						// this.byId("productRating").setText("Rating: " + data.Rating);
						 this.byId("Drelease").setText(
								data.ReleaseDate
							);
					},
				});
			},
		});
	}
);
