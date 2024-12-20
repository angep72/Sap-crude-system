sap.ui.define(
	[
		"./BaseController",
		"sap/m/MessageBox",
		"sap/ui/model/odata/v2/ODataModel",
		"sap/ui/model/Sorter",
		"sap/f/LayoutType", 
		 "sap/f/library",
		 "sap/ui/model/Filter",
		 "sap/m/MessageToast",          // Import MessageToast from sap.m

	],
	function (BaseController, MessageBox, ODataModel,Sorter,LayoutType,fLibrary,Filter,MessageToast) {
		"use strict";

		return BaseController.extend("com.myorg.myapp.controller.Main", {
			onInit: function () {
				let oModel = new ODataModel("http://localhost:3000/odata", {
					defaultBindingMode: "TwoWay",
					useBatch: false,
					headers: {
						"Content-Type": "application/atom+xml",
					},
					json: false,
					maxDataServiceVersion: "3.0",
				});
			
				var oView = this.getView().setModel(oModel);
				oModel.read("/Products", {
					success(data) {
						console.log("Products data: ", data);
					},
					error(error) {
						console.log("Error fetching products: ", error);
					}
				});
			
				this.oSF = oView.byId("searchField");
			},
			
			onSuggest: function (event) {
				// Get the value entered in the SearchField
				var sValue = event.getParameter("suggestValue"),
					aFilters = [];
			
				// Get the SearchField control dynamically if not initialized
				this.oSF = this.oSF || this.byId("searchField");
			
				// Check if there is any value entered
				if (sValue) {
					// Create filters for both 'ID' and 'Name' fields
					aFilters = [
						new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.Contains, sValue),
						new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue)
					];
				} else {
					// If no value entered, clear the filter to show all items
					aFilters = [];
				}
			
				// Apply the filter to the suggestionItems aggregation
				var oBinding = this.oSF.getBinding("suggestionItems");
				if (oBinding) {
					oBinding.filter(aFilters);
				}
			
				// Suggest the items only if there is a valid search value or filter
				if (sValue) {
					this.oSF.suggest();
				}
			},
			
			onSearch: function (event) {
				var oItem = event.getParameter("suggestionItem");
				console.log(oItem);
				if (oItem) {
					MessageToast.show("Search for: " + oItem.getText());
				} else {
					MessageToast.show("Search is fired!");
				}
			}
,			
			
			
			validateProductId: function(oEvent) {
				const input = oEvent.getSource();
				const value = input.getValue();
				
				if (!/^\d+$/.test(value)) {
					input.setValueState("Error");
					return false;
				}
				
				input.setValueState("None");
				return true;
			},
			validateProductName: function(oEvent) {
				const input = oEvent.getSource();
				const value = input.getValue();
				
				if (value.length < 10 || value.length > 45) {
					input.setValueState("Error");
					return false;
				}
				
				input.setValueState("None");
				return true;
			},
			validateRating: function(oEvent) {
				const input = oEvent.getSource();
				const value = parseFloat(input.getValue());
				
				if (isNaN(value) || value < 1 || value > 10) {
					input.setValueState("Error");
					return false;
				}
				
				input.setValueState("None");
				return true;
			},
			validatePrice: function(oEvent) {
            const input = oEvent.getSource();
            const value = parseFloat(input.getValue());
            
            if (isNaN(value) || value < 100 || value > 1000) {
                input.setValueState("Error");
                return false;
            }
            
            input.setValueState("None");
            return true;
        },
            

			onFlexibleColumn:function(){

				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("flexible");
			},
			onHome:function(){
                var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("home");
			},
			onListItemPress:function(oEvent){
				var oSelectedItem = oEvent.getSource(); // The selected list item (or table row)

				// Retrieve the binding context for the selected item
				var oBindingContext = oSelectedItem.getBindingContext();
				console.log(oBindingContext)

				// Access the productId from the binding context, assuming the property is called 'productId'
				const productId = oBindingContext.getProperty("ID");
				let flexibleColumn = this.getView().getParent().getParent();
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("productdescription", {
					productId: productId,
				},false);
             
			  flexibleColumn.setLayout(LayoutType.TwoColumnsMidExpanded)
			},
			
			onProductSelect: function (oEvent) {
				var oSelectedItem = oEvent.getSource(); // The selected list item (or table row)

				// Retrieve the binding context for the selected item
				var oBindingContext = oSelectedItem.getBindingContext();

				// Access the productId from the binding context, assuming the property is called 'productId'
				const productId = oBindingContext.getProperty("ID");
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("productdescription", {
					productId: productId,
				});
			},

			onOpenDialog: function () {
				this.byId("creatingpost").open();
			},
			onCloseDialog: function () {
				this.byId("creatingpost").close();
			},
			formatDateForOData(date) {
				if (!date) return null;
				// If it's already a Date object, use it; otherwise create a new Date
				const d = date instanceof Date ? date : new Date(date);
				// Format: YYYY-MM-DD
				return (
					d.getFullYear() +
					"-" +
					String(d.getMonth() + 1).padStart(2, "0") +
					"-" +
					String(d.getDate()).padStart(2, "0")
				);
			},
			onCreatePost: function () {
				const ID = this.byId("productID").getValue();
				const Name = this.byId("productName").getValue();
				const Rating = this.byId("rating").getValue();
				const Price = this.byId("price").getValue();
				const ReleaseDate = this.formatDateForOData(
					this.byId("newProductReleaseDate").getValue()
				);
				
				

				const atomXml = `<?xml version="1.0" encoding="utf-8"?>
<entry xml:base="https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/" xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:georss="http://www.georss.org/georss" xmlns:gml="http://www.opengis.net/gml">
    <id>https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/Products(1)</id>
    <category term="ODataDemo.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />
    <link rel="edit" title="Product" href="Products(1)" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Categories" type="application/atom+xml;type=feed" title="Categories" href="Products(1)/Categories" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Supplier" type="application/atom+xml;type=entry" title="Supplier" href="Products(1)/Supplier" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/ProductDetail" type="application/atom+xml;type=entry" title="ProductDetail" href="Products(1)/ProductDetail" />
    <title type="text">${Name}</title>
    <summary type="text">Low fat milk</summary>
    <updated>${new Date().toISOString()}</updated>
    <author>
        <name />
    </author>
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks/Categories" type="application/xml" title="Categories" href="Products(1)/$links/Categories" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks/Supplier" type="application/xml" title="Supplier" href="Products(1)/$links/Supplier" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks/ProductDetail" type="application/xml" title="ProductDetail" href="Products(1)/$links/ProductDetail" />
    <m:action metadata="https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/$metadata#DemoService.Discount" title="Discount" target="https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/Products(1)/Discount" />
    <content type="application/xml">
        <m:properties>
            <d:ID m:type="Edm.Int32">${ID}</d:ID>
            <d:ReleaseDate m:type="Edm.DateTime">${ReleaseDate}</d:ReleaseDate>
            <d:DiscontinuedDate m:null="true" />
            <d:Rating m:type="Edm.Int16">${Rating}</d:Rating>
            <d:Price m:type="Edm.Double">${Price}</d:Price>
        </m:properties>
    </content>
</entry>`;

				fetch("http://localhost:3000/odata/Products", {
					method: "POST",
					headers: {
						"Content-Type": "application/atom+xml",
					},
					body: atomXml,
				})
					.then((response) => {
						if (!response.ok) {
							return response.text().then((errorText) => {
								throw new Error(
									`HTTP error! Status: ${response.status} - ${errorText}`
								);
							});
						}
						MessageBox.success("Product created successfully!");
						this.onCloseDialog();
						this.getView().getModel().refresh(true);
					})
					.catch((error) => {
						MessageBox.error("Error creating product: " + error.message);
					});
			},
			onEditSupplier: function (oEvent) {
				const button = oEvent.getSource();
				const listItem = button.getParent();
				const context = listItem.getBindingContext();
				const productData = context.getObject();

				this._selectedProductId = productData.ID;

				const dialog = this.byId("updateDialog");
				this.byId("ID").setValue(productData.ID);
				this.byId("updateproductName").setValue(productData.Name);
				this.byId("updatePrice").setValue(productData.Price);
				this.byId("updaterating").setValue(productData.Rating);
				this.byId("updateDate").setValue(productData.ReleaseDate);

				dialog.open();
			},

			onCloseEditingDialog: function () {
				this.byId("updateDialog").close();
				// const dialog = this.byId("onEditing");
				// this.byId("productNameText").setValue(productData.Name);
				// this.byId("description").setValue(productData.description);
			},
			onUpdatingDialog: function () {
				const productId = this._selectedProductId;

				const Name = this.byId("updateproductName").getValue();
				const Rating = this.byId("updaterating").getValue();
				const Price = this.byId("updatePrice").getValue();
				const ReleaseDate = this.formatDateForOData(
					this.byId("updateDate").getValue()
				);

				const atomXml = `<?xml version="1.0" encoding="utf-8"?>
<entry xml:base="https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/" xmlns="http://www.w3.org/2005/Atom" xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns:georss="http://www.georss.org/georss" xmlns:gml="http://www.opengis.net/gml">
    <id>https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/Products(1)</id>
    <category term="ODataDemo.Product" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme" />
    <link rel="edit" title="Product" href="Products(1)" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Categories" type="application/atom+xml;type=feed" title="Categories" href="Products(1)/Categories" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/Supplier" type="application/atom+xml;type=entry" title="Supplier" href="Products(1)/Supplier" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/ProductDetail" type="application/atom+xml;type=entry" title="ProductDetail" href="Products(1)/ProductDetail" />
    <title type="text">${Name}</title>
    <summary type="text">Low fat milk</summary>
    <updated>${new Date().toISOString()}</updated>
    <author>
        <name />
    </author>
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks/Categories" type="application/xml" title="Categories" href="Products(1)/$links/Categories" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks/Supplier" type="application/xml" title="Supplier" href="Products(1)/$links/Supplier" />
    <link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/relatedlinks/ProductDetail" type="application/xml" title="ProductDetail" href="Products(1)/$links/ProductDetail" />
    <m:action metadata="https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/$metadata#DemoService.Discount" title="Discount" target="https://services.odata.org/V3/(S(hzn4vwyj2pljjfroa0zssf5s))/OData/OData.svc/Products(1)/Discount" />
    <content type="application/xml">
        <m:properties>
            <d:ID m:type="Edm.Int32">${productId}</d:ID>
            <d:ReleaseDate m:type="Edm.DateTime">${ReleaseDate}</d:ReleaseDate>
            <d:DiscontinuedDate m:null="true" />
            <d:Rating m:type="Edm.Int16">${Rating}</d:Rating>
            <d:Price m:type="Edm.Double">${Price}</d:Price>
        </m:properties>
    </content>
</entry>`;

				fetch(`http://localhost:3000/odata/Products(${productId})`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/atom+xml",
					},
					body: atomXml,
				})
					.then((response) => {
						if (!response.ok) {
							return response.text().then((errorText) => {
								throw new Error(
									`HTTP error! Status: ${response.status} - ${errorText}`
								);
							});
						}
						MessageBox.success("Product updated successfully!");
						this.onCloseEditingDialog();
						this.getView().getModel().refresh(true);
					})
					.catch((error) => {
						MessageBox.error("Error updating product: " + error.message);
					});
			},

			onCloseDeleteDialog: function () {
				this.byId("DeleteDialog").close();
				// DeleteDialog: function () {
			},

			onDelete: function (oEvent) {
				this.onCloseDeleteDialog();
				const item = oEvent.getSource().getParent(); // Get the item that triggered the event
				const context = item.getBindingContext(); // Get the binding context of the item
				const productId = context.getObject().ID; // Get the product ID from the context

				// Store the product ID in the controller for later use
				this._productIdToDelete = productId;

				// Open the confirmation dialog
				var oDialog = this.byId("DeleteDialog");
				oDialog.open();
			},
			onConfirmDelete: function () {
				this.byId("DeleteDialog").close();
				var productId = this._productIdToDelete; // Retrieve the stored product ID

				const oModel = this.getView().getModel(); // Get the model

				oModel.remove(`/Products(${productId})`, {
					success: function () {
						MessageBox.success("Product deleted successfully!");
					},
					error: function (error) {
						MessageBox.error("Error deleting product: " + error.message);
					},
				});
			},
			// onSearch: function (oEvent) {
			// 	const sQuery = oEvent.getParameter("query");
			// 	const oList = this.byId("suppliersTable"); // Get the List control
			// 	// Create a filter for the search query
			// 	const oFilter = new sap.ui.model.Filter({
			// 		path: "Name", // The field to search
			// 		operator: sap.ui.model.FilterOperator.Contains, // Use contains for partial matching
			// 		value1: sQuery, // The search string entered by the user
			// 	});
			// 	const oBinding = oList.getBinding("items");
			// 	oBinding.filter(oFilter);

			// 	// If no query is entered, clear the filter to show all items
			// 	if (!sQuery) {
			// 		oBinding.filter([]);
			// 	}
			// },
			onSortChange: function () {
				var oTable = this.byId("suppliersTable");
				var oBinding = oTable.getBinding("items");

				// Create a sorter for sorting by Name in ascending order
				var oSorter = new Sorter("Name", false); // false means ascending

				// Apply the sorter
				oBinding.sort(oSorter);
			},
		});
	}
);
