var mapViewModelObject;
var infoWindowViewModelObject;




$(document).ready(function() {
	if($.isEmptyObject(mapViewModelObject)) {
		mapViewModelObject = new mapViewModel();
		ko.applyBindings(mapViewModelObject, document.getElementById("mapcontainer"));
	}

	if($.isEmptyObject(infoWindowViewModelObject)) {
		infoWindowViewModelObject = new infoWindowViewModel();
		ko.applyBindings(infoWindowViewModelObject, document.getElementById("infowindowdata"));
	}
});

