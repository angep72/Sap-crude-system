sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
  ], function (Controller, MessageToast) {
    "use strict";
    
    return Controller.extend("com.myorg.myapp.controller.Launchpad", {
      onInit: function () {
        // Initialization code, if any
      },
      
      onTilePress: function () {
        // Action to perform when a tile is pressed
        const oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("main");
      }
    });
  });
  