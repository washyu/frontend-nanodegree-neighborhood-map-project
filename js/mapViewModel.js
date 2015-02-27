function Model() {

	var Puyallup = new google.maps.LatLng(47.175833, -122.293611);

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
				center: Puyallup,
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

function mapViewModel() {

	var self = this;
	self.model = new Model();
	self.myMap = self.model.getMap();
	self.myMarkers = ko.observableArray();
	self.selectedMarker = ko.observable();

	google.maps.InfoWindow.prototype.isOpen = function() {
		return(this.getMap() !== null && this.getMap() !== undefined);
	};

	self.markerObject = function(markerData) {
		this.markerData = markerData;
		this.name = this.markerData.name;
		this.searchString = this.markerData.searchString;
		this.hovered = ko.observable(false);
		this.styleIcon = new StyledIcon(StyledIconTypes.MARKER,{color:"#f00"});


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

	self.selectedMarker.subscribe(function(newValue){
		infoWindowViewModelObject.load4sInfo(newValue);
	});

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
		if(infoWindowViewModelObject.infoWindow.isOpen())
		{
			infoWindowViewModelObject.infoWindow.setContent("Loading FourSquare data...");
			infoWindowViewModelObject.infoWindow.close();
			infoWindowViewModelObject.isLoaded(false);
		}
		self.selectedMarker(marker);
		infoWindowViewModelObject.infoWindow.open(self.myMap, self.selectedMarker().marker);
	};

	self.toggleOpen = function() {
		$("#panel").toggleClass("open");
	};
};