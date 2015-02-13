var Model = function() {

	var location = {
		"lat": 47.175833,
		"lng": -122.293611
	};

	var markers = [
		{
			latLng: new google.maps.LatLng(47.186302, -122.298753),
			name: "Sparks Firehouse Deli",
			searchString: "food sanwich pizza",
			draggable: false
		},
		{
			latLng: new google.maps.LatLng(47.184819, -122.293985),
			name: "Cattin's Family Dining",
			searchString: "food family",
			draggable: false
		},
		{
			latLng: new google.maps.LatLng(47.157011, -122.293689),
			name: "Panera Bread",
			searchString: "food soup sanwich",
			draggable: false
		},
		{
			latLng: new google.maps.LatLng(47.158543, -122.291533),
			name: "Black Angus Steakhouse",
			searchString: "food steak",
			draggable: false
		}
	];

	var aMap = function() {
		this.zoom = 13;

		this.mapOptions = {
				disableDefaultUI: true,
				center: new google.maps.LatLng(location.lat, location.lng),
				zoom: this.zoom,
				draggable: false
			};

		this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);
	};

	this.getMarkers = function() {
		return markers;
	};

	this.getMap = function() {
		var map = new aMap();
		return map.map;
	};

};

var ViewModel = function() {
	var self = this;
	self.model = new Model();
	self.myMap = self.model.getMap();
	self.myMarkers = ko.observableArray([]);

	self.markerObject = function(markerData) {
		this.markerData = markerData;
		this.name = this.markerData.name;
		this.searchString = this.markerData.searchString;
		this.hovered = ko.observable(false);
		this.styleIcon = new StyledIcon(StyledIconTypes.MARKER,{color:"#f00"});
		this.infoWindow = new google.maps.InfoWindow({
			content: "Loading FourSquare data..."
		});

		this.marker = new StyledMarker({
				styleIcon: this.styleIcon,
				map: self.myMap,
				position: this.markerData.latLng,
				title: this.name,
				draggable: markerData.draggable
		});

		google.maps.event.addListener(this.marker, 'mouseover', function() {
			self.mouseOver(this);
		}.bind(this));

		google.maps.event.addListener(this.marker, 'mouseout', function() {
			self.mouseOut(this);
		}.bind(this));

		google.maps.event.addListener(this.marker, 'click', function() {
			self.mouseClick(this);
		}.bind(this));

		this.getLatLng = function() {
			return this.markerData.latLng;
		};
	};

	self.model.getMarkers().forEach(function(marker){
		self.myMarkers.push(new self.markerObject(marker));
	});

	self.mouseOver = function(marker) {
		if(!marker.hovered()) {
			marker.hovered(true);
		}
		marker.styleIcon.set("color", "#5e94ff");
	};

	self.mouseOut = function(marker) {
		if(marker.hovered()) {
			marker.hovered(false);
		}
		marker.styleIcon.set("color", "#f00");
	};

	self.mouseClick = function(marker) {
		marker.infoWindow.content = self.get4sinfo(marker);
		marker.infoWindow.open(self.myMap, marker.marker);
	};

	self.toggleOpen = function() {
		$("#panel").toggleClass("open");
	};

	self.get4sinfo = function(marker){
		var url = 'https://api.foursquare.com/v2/venues/search?'
		 + 'client_id=JBYUIJHUTG5EH0UGEXNEOF403IAEACBBNLM1TFPL4OC2PBM1'
		 + '&client_secret=SQT2NBDTODIVCOFWDGKHL1NCUCZ4TN045RR1EXVDUPQGCJGT&v=20130815'
		 + '&ll=' + marker.getLatLng().lat() + ',' + marker.getLatLng().lng()
		 + '&query=\'' + marker.name + '\''
		 + '&limit=1';

		 $.getJSON(url)
		 	.done(function(response){
		 		var tempString = '<p>FourSquare Info:<br>';
		 		var venueObject = response.response.venues[0];
		 		var venueId = venueObject.id;
		 		tempString += 'Name: ' + ((venueObject.name !== null && venueObject.name !== undefined) ? venueObject.name : marker.name) + '<br>';
		 		tempString += 'Phone: ' + ((venueObject.contact.formatedPhone !== null && venueObject.contact.formatedPhone !== undefined) ? venueObject.contact.formatedPhone : 'No Number Listed') + '<br>';
		 		marker.infoWindow.setContent(tempString);
		 	})
		 	.fail(function(){
		 		marker.infoWindow.setContent('There was an issue getting the FourSquare data.');
		 	});
	};
}

$(document).ready(function() {
	ko.applyBindings(new ViewModel());
});

