// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})



//controllers 

/**
* CONTROLLERS
*/
//Main Controller
starter.controller('ExampleController', ['$scope', '$ionicPlatform', '$ionicPopup', function($scope, $ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {
    //***PDF417 SCANNER***
    function hex2a(hex) {
        var str = '';
        for (var i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    }
    /**
     * Scan these barcode types
     * Available: "PDF417", "USDL", "QR Code", "Code 128", "Code 39", "EAN 13", "EAN 8", "ITF", "UPCA", "UPCE"
     */
    var types = ["PDF417", "QR Code"];
    /**
     * Initiate scan with options
     * NOTE: Some features are unavailable without a license
     * Obtain your key at http://pdf417.mobi
     */
    var options = {
        beep : false,  // Beep on
        noDialog : true,
        uncertain : false, //Recommended
        quietZone : false, //Recommended
        highRes : false, //Recommended
        inverseScanning: false,
        frontFace : false
    };
    // Note that each platform requires its own license key
    // Set license to null for demo mode.
    var licenseiOs = null;
    // Set license to null for demo mode.
    var licenseAndroid = null;
    $scope.barcodeResult;
    $scope.fields;
    $scope.scanNew = function() {
      // $ionicPopup.alert({
      //   title:'Scan Button Clicks'
      // });
      cordova.plugins.pdf417Scanner.scan(
        // Register the callback handler
        function callback(scanningResult) {
          // handle cancelled scanning
          if (scanningResult.cancelled === true) {
            // $ionicPopup.alert({
            //    title:'Scan Cancelled'
            // });
            $scope.dob = "cancelled";
            return;
          }
          // Obtain list of recognizer results
          var resultList = scanningResult.resultList;
          // Iterate through all results
          for (var i = 0; i < resultList.length; i++) {
            // Get individual resilt
            var recognizerResult = resultList[i];
            if (recognizerResult.resultType == "Barcode result") {
              // handle Barcode scanning result
              if (typeof(recognizerResult.raw) !== "undefined" && recognizerResult.raw !== null) {
                var raw = hex2a(recognizerResult.raw);
              }
              $scope.barcodeResult = {
                "Data": recognizerResult.data,
                "Raw": raw,
                "Type": recognizerResult.type
              };
              $scope.dob = "secondoption";
            } else if (recognizerResult.resultType == "USDL result") {
              // handle USDL parsing result
              var fields = recognizerResult.fields;
              $scope.fields= {
                /** Personal information */
                "USDL version": fields[kPPAamvaVersionNumber],
                "Family name": fields[kPPCustomerFamilyName],
                "First name": fields[kPPCustomerFirstName],
                "Date of birth": fields[kPPDateOfBirth],
                "Sex": fields[kPPSex],
                "Eye color": fields[kPPEyeColor],
                "Height": fields[kPPHeight],
                "Street": fields[kPPAddressStreet],
                "City": fields[kPPAddressCity],
                "Jurisdiction": fields[kPPAddressJurisdictionCode],
                "Postal code": fields[kPPAddressPostalCode],
                /** License information */
                "Issue date": fields[kPPDocumentIssueDate],
                "Expiration date": fields[kPPDocumentExpirationDate],
                "Issuer ID": fields[kPPIssuerIdentificationNumber],
                "Jurisdiction version": fields[kPPJurisdictionVersionNumber],
                "Vehicle class": fields[kPPJurisdictionVehicleClass],
                "Restrictions": fields[kPPJurisdictionRestrictionCodes],
                "Endorsments": fields[kPPJurisdictionEndorsementCodes],
                "Customer ID": fields[kPPCustomerIdNumber]
              };
              $scope.dob = "newData" ; 
            }
          }
        },
        // Register the error callback
        function errorHandler(err) {
          $ionicPopup.alert({
            title: err
          });
        },
        types, options, licenseiOs, licenseAndroid
      );
    };
    //***END PDF417 SCANNER***
  });
}])

