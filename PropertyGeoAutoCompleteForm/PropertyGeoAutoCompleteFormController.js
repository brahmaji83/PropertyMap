({
    keyPressController: function (component, event, helper) {
        //Get the key pressed and search data
        var searchKey = component.get("v.searchKey");
        
        helper.openListbox(component, searchKey);
        helper.displayOptionsLocation(component, searchKey);
    },
    
    selectOption: function (component, event, helper) {
        //Required data is stored in data set of li elements. Parsing the data here
        var selectedItem = event.currentTarget.dataset.record;
        // console.log(selectedItem);
        var selectedValue = event.currentTarget.dataset.value;
        // console.log(selectedValue);
        
        component.set("v.selectedOption", selectedItem);
        
        console.log(event.currentTarget.dataset.placeid); 
        var placeid = event.currentTarget.dataset.placeid;
        
        var searchLookup = component.find("searchLookup");
        $A.util.removeClass(searchLookup, 'slds-is-open');
        
        var iconDirection = component.find("iconDirection");
        $A.util.removeClass(iconDirection, 'slds-input-has-icon_left');
        $A.util.addClass(iconDirection, 'slds-input-has-icon_right');
        
        component.set("v.searchKey", selectedItem);
        //To get the longitude and lattitude
        helper.getGeocodes(component, event, placeid);
        
    },
    
    clear: function (component, event, helper) {
        //To clear the form text field
        helper.clearComponentConfig(component);
    }
    
})