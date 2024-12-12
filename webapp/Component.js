sap.ui.define(
	[
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/v2/ODataModel",
	],
	function (UIComponent, Device, JSONModel, ODataModel) {
		"use strict";

		return UIComponent.extend("com.myorg.myapp.Component", {
			metadata: {
				manifest: "json",
			},

			init: function () {
				// Call the base component's init function
// call the init function of the parent
UIComponent.prototype.init.apply(this, arguments);

// create the views based on the url/hash
this.getRouter().initialize();
				// Set device model
				this.setModel(
					new JSONModel({
						isTouch: Device.support.touch,
						isPhone: Device.system.phone,
					}),
					"device"
				);

				// Initialize the OData model for product data
				const oModel = new ODataModel("http://localhost:3000/odata/", {
					maxDataServiceVersion: "3.0",
				});
				this.setModel(oModel, "productModel");
				


				// var oModel = new sap.ui.model.odata.v2.ODataModel(
				// 	"/path/to/odata/service"
				// );
				// this.getOwnerComponent().setModel(oModel, "productModel");

				// Initialize the router
				this.getRouter().initialize();
			},

			getContentDensityClass: function () {
				if (!this.contentDensityClass) {
					// Check if body already has the compact/cozy class
					if (
						document.body.classList.contains("sapUiSizeCozy") ||
						document.body.classList.contains("sapUiSizeCompact")
					) {
						this.contentDensityClass = "";
					} else if (!Device.support.touch) {
						this.contentDensityClass = "sapUiSizeCompact"; // Apply compact mode for non-touch devices
					} else {
						this.contentDensityClass = "sapUiSizeCozy"; // Apply cozy mode for touch devices
					}
				}
				return this.contentDensityClass;
			},
		});
	}
);
