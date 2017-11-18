({
    handleApplicationEvent : function(component, event){
        console.log(event);
        console.log(event.getParam("lat"));
        component.set("v.latlng", event.getParam("lat")+' '+event.getParam("lng"));
        
    },
    
    //Call the server to update property with Latitude and Longitude details
    addToProperty : function(component, event){
        // alert('Dont worry, i will add '+component.get("v.latlng"));
        if($A.util.isEmpty(component.get("v.latlng"))){
            var addColor = component.find("addPropertymessage");
            $A.util.addClass(addColor, 'addRed');
            component.set("v.hasErrors", true);
        }else{
            component.set("v.hasErrors", false);
            
            console.log(component.get("v.recordId"));
            var action = component.get("c.updateProperty");
            console.log(component.get("v.latlng"));
            action.setParams({
                latlng : component.get("v.latlng"),
                propertyId : component.get("v.recordId")
            });
            action.setCallback(this, function(response){
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                dismissActionPanel.fire();
                
                if(response.getState() === 'SUCCESS'){
                    console.log('it is success from server');
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "type" : "success",
                        "message": "GeoCode is updated successfully."
                    });
                    toastEvent.fire();
                    $A.get('e.force:refreshView').fire();
                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "type":"error",
                        "message": "Dude, you are gone"
                    });
                    toastEvent.fire();
                }
            });        
            $A.enqueueAction(action);            
        }
        
    },
    
    closeQuickAction : function(component, event){
        $A.get("e.force:closeQuickAction").fire();
    }
})