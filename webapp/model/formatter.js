sap.ui.define([], function () {
	"use strict";

	return {
		// Format price with currency
		formatPrice: function (price) {
			return price ? `${price.toFixed(2)} €` : "N/A";
		},

		// Format date
		formatDate: function (date) {
			if (!date) return "N/A";
			return new Date(date).toLocaleDateString();
		},

		// Conditional formatting
		getStatusState: function (status) {
			switch (status) {
				case "Active":
					return "Success";
				case "Inactive":
					return "Error";
				default:
					return "None";
			}
		},
	};
});
