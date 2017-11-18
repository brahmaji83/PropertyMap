({
	helperJSLoaded : function(component, event, propLatitude, propLongitude){
                
        var latLng = [propLatitude, propLongitude];  
        console.log(latLng);

        // var latLng;
        var marker;        
        
        //To set the default view when the map is loaded
        var map = L.map('map', {zoomControl: true}).setView([37.784173, -122.401557], 14);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(map);
        
        //Add the map to div element
        component.set("v.map", map);               
        console.log('maps is set now');
        
        ///Added
        map.setView(latLng);            
        marker = new L.Marker(latLng); //End
        map.addLayer(marker);         

        //To popup the lat and long
        var popup = L.popup();   

        //set this to helper variable to invoke fireevent method
        var helper = this;
        //Listen the click event on map        
        map.on('click', function(ev){    
            console.log(marker);
            if(marker){
                console.log('entered if loop');
                map.removeLayer(marker); // remove
            }
            marker = new L.Marker(ev.latlng);
            marker.addTo(map);       

            //    map.removeLayer(marker)                 
            helper.fireEvent(component, event, ev.latlng.lat, ev.latlng.lng);
        });
    },

    fireEvent : function(component, event, lat, lng){
        console.log('entered fire event'+lat +lng);
        // Fire an application event to send the details to PropertyGeoSelection
        var appEvent = $A.get("e.c:LatLngEvent");
        appEvent.setParams({
            lat : lat,
            lng : lng
        });
        appEvent.fire();
    },

    getPropDetails : function(component, event){
        console.log('entered helper');
        var action = component.get("c.getGeoCodeOfProperty");
        action.setParams({
            propertyId : component.get("v.recordId")
        });
        action.setCallback(this, function(response){

            if(response.getState() === 'SUCCESS'){
                console.log(response.getReturnValue());
                component.set("v.propObject", response.getReturnValue());

                var propLatitude = component.get("v.propObject.Latitude__c");
                var propLongitude = component.get("v.propObject.Longitude__c");

                //Load the map after server response only if GeoCode is not empty
                if(! $A.util.isEmpty(propLatitude) && ! $A.util.isEmpty(propLongitude)){
                    // component.set("v.showMap", true);
                   /* var myCmp = component.find("mapAura");
                    $A.util.removeClass(myCmp, "slds-hide");

                    var myLocation = component.find("noLocation");
                    $A.util.addClass(myLocation, "slds-hide");*/

                    this.helperJSLoaded(component, event, propLatitude, propLongitude);
                }else{

                    alert($A.get("$Label.c.NoLocationDetected"));
                   
                    this.helperJSLoaded(component, event, 37.784173, -122.401557);
                    /*// var map = L.map('map', {zoomControl: true}).setView([37.784173, -122.401557], 14);
                    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(map);

                    var myCmp = component.find("mapAura");
                    $A.util.addClass(myCmp, "slds-hide");

                    var myLocation = component.find("noLocation");
                    $A.util.removeClass(myLocation, "slds-hide");
                    // component.set("v.showMap", false);*/
                }
                
                // this.helperJSLoaded(component, event, propLatitude, propLongitude);
            }else{
                $A.get("e.force:closeQuickAction").fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",                    
                    "type" : "error",
                    "message": "Please contact your admin"
                });
                toastEvent.fire();

            }
            
        });
        $A.enqueueAction(action);
    }
})