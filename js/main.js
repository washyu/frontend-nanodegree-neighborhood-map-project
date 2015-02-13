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
				panControl: false,
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
			content: this.name
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
		self.get4sinfo(marker);
		marker.infoWindow.open(self.myMap, marker.marker);
	};

	self.toggleOpen = function() {
		$("#panel").toggleClass("open");
	};

	self.get4sinfo = function(marker){
		var url = 'https://api.foursquare.com/v2/venues/search?client_id=NFLHHJ350PG5BFEFQB2AZY2CJ3TUCUYR3Q14QPL5L35JT4WR&client_secret=WDNBZ4J3BISX15CF1MYOBHBP2RUSF2YSRLVPZ3F4WZUYZGWR&v=20130815&ll='
		 + marker.getLatLng().lat()
		 + ','
		 + marker.getLatLng().lng()
		 + '&query=\''
		 + marker.name
		 + '\'&limit=1';
	};
}

$(document).ready(function() {
	ko.applyBindings(new ViewModel());
});

