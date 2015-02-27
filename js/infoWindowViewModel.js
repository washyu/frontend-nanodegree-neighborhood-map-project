function infoWindowViewModel() {
	var self = this;
	self.id = ko.observable();
	self.name = ko.observable();
	self.address = ko.observable();
	self.phone = ko.observable();
	self.twitter = ko.observable();
	self.isLoaded = ko.observable(false);

	self.s4VenueObject = ko.observableArray([]);
	self.s4TipsObject = ko.observable();

	self.infoWindow = new google.maps.InfoWindow({
		content: "Loading FourSquare data..."
	});

	google.maps.event.addListener(self.infoWindow, 'closeclick', function() {
		self.infoWindow.setContent("Loading FourSquare data...");
		self.isLoaded(false);
	}.bind(this));

	self.isLoaded.subscribe(function(newValue){
		if(newValue){
			self.infoWindow.setContent($('#infowindowdata').clone().html());
		}
	});


	self.load4sInfo = function(marker){
		var url = 'https://api.foursquare.com/v2/venues/search?'
		 + 'client_id=JBYUIJHUTG5EH0UGEXNEOF403IAEACBBNLM1TFPL4OC2PBM1'
		 + '&client_secret=SQT2NBDTODIVCOFWDGKHL1NCUCZ4TN045RR1EXVDUPQGCJGT&v=20130815'
		 + '&ll=' + marker.getLatLng().lat() + ',' + marker.getLatLng().lng()
		 + '&query=\'' + marker.name + '\''
		 + '&limit=1';

		$.getJSON(url)
		 	.done(function(response){
		 		venue = response.response.venues[0];
		 		self.id(venue.id);
		 		self.name(venue.name);
		 	    self.address(((venue.location.formattedAddress !== null && venue.location.formattedAddress !== undefined) ? venue.location.formattedAddress.join(' ') : "No address listed"));
		 		self.phone(((venue.contact.formattedPhone !== null && venue.contact.formattedPhone !== undefined) ? venue.contact.formattedPhone : "No number listed"));
		 		self.twitter(((venue.contact.twitter !== null && venue.contact.twitter !== undefined) ? '@'+venue.contact.twitter : "No twitter handle listed"));
		 		self.isLoaded(true);
		 	})
		 	.fail(function(){
		 		console.log('There was an issue getting the FourSquare data.');
		 	});
	}


}