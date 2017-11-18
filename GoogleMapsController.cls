/**************************************************************************************
Apex Class Name : GoogleMapsController 
Version         : 1.0 
Created Date    : 14 November 2017
Function        : Handler Class for Property Google Maps
Modification Log :
-----------------------------------------------------------------------------
* Developer                   Date                   Description
* ----------------------------------------------------------------------------                 
*Brahmaji Tammana           14 Nov 2017         Original Version
*************************************************************************************/
public class GoogleMapsController {

    /*
    Method Name     : getAddressAutoComplete
    Purpose         : To get the autocomplete suggestions from google api
    Created By      : Brahmaji Tammana
    Created Date    : 14 Nov 2017
    */
    @AuraEnabled
    public static string getAddressAutoComplete(String input, String types) {        

        Http http = new Http();
        String url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='
        + EncodingUtil.urlEncode(input, 'UTF-8')
                    //    + '&types=' + 'establishment'
                    + '&key=AIzaSyCbHqLlNtWBRhztLE0SdbyY249lI8wt7-w';
        HttpRequest req = new HttpRequest();
        HttpResponse res = null;
        req.setEndPoint(url);
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept','application/json');
        res = http.send(req);
        System.debug(res.getBody());
        return res.getBody();
    }

    /*
    Method Name     : getGeoCodeDetails
    Purpose         : To get the GeoCode (Latitude and Longitude) based on placeid
    Created By      : Brahmaji Tammana
    Created Date    : 14 Nov 2017
    */
    @AuraEnabled
    public static String getGeoCodeDetails(String strPlaceId){
        Http http = new Http();
        String url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid='+strPlaceId+
        + '&key=AIzaSyCbHqLlNtWBRhztLE0SdbyY249lI8wt7-w';
        HttpRequest req = new HttpRequest();
        HttpResponse res = null;
        req.setEndPoint(url);
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept','application/json');
        res = http.send(req);
        System.debug(res.getBody());
        return res.getBody();
    }

    /*
    Method Name     : updateProperty
    Purpose         : To update the property with user selection
    Created By      : Brahmaji Tammana
    Created Date    : 14 Nov 2017
    */
    @AuraEnabled
    public static void updateProperty(String latlng, Id propertyId){
        System.debug(latlng);

        Property__c prop = [SELECT Latitude__c, Longitude__c, Id from Property__c where id=: propertyId];
        if(String.isNotBlank(latlng)){
            List<String> latlngArray = latlng.split(' ');
            prop.Latitude__c = latlngArray[0];
            prop.Longitude__c = latlngArray[1];
            update prop;
        }
    }

    /*
    Method Name     : getGeoCodeOfProperty
    Purpose         : To get the details of property if force:recordData is not returned
    Created By      : Brahmaji Tammana
    Created Date    : 14 Nov 2017
    */
    @AuraEnabled
    public static Property__c getGeoCodeOfProperty (Id propertyId){
        return [SELECT ID, Latitude__c, Longitude__c FROM Property__c WHERE ID=: propertyId];
    }
}