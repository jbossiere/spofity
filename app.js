
var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var currentArtist;
var trackName;
var myApp = angular.module('myApp', ['ui.bootstrap']);

var myCtrl = myApp.controller('myCtrl', function($scope, $http, $uibModal) { 
  $scope.audioObject = {};

  // get songs by artist search
  $scope.getSongs = function() {
    if ($scope.artist != currentArtist && $scope.track == undefined && $scope.album == undefined) {
      currentArtist = $scope.artist;
      $http.get(baseUrl + $scope.artist).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.artist == currentArtist && $scope.track == undefined && $scope.album == undefined) {
        $http.get('https://api.spotify.com/v1/search?type=track&query=artist:' + $scope.artist).success(function(response){ 
          data = $scope.tracks = response.tracks.items;  
        });
    }

    // if user searchs a track or an album or both
    if ($scope.track != undefined &&$scope.album == undefined) {
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track == undefined && $scope.album != undefined) {
      $http.get(baseUrl + $scope.artist + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } else if ($scope.track != undefined && $scope.album != undefined) {
      $http.get(baseUrl + $scope.artist + "%20track:" + $scope.track + "%20album:" + $scope.album).success(function(response){ 
        data = $scope.tracks = response.tracks.items;  
      });
    } 
  }
  

  // play the preview_url
  $scope.play = function(song) {
    if($scope.currentSong == song) { 
      $scope.audioObject.pause(); 
      $scope.currentSong = false; 
      return;
    } else { 
      if($scope.audioObject.pause != undefined) { 
        $scope.audioObject.pause() 
      }
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play();   
      $scope.currentSong = song; 
    }
  };

  // Pauses the music when the pause button is clicked if the music is playing
  $scope.pause = function() {
    if(!$scope.audioObject.paused) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
  };

  // open the modal
  $scope.open = function(currentTrack) {
    $scope.trackName = currentTrack.name;
    $uibModal.open({
      animation: true,
      controller: 'modalCtrl',
      templateUrl: 'templates/myModalContent.html',
      size: 'lg',
      resolve: {
        currentTrack: function () {
          return currentTrack;
        },
        currentAudio: function () {
          return $scope.audioObject;
        }
      }
    });
  };
});


// A controller to return the current track info to myModalContent.html
var modalCtrl = myApp.controller('modalCtrl', function($scope, $http, $uibModal, $uibModalInstance, currentTrack, currentAudio) {
  $scope.currentTrack = currentTrack;
  var hashtag = $scope.hashtag = currentTrack.name.replace(/\s+/g, "").replace("-", "").replace("'", "").replace(",", "");
  var beginUrl = "https://api.instagram.com/v1/tags/";
  var endUrl = "/media/recent?access_token=11438424.81f9925.4562fc090a894cc695e36976c7c31efa&callback=JSON_CALLBACK";

  // Get the instagram photos
  $http.jsonp(beginUrl + hashtag + endUrl).success(function(response){
    if (response.data.length != 0) {
      $scope.instaImg = response.data;
    }
  });

  // Pauses the music when the pause button is clicked if the music is playing
  $scope.pause = function() {
    if(!currentAudio.paused) {
      currentAudio.pause();
      return;
    }
  };

  // function that closes the modal window
  $scope.close = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

