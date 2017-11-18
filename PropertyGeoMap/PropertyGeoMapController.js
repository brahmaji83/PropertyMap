({
    jsLoaded: function(component, event, helper) {
        // console.log(component.get("v.recordId"));
        // console.log('after js load '+component.get("v.simpleRecord.Latitude__c"));
        // helper.getPropDetails(component, event);

        //Get the data from Lightning Data Service
        var propLatitude  = component.get("v.simpleRecord.Latitude__c");
        var propLongitude = component.get("v.simpleRecord.Longitude__c");

        if(propLatitude == null){
            // console.log('calling server');
            helper.getPropDetails(component, event);
            // console.log('it is null');            
        }
        else
        {
            helper.helperJSLoaded(component, event, propLatitude, propLongitude);
        }
       
    },

    //Go to searched location and add the marker
    handleGeoCode : function(component, event, helper) {
        console.log('handler invoked');
        console.log(event.getParam("lat"));
        var latLng = [event.getParam("lat"), event.getParam("lng")];
        
        // component.set("v.showMap", true);
   /*     var myCmp = component.find("mapAura");
        $A.util.removeClass(myCmp, "slds-hide");

        var myLocation = component.find("noLocation");
        $A.util.addClass(myLocation, "slds-hide");*/
       
        
        var map = component.get('v.map');

        map.panTo(latLng);

   /*     if($A.util.isEmpty(map)){
            // alert('inside if loop');
            helper.helperJSLoaded(component, event, event.getParam("lat"), event.getParam("lng"));
            
        }else{
          //  helper.helperJSLoaded(component, event, event.getParam("lat"), event.getParam("lng"));
            // alert('inside else loop');
            map.panTo(latLng);
        }
        */
        
    //    var marker = new L.Marker(latLng); //End
    //    map.addLayer(marker); 

        // L.marker(latLng).addTo(map);
    },
})