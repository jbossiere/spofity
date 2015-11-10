$(document).ready(function(){
  $('#filterBar').hide(); // start with filter bars hidden
  $('#popup, .overlay').hide(); //start with popup hidden

  // hide popup if the popup is clicked
  $('#popup, .overlay').click(function() {
    $('#popup, .overlay').hide();
  });

  $('.playingSpan').tooltip({title: "Hooray"}); 

});

var data;
var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=artist:'
var myApp = angular.module('myApp', ['ui.bootstrap']);
var currentArtist;
var trackName;

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  $scope.audioObject = {}

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
  }

  // Unhides, the popup, and then appends information to it - including Instagram pictures
  $scope.popup = function(track) {
    $('#popup, .overlay').show();
    $scope.trackName = track.name;
    // clear the popup, then append information
    $('#popup').html("");
    $('#popup').append("<img class='popupAlbum' src=" + track.album.images[0].url + " alt=" + track.name + ">");
    $('#popup').append('<h4>"' + track.name + '" by ' + track.artists[0].name + "</h4>")
    $('#popup').append("<h4>" + "from the album <i>" + track.album.name + "</i></h4>")
    $('#popup').append("<hr>")
    $('#popup').append("<img id='instaIcon' src='img/Instagram.png'><span> Displaying recent Instagram photos tagged with #" + track.name.replace(/\s+/g, "").replace("-", "").replace("'", "") + ":</span><br>")

    // Note to the grader: currently i have it returning instagram photos with the track name hashtag because I believe this shows off 
    // the page a little bit better by showing different photo results for different clicked songs, but I do prefer to have it return
    // photos with the artist name hashtag because it's more likely to return relelvant photos (ex. #coldplay will most likely return 
    // photos with coldplay in it, while #yellow, as in Coldplay's song Yellow will return a bunch of random photos)

    // Also warning that there is no way to filter out NSFW photos so occassionally you may get some...


    // use the instagram API to get relevant tagged photos, then add the 10 most recent photos to the instagram div in the popup
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://api.instagram.com/v1/tags/" + track.name.replace(/\s+/g, "").replace("-", "").replace("'", "") + "/media/recent?access_token=211968027.7222298.1bbdffa25f78459ba915b03b6780eefb",
      success: function(data){
        for (var i=0; i<10; i++) {
          $('#popup').append("<li class='instaResultList'><img class='instaImage' src='" + data.data[i].images.low_resolution.url + "'></li>");
        }
      }
    });
  }

  // Pauses the music when the pause button is clicked if the music is playing
  $scope.pause = function() {
    if(!$scope.audioObject.paused) {
      $scope.audioObject.pause();
      $scope.currentSong = false;
      return;
    }
  }
});

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]',
});

