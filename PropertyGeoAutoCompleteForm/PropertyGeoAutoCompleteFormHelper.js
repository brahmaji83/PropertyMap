({
    displayOptionsLocation: function (component, searchKey) {

        //Call server and get auto suggestions
        var action = component.get("c.getAddressAutoComplete");
        action.setParams({
            "input": searchKey,
            "types": '(regions)'
        });
        
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //If success, set them as lookup dropdwon
                var options = JSON.parse(response.getReturnValue());
                var predictions = options.predictions;
                var addresses = [];
                if (predictions.length > 0) {
                    for (var i = 0; i < predictions.length; i++) {
                        addresses.push(
                            {
                                value: predictions[i].types[0],
                                label: predictions[i].description,
                                placeid: predictions[i].place_id
                            });
                    }
                    console.log(addresses);
                    component.set("v.filteredOptions", addresses);
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    //To open and close based on user selection
    openListbox: function (component, searchKey) {
        var searchLookup = component.find("searchLookup");
        
        if (typeof searchKey === 'undefined' || searchKey.length < 3)
        {
            $A.util.addClass(searchLookup, 'slds-combobox-lookup');
            $A.util.removeClass(searchLookup, 'slds-is-open');
            return;
        }
        
        $A.util.addClass(searchLookup, 'slds-is-open');
        $A.util.removeClass(searchLookup, 'slds-combobox-lookup');
    },
    
    //To clear the field
    clearComponentConfig: function (component) {
        var searchLookup = component.find("searchLookup");
        $A.util.addClass(searchLookup, 'slds-combobox-lookup');
        
        component.set("v.selectedOption", null);
        component.set("v.searchKey", null);
        
        var iconDirection = component.find("iconDirection");
        $A.util.removeClass(iconDirection, 'slds-input-has-icon_right');
        $A.util.addClass(iconDirection, 'slds-input-has-icon_left');
    },
    
    // To get the geo code with placeid
    getGeocodes : function(component, event, placeId){
                
        var action = component.get("c.getGeoCodeDetails");
        action.setParams({
            strPlaceId : placeId
        });
        action.setCallback(this, function(response){
            var options = JSON.parse(response.getReturnValue());
            var geometry = options.result.geometry;            
            console.log(geometry.location.lat);
            console.log(geometry.location.lng);
            
            //Fire Application event to send to Map       
            var appEvent = $A.get("e.c:AutoCompleteGeoCode");
            
            appEvent.setParams({
                lat : geometry.location.lat,
                lng : geometry.location.lng
            });
            
            appEvent.fire();
        //    $A.util.toggleClass(spinner, "slds-hide");
        });
        $A.enqueueAction(action);
    }
    
})