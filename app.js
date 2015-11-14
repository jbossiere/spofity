$(document).ready(function(){
  $('#filterBar').hide(); // start with filter bars hidden
  // $('#popup, .overlay').hide(); //start with popup hidden

  // // hide popup if the popup is clicked
  // $('#popup, .overlay').click(function() {
  //   $('#popup, .overlay').hide();
  // });

});

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
      $('#filterBar').show();
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

  // open the modal
  $scope.open = function(track) {
    $scope.trackName = track.name;
    $uibModal.open({
      animation: true,
      controller: 'modalCtrl',
      templateUrl: 'templates/myModalContent.html',
      size: 'lg',
      resolve: {
        currentTrack: function () {
          return $scope.currentTrack = track;
        }
      }
    });
  };
});
  //   // use the instagram API to get relevant tagged photos, then add the 10 most recent photos to the instagram div in the popup
  //   $.ajax({
  //     type: "GET",
  //     dataType: "jsonp",
  //     cache: false,
  //     url: "https://api.instagram.com/v1/tags/" + track.name.replace(/\s+/g, "").replace("-", "").replace("'", "") + "/media/recent?access_token=211968027.7222298.1bbdffa25f78459ba915b03b6780eefb",
  //     success: function(data){
  //       for (var i=0; i<10; i++) {
  //         $('#popup').append("<li class='instaResultList'><img class='instaImage' src='" + data.data[i].images.low_resolution.url + "'></li>");
  //       }
  //     }
  //   });
  // }



// A controller to return the current track info to myModalContent.html
var modalCtrl = myApp.controller('modalCtrl', function($scope, $http, $uibModal, currentTrack) {
  $scope.currentTrack = currentTrack;
  var hashtag = $scope.hashtag = currentTrack.name.replace(/\s+/g, "").replace("-", "").replace("'", "");
  var beginUrl = "https://api.instagram.com/v1/tags/";
  var endUrl = "/media/recent?access_token=211968027.7222298.1bbdffa25f78459ba915b03b6780eefb";

  // Get the instagram photos
  $http({
    method: 'GET',
    url: beginUrl + hashtag + endUrl,
    cache: false,
    headers: {
        'Content-type': 'application/jsonp'
    }
  }).success(function(response) {
      console.log(response);
      $scope.instaImg = response;
    });

  // Pauses the music when the pause button is clicked if the music is playing
  $scope.pause = function() {
    console.log('pause')
    if(!$scope.audioObject.paused) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
  };
});

