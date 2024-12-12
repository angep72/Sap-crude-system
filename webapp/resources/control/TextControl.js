sap.ui.define([
    "sap/ui/core/Control", // Base control for custom control
    "sap/m/Text" // Standard Text control (optional, in case you want to extend or reuse it)
], function(Control, Text) {
    "use strict";

    return Control.extend("your.com.myorg.myapp.control.TextControl", {

        metadata: {
            properties: {
                "text": { type: "string", defaultValue: "" },
                "color": { type: "string", defaultValue: "black" }
            },
            events: {
                "press": {}
            }
        },

        init: function () {
            // Initialization logic if needed
            console.log("TextControl initialized");
        },

        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.writeStyles();
            oRM.addStyle("color", oControl.getColor());
            oRM.write(">");

            oRM.writeEscaped(oControl.getText()); // Rendering the text content

            oRM.write("</div>");
        }
    });
});
