angular.module('app1')

.controller('InstrumentCtrl', ['$scope', 'presetFactory', function($scope, presetFactory) {

  $scope.mGain = 0.5;
  $scope.spread = 0;
  $scope.slide2 = 0.01;
  $scope.slide3 = 0.01;
  $scope.slide4 = 0.01;
  $scope.slide5 = 0.01;

  $scope.editBTN = "Edit";
  $scope.playShow = true;
  $scope.editShow = false;
  $scope.presetsShow = false;

  $scope.rootIndex = 0;
  $scope.key = "major";
  $scope.soundType = "sawtooth";

  $scope.currentPreset = "";
  $scope.currentPresetID = "";
  $scope.newPresetName = "New Preset";
  $scope.presets = [];
  $scope.defaultPresets = [
    {
      "name": "Default Preset 1",
      "sliders" : [0.01, 1, 0.10, 0.01, 0.01],
      "rootIndex": 0,
      "key": "minor",
      "soundType": "square"
    },
    {
      "name": "Default Preset 2",
      "sliders" : [0.01, 0.01, 0.70, 0.2, 0.9],
      "rootIndex": 3,
      "key": "major",
      "soundType": "square"
    },
    {
      "name": "Default Preset 3",
      "sliders" : [0.7, 1, 0.10, 0.3, 0.01],
      "rootIndex": 6,
      "key": "minor",
      "soundType": "triangle"
    }
  ];


  presetFactory.query(
    function(response) {
        $scope.presets = response;
        console.log($scope.presets[0]);
        $scope.loadPreset($scope.presets[0]);
    },
    function(response) {
        $scope.message = "Error: "+response.status + " " + response.statusText;
        for (var i=0; i < $scope.defaultPresets.length; i++) {
          $scope.presets.push( $scope.defaultPresets[i] );
        }
        $scope.presets.push({"name": "Please Sign In To Save Your Own Presets"});
        console.log($scope.presets[0]);
        $scope.loadPreset($scope.presets[0]);
  });

  var rootNoteValues = [["A",440],["B",493.883],["C", 523.251],["D", 587.330],["E", 659.255],["F", 698.456],["G", 783.991]];

  var rootNote = rootNoteValues[0][1];

  NoteValues.init(rootNote);

  var osc1, osc2, osc3, osc4;

  var oscPan1, oscPan2, oscPan3, oscPan4;
  var oscVol1, oscVol2, oscVol3, oscVol4;

  var mod1;

  var filter, delay;
  var finalVCA, masterGain;

  var osc = false;
  var goodkey = false;

  $scope.$on('$viewContentLoaded', function() {
    $scope.play(65);
    $scope.mute();

  });

  $scope.play = function(a) {
    if(!osc){
      $scope.buildSynth();
      osc = true;
      $scope.Slider1();
      $scope.Slider2();
      $scope.Slider3();
      $scope.Slider4();
      $scope.Slider5();
    }
    if(osc) {
      if(a == 1 || a.which == 65) {
        osc1.setFrequency(NoteValues.root);

        if($scope.key == "major") osc2.setFrequency(NoteValues.third);
        else if($scope.key == "minor") osc2.setFrequency(NoteValues.mthird);

        osc3.setFrequency(NoteValues.octave + 2);
        osc4.setFrequency(NoteValues.fifth);
        goodkey = true;
      } else if (a == 2 || a.which == 83) {
        osc1.setFrequency(NoteValues.fourth);
        if($scope.key == "major") osc2.setFrequency(NoteValues.sixth);
        else if($scope.key == "minor") osc2.setFrequency(NoteValues.msixth);

        osc3.setFrequency(NoteValues.octave);
        osc4.setFrequency(NoteValues.fourth + 5);
        goodkey = true;
      } else if (a == 3 || a.which == 68) {
        osc1.setFrequency(NoteValues.fifth);

        if($scope.key == "major") osc2.setFrequency(NoteValues.seventh / 2);
        else if($scope.key == "minor") osc2.setFrequency(NoteValues.mseventh / 2);

        osc3.setFrequency(NoteValues.second );
        osc4.setFrequency(NoteValues.fifth - 5);
        goodkey = true;
      } else if (a == 4 || a.which == 70) {

        if($scope.key == "major") osc1.setFrequency(NoteValues.sixth);
        else if($scope.key == "minor") osc1.setFrequency(NoteValues.msixth);

        osc2.setFrequency(NoteValues.root);
        osc3.setFrequency(NoteValues.second);
        osc4.setFrequency(NoteValues.fourth);
        goodkey = true;
      } else if (a == 5 || a.which == 71) {
        osc1.setFrequency(NoteValues.fifth);
        if($scope.key == "major") osc2.setFrequency(NoteValues.seventh);
        else if($scope.key == "minor") osc2.setFrequency(NoteValues.mseventh);

        osc3.setFrequency(NoteValues.second);
        osc4.setFrequency(NoteValues.fifth);
        goodkey = true;
      }
      if (goodkey) {
        finalVCA.setGain(0.2, 0.05);
      }
      goodkey = false;
    }
  };

  $scope.mute = function(){
    if(osc){
      finalVCA.setGain(0.0, 0.3);
    }
  };

  $scope.Slider1 = function() {
    oscPan3.setPosition($scope.spread);
    oscPan4.setPosition(-1 * $scope.spread);
    oscPan1.setPosition(0.5 * $scope.spread);
    oscPan2.setPosition(-0.5 * $scope.spread);
  };

  $scope.Slider2 = function() {
    oscVol1.setGain(100 * $scope.slide2);
    oscVol2.setGain(3 * $scope.slide2);
    oscVol3.setGain(1 * $scope.slide2);
    oscVol4.setGain(0.5 * $scope.slide2);
  };

  $scope.Slider3 = function() {
    filter.setFreq($scope.slide3 * 10000);
  };

  $scope.Slider4 = function() {
    delay.setFeedback($scope.slide4);
  };

  $scope.Slider5 = function() {
    mod1.setFrequency($scope.slide5 * 50);
  };

  $scope.editBTNclick = function() {
    $scope.editShow = !$scope.editShow;
    if ($scope.editShow) {
      $scope.playShow = false;
      $scope.presetsShow = false;
      $scope.newPresetShow = false;
      $scope.editBTN = "Done";
    } else if(!$scope.editShow){
      $scope.playShow = true;
      $scope.editBTN = "Edit";
    }
  };

  $scope.changeRootIndex = function(){
    rootNote = rootNoteValues[$scope.rootIndex][1];
    NoteValues.init(rootNote);
  };

  $scope.changeMGain = function() {
    OutputVolume.setGain($scope.mGain);
  };

  $scope.setOscType = function() {
    osc1.setType($scope.soundType);
    osc2.setType($scope.soundType);
    osc3.setType($scope.soundType);
    osc4.setType($scope.soundType);
  };

  $scope.viewPresets = function() {
    $scope.presetsShow = !$scope.presetsShow;
    if ($scope.presetsShow) {
      $scope.playShow = false;
      $scope.editShow = false;
      $scope.newPresetShow = false;
    } else if(!$scope.presetsShow){
      $scope.playShow = true;
    }
  };

  $scope.loadPreset = function(p) {

    $scope.currentPreset = p.name;
    $scope.currentPresetID = p._id;
    $scope.spread = p.sliders[0];
    $scope.slide2 = p.sliders[1];
    $scope.slide3 = p.sliders[2];
    $scope.slide4 = p.sliders[3];
    $scope.slide5 = p.sliders[4];
    $scope.rootIndex = p.rootIndex;
    $scope.key = p.key;
    $scope.soundType = p.soundType;

    $scope.Slider1();
    $scope.Slider2();
    $scope.Slider3();
    $scope.Slider4();
    $scope.Slider5();
    $scope.changeRootIndex();
    $scope.setOscType();

    $scope.presetsShow = false;
    $scope.playShow = true;
    $scope.editShow = false;
    $scope.newPresetShow = false;
  };

  $scope.deletePreset = function(p) {

    for (var i = 0; i < $scope.presets.length; i++) {
      if ($scope.presets[i].name == p.name) {
        $scope.presets.splice(i,1);
      }
    }
    console.log(p);
    console.log(p._id);
    presetFactory.delete({id: p._id});
    //presetFactory.getPresets().delete(p._id);
  };

  $scope.nameNewPreset = function() {
    $scope.newPresetShow = !$scope.newPresetShow;

    if ($scope.newPresetShow) {
      $scope.playShow = false;
      $scope.editShow = false;
      $scope.presetsShow = false;
    } else if(!$scope.newPresetShow){
      $scope.playShow = true;
    }
  };

  $scope.saveNewPreset = function() {
    $scope.test = $scope.newPresetName;
    $scope.currentPreset = $scope.newPresetName;
    var tempPreset = {
          "name": $scope.currentPreset,
          "sliders" : [$scope.spread, $scope.slide2, $scope.slide3, $scope.slide4, $scope.slide5],
          "rootIndex": $scope.rootIndex,
          "key": $scope.key,
          "soundType": $scope.soundType
        };

    $scope.presets.push(tempPreset);
    presetFactory.save(tempPreset);
    presetFactory.query(
      function(response) {
          $scope.presets = response;
          console.log(response);
          $scope.loadPreset($scope.presets[$scope.presets.length]);
      },
      function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          for (var i=0; i < $scope.defaultPresets.length; i++) {
            $scope.presets.push( $scope.defaultPresets[i] );
          }
          $scope.presets.push({"name": "Please Sign In To Save Your Own Presets"});
          $scope.loadPreset($scope.presets[0]);
    });
  };

  $scope.saveCurrentPreset = function() {
    var tempPreset = {
          "_id" : $scope.currentPresetID,
          "name": $scope.currentPreset,
          "sliders" : [$scope.spread, $scope.slide2, $scope.slide3, $scope.slide4, $scope.slide5],
          "rootIndex": $scope.rootIndex,
          "key": $scope.key,
          "soundType": $scope.soundType
        };
        console.log(tempPreset);
    presetFactory.save(tempPreset);
  };

  $scope.buildSynth = function() {
    osc1 = new VCO();
    osc2 = new VCO();
    osc3 = new VCO();
    osc4 = new VCO();

    oscVol1 = new VCA();
    oscVol1.setGain(0.5);
    oscVol2 = new VCA();
    oscVol2.setGain(0.5);
    oscVol3 = new VCA();
    oscVol3.setGain(0.5);
    oscVol4 = new VCA();
    oscVol4.setGain(0.5);

    oscPan1 = new PAN();
    oscPan2 = new PAN();
    oscPan3 = new PAN();
    oscPan4 = new PAN();

    filter = new FILTER();
    delay = new DELAY();

    mod1 = new LFO();
    mod1.setFrequency(5);

    finalVCA = new VCA();
    finalVCA.setGain(0.0);

    OutputVolume = new VCA();
    OutputVolume.setGain($scope.mGain);

    osc1.connect(oscPan1);
    osc2.connect(oscPan2);
    osc3.connect(oscPan3);
    osc4.connect(oscPan4);

    oscPan1.connect(oscVol1);
    oscPan2.connect(oscVol2);
    oscPan3.connect(oscVol3);
    oscPan4.connect(oscVol4);

    oscVol1.connect(filter);
    oscVol2.connect(filter);
    oscVol3.connect(filter);
    oscVol4.connect(filter);

    filter.connect(finalVCA);

    mod1.modulateFreq(filter);

    finalVCA.connect(OutputVolume);

    finalVCA.connect(delay);
    delay.connect(OutputVolume);

    OutputVolume.connect(audioCtx.destination);

  };

}])

.controller('HeaderCtrl', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

  $scope.loggedIn = false;
  $scope.username = '';

  if(AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.username = AuthFactory.getUsername();
  }

  $scope.openLogin = function () {
      ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
  };

  $scope.logOut = function() {
     AuthFactory.logout();
      $scope.loggedIn = false;
      $scope.username = '';
  };

  $rootScope.$on('login:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
  });

  $rootScope.$on('registration:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
  });

  $scope.stateis = function(curstate) {
     return $state.is(curstate);
  };
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe)
          $localStorage.storeObject('userinfo',$scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);
        AuthFactory.register($scope.registration);
        ngDialog.close();
    };
}])

.controller('AccountPageController', ['$scope', '$localStorage', 'AuthFactory', function ($scope, $localStorage, AuthFactory){
  $scope.username = AuthFactory.getUss

}])
;
