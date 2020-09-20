(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle").on('click',function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll',function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

})(jQuery); // End of use strict


function formatDate(date){;
  var str_date = date.getFullYear()+"-";
  var months = date.getMonth()+ 1;
  months = (months>9 ? '' : '0') + months;
  var days = date.getDate();
  console.log(days);
  days = (days>9 ? '' : '0') + days;
  var hours = (date.getHours()>9 ? '' : '0') + date.getHours();
  var mins = (date.getMinutes()>9 ? '' : '0') + date.getMinutes();
  var secs = (date.getSeconds()>9 ? '' : '0') + date.getSeconds();
  return str_date+months+"-"+days+" "+hours+":"+mins+":"+secs;
}

function formatTime(date){
  var hours = (date.getHours()>9 ? '' : '0') + date.getHours();
  var mins = (date.getMinutes()>9 ? '' : '0') + date.getMinutes();
  var secs = (date.getSeconds()>9 ? '' : '0') + date.getSeconds();
  return hours+":"+mins+":"+secs;
}

var app = angular.module('tumsa', ["ngTable","angularjs-datetime-picker", "ui.bootstrap"]);
var map_token = 'pk.eyJ1IjoibWF1YmFycmVyYSIsImEiOiJjajhvdnVjeDQwN3k2MndwMXZkNzBoeW01In0.MFXZsAk84rNXSAmodkAGdg';


//Directive
app.directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;

              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);

app.service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function(file, uploadUrl){
           var fd = new FormData();
           fd.append('file', file);

           $http.post(uploadUrl, fd, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
           }).then(function successCallback(response) {
              console.log(response);
            }, function errorCallback(response) {
              console.log("response");
            }

           );
        }
}]);
//General controller

app.controller('HomeCtl', function($scope, $http){

  $scope.current_user = {};

  $scope.findSession = function(){
    $http.get('./api/getsession').then(function(response){
      $scope.current_user = response.data;
    });
  }
  $scope.findSession();
});

//Usuarios Controller

app.controller('UsuariosCtl', function ($scope, $http, NgTableParams) {
    
  $scope.user = {};
  $scope.perfiles = []

	$scope.editUser = function(nid){
		$scope.user = users;
    $('#modalvehicleForm').modal();
    $http.patch('/users/'+nid, vehicle).then(function(response){
      $scope.refreshUsers();
      $scope.cancelUsers();
    });
	}

  $scope.saveUsers = function(){
    var user = $scope.user;
    $http.post('./api/users', user).then(function(response){
      $scope.refreshUsers();
      $scope.cancelUsers();
    });
  }

  $scope.newUser = function(){
    $http.get('./api/profiles').then(function(response){
      $scope.perfiles = response.data;
      $('#usersModalForm').modal('show');    
    });
  }

  $scope.refreshUsers = function(){
    $http.get('./api/users').then(function(response){
      console.log(response.data);
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.cancelUser = function(){
    $scope.user = {}
   $('#modalvehicleForm').modal('hide'); 
  }

  $scope.refreshUsers();
});

app.controller('VehiclesCtl', function($scope, $http){
  $scope.vehicles = [];
  $scope.vehicle = {};

  $scope.map = function(vehicle){
    $scope.vehicle = vehicle;
    mapboxgl.accessToken = map_token;
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-104.3365000, 19.1138000],
      zoom: 10 // starting zoom
    });
    $http.get('./api/vehicles/position/'+vehicle.id).then(function(response){
      ve = response.data;
      console.log(ve);
      var marker = new mapboxgl.Marker().setLngLat([ve["longitude"],ve["latitude"]]).addTo(map);
      map.setZoom(13);
      map.panTo([ve["longitude"],ve["latitude"]], {duration: 5000});
      marker.setPopup(new mapboxgl.Popup().setHTML("<b>"+ve["locationDescription"]+"</b>"));
      marker.togglePopup();
    });
    
    $('#mapModal').modal('show');
    map.invalidateSize();
  }


  $scope.refreshVehicles = function(){
    var camiones = [];
    $http.get('./api/vehicles').then(function(response){
      camiones = response.data;
      var today = new Date();
      for(var i=0;i<camiones.length;i++){
        camiones[i]["lastReport"] = new Date(camiones[i].lastKnownEventUtcTimestamp);
        now = new Date();
        diff = (now - camiones[i]["lastReport"])/60/60/60;
        if(diff<2){
          camiones[i]["lastReportColor"] = "success"
        }else if(diff>2 && diff<10){
          camiones[i]["lastReportColor"] = "warning"
        }else{
          camiones[i]["lastReportColor"] = "danger"
        }
        $scope.vehicles.push(camiones[i]);
      }
    });
  }
  $scope.refreshVehicles();

});

app.controller('PointsCtl', function ($scope, $http) {

	$scope.point = {};
  $scope.pointForm = 0;

  $scope.refreshPoints = function(){
  	$http.get('./api/points').then(function(response){
  		$scope.points = response.data;
  	});
  }

  $scope.map = function(point){
    $scope.point = point;
    mapboxgl.accessToken = map_token;
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [point["centerLongitude"],point["centerLatitude"]],
      zoom: 16 // starting zoom
    });
    var marker = new mapboxgl.Marker().setLngLat([point["centerLongitude"],point["centerLatitude"]]).addTo(map);
    
    $('#mapModal').modal('show');
    map.invalidateSize();
  }

	$scope.newPoint = function(){
		$scope.point = {};
    if($scope.pointForm == 0){
      $scope.pointForm = 1;
      var table = document.getElementById("dataset");
      var tr = table.insertRow(0);
      tr.setAttribute("id","newrow");
      html = '<td>&nbsp;</td>';
      html += '<td>&nbsp;</td>';
      html += '<td><input type="text" id="pointname" placeholder="Nombre" class="form-control"></td>';
      html += '<td>&nbsp;</td>';
      html += '<td>&nbsp;</td>';
      tr.innerHTML = html;
    }
		
	}

  $scope.savePoint = function(){
    var point = {name: $('#pointname')[0].value}
    $http.post('./api/points', point).then(function(response){
      $scope.cancelPoint();
    });
  }
	$scope.cancelPoint = function(){
	 $scope.refreshPoints();
   var row = document.getElementById("newrow");
   row.parentNode.removeChild(row);
   $scope.pointForm = 0;
	}
  $scope.refreshPoints();
});


app.controller('ViajesCtl', function($scope, $http, NgTableParams, fileUpload){
  $scope.viaje = {};
  $scope.routes = [];
  $scope.refreshRoutes = function(){
    $http.get('./api/routes').then(function(response){
      $scope.routes = response.data;    
    });
  }

  $scope.refreshRoutes();

  $scope.refreshViajes = function(){
    $http.get('./api/departures').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.showImport = function(){
    $('#tripModal').modal('show');
  }

  $scope.uploadFile = function(files){
    $scope.file = new FormData();
    $scope.file.append("file", files[0]);
  }

  $scope.submitFile = function(){
    $http.post('http://127.0.0.1:8888/api/uploadTrips', $scope.file, {
           headers: {'Content-Type': undefined },
           transformRequest: angular.identity
          }).then(function(results) 
           {   
              $log.log('success load file')
           });
  }

  $scope.downloadReport = function(viaje){
    var data = {"viaje": viaje}
    $http({
      url: './api/downloadReport',
      method: 'POST',
      headers: {
        'Content-type': 'text/html',
      }
    }).then(function(data,status,headers,config){
      console.log(data);
      var file = new Blob([data], {
        type: 'application/csv'
      });
      var fileURL = URL.createObjectURL(file);
      var a = document.createElement('a');
      a.href = fileURL;
      a.target = '_blank';
      a.download = 'yourfilename.html';
      document.body.appendChild(a); //create the link "a"
      a.click(); //click the link "a"
      document.body.removeChild(a); //remove the link "a"
    });
  }

  $scope.refreshViajes();
});

app.controller('ViajeFormCtl', function($scope, $http, NgTableParams){
  $scope.viaje = {};
  $scope.vehicles = [];
  $scope.places = [];
  $scope.vehicle = "";
  $scope.vehiclesList = [];
  $scope.routeList = [];
  $scope.calcs = [];
  $scope.ruta = "";
  $scope.total_time = 0;
  $scope.roles = [];
  $scope.role = {};

  $scope.$watch('viaje.rounds', function(newVal, oldVal){
    $scope.change_enddate();
  });

  $scope.$watch('viaje.route', function(newVal, oldVal){
    $scope.change_enddate();
  });

  $scope.$watch('viaje.start_date', function(newVal, oldVal){
    $scope.change_enddate();
  });

  $scope.change_enddate = function(){
    var rounds = $scope.viaje.rounds;
    if(rounds > 0 && $scope.viaje.route != "" && $scope.viaje.start_date != null){
      var mins = ($scope.viaje.route.total_time * rounds) + ($scope.viaje.route.time_rounds * rounds);
      var sdt = new Date($scope.viaje.start_date);
      var endt =  new Date(sdt.getTime() + mins*60000);
      $scope.viaje.end_date = formatDate(endt);
    }
  }

  $scope.calc_route = function(){
    $scope.calcs = [];
    $scope.total_time = 0;
    if($scope.viaje.route == null){
      console.log("No route found");
    }else{
      var route = $scope.viaje.route;
      var time = 0;
      var started = 0;
      for(var j=0;j<parseInt($scope.viaje.rounds);j++){
      for(var i=0;i<route.points.places.length;i++){
        var p = $scope.viaje.route.points.places[i];
        var place = {}
        place["id"] = p["id"];
        place["description"] = p["description"];
        start =  new Date($scope.viaje.start_date);
        lastComment = JSON.parse(p["lastComment"]);
        if(j == 0 && place["id"] != $scope.viaje.start_point && started == 0){
          place["hour"] = time;
          place["round"] = j+1;
          $scope.calcs.push(place);
          time = 0;
        }else {
          if(j == 0 && place["id"] == $scope.viaje.start_point && started == 0){
            p["time"] = 0;
            started = 1;
          }
          if(lastComment.length > 0){
          for(var z=0;z<lastComment.length;z++){
            cond = lastComment[z];
              if(cond["key"] == route.name && (j+1) == parseInt(cond["vuelta"])){
                time += parseInt(cond["add"]);
              }else{
                time += parseInt(p["time"]);
              }
            }
          }else{
            time += parseInt(p["time"]);
          }
          hour = formatDate(new Date(start.getTime() + time*60000));
          place["hour"] = hour;
          place["round"] = j+1;
          $scope.calcs.push(place);
         }
      }
        time += parseInt(route.time_rounds);
      }
      $scope.total_time = time;
    }
  }

  $scope.selectRole = function(){
    role = JSON.parse($scope.role);
    $scope.viaje.rounds = parseInt(role.rounds);
    var start_date = new Date();
    var time = role["hour"].split(":");
    start_date.setHours(parseInt(time[0]), parseInt(time[1]), parseInt(time[2]));
    $scope.viaje.start_date = start_date;
    $scope.calc_route();
  }

  $scope.complete2 = function(search){
    if(search  && search.length > 2){
      $http.get('./api/vehicles/search/'+search).then(function(response){
          vehicles =  response.data;
          var output=[];
          angular.forEach(vehicles,function(vehicle){
            //if(vehicle.description.toLowerCase().indexOf(search.toLowerCase())>=0){
              output.push(vehicle);
            //}
          });
          $scope.vehiclesList=output;
      });   
    }else{
      $scope.vehiclesList=[];
    }
  }

  $scope.searchRoles = function(route){
    $http.get('./api/roles/route/'+route).then(function(response){
        $scope.roles = response.data;
     }); 
  }

  $scope.complete = function(search){
    if(search  && search.length > 2){
      $http.get('./api/routes/name/'+search).then(function(response){
          routes =  response.data;
          var output=[];
          angular.forEach(routes,function(route){
            if(route.name.toLowerCase().indexOf(search.toLowerCase())>=0){
              output.push(route);
            }
          });
          $scope.routeList=output;
      });   
    }else{
      $scope.routeList=[];
    }
  }

  $scope.fillTextbox=function(route){
      $scope.viaje.route = route;
      $scope.places = route.points.places;
      $scope.routeList=null;
      $scope.ruta = route.name;
      $scope.searchRoles(route.nid);
      $scope.viaje.start_point = $scope.places[0].id;
      $scope.viaje.end_point = $scope.places[$scope.places.length - 1].id;
  }

  $scope.fillTextbox2=function(vehicle){
      $scope.viaje.vehicle = vehicle;
      $scope.vehiclesList=null;
      $scope.vehicle = vehicle.registration+" - "+vehicle.description;
  }

  $scope.saveViaje = function(){
    var viaje = $scope.viaje;
    viaje["route"] = $scope.viaje["route"];
    viaje["trip"] = {"trip": $scope.calcs};
    viaje["vehicle"] = $scope.viaje["vehicle"];
    viaje["total_time"] = $scope.total_time;
    viaje["start_point"] = $scope.viaje.start_point;
    viaje["end_point"] = $scope.end_point;

    if($scope.viaje.nid == null || $scope.viaje.nid == ""){
    $http.post('./api/departures', viaje).then(function(response){
      if(response.status == 200){
        window.location.href = './viajes';
      }else{
        window.location.href = './viajes';
      }
    });
    }else{
      $http.patch('./api/departures/'+$scope.viaje.nid, viaje).then(function(response){
      if(response.status == 200){
        window.location.href = './viajes';
      }else{
        window.location.href = './viajes';
      }
    });
    }
  }
});

app.controller('RoutesCtl', function($scope, $http, NgTableParams){
  $scope.route = {};
  $scope.points = [];

  $scope.refreshRoutes = function(){
    $http.get('./api/routes').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }


  $scope.refreshRoutes();
});


app.controller('RolesCtl', function($scope, $http, NgTableParams){
  $scope.ruta = "";
  $scope.role = {};
  $scope.routeList=[];

  $scope.complete = function(search){
    if(search  && search.length > 2){
      $http.get('./api/routes/name/'+search).then(function(response){
          routes =  response.data;
          var output=[];
          angular.forEach(routes,function(route){
            if(route.name.toLowerCase().indexOf(search.toLowerCase())>=0){
              output.push(route);
            }
          });
          $scope.routeList=output;
      });   
    }else{
      $scope.routeList=[];
    }
  }

  $scope.fillTextbox=function(route){
      $scope.role.route = route.nid;
      $scope.routeList=null;
      $scope.ruta = route.name;
      console.log($scope.role);
  }


  $scope.refreshRoles = function(){
    $http.get('./api/roles').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.newRole  = function(){
    $scope.role = {}
    $scope.ruta = "";
    $('#roleModal').modal('show');
  }

  $scope.saveRole = function(){
    var role = $scope.role;
    role["hour"] = formatTime(role["hour"]);
    if($scope.role.nid == null || $scope.role.nid == ""){
    $http.post('./api/roles', role).then(function(response){
      if(response.status == 200){
        $('#roleModal').modal('hide');
        $scope.refreshRoles();
        $scope.role = {};
      }else{
        console.log("Error");
      }
    });
    }else{
      $http.patch('./api/roles/'+$scope.role.nid, role).then(function(response){
      if(response.status == 200){
        $('#roleModal').modal('hide');
        $scope.refreshRoles();
        $scope.role = {};
      }else{
        console.log("Error");
      }
    });
    }
  }

  $scope.refreshRoles();

});


app.controller('RouteFormCtl', function($scope, $http, NgTableParams, $location){
  $scope.route = {};
  $scope.points = [];
  $scope.locations = []
  $scope.point = {};


  mapboxgl.accessToken = map_token;
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-104.3365000, 19.1138000],
      zoom: 10 // starting zoom
    });


  $scope.checkRoute = function(route){
    if(route){
    var url = './api/routes/'+route;
    $http.get(url).then(function(response){
      $scope.route = response.data[0];
      $scope.locations = $scope.route["points"]["places"];
      $scope.drawMarkers();
      setTimeout(function(){$scope.drawLine();}, 2000);
    });
    }
  }

  $scope.drawMarkers = function(){
    var locations = [];
    for(var i=0;i<$scope.locations.length;i++){
      var point = $scope.locations[i];
      var marker = new mapboxgl.Marker().setLngLat([point["centerLongitude"],point["centerLatitude"]]).addTo(map);
      point["marker"] = marker;
      locations.push(point);
    }
    $scope.locations = locations;
  }

  $scope.refreshPoints = function() {
    $http.get('./api/points').then(function(response){
      $scope.points = response.data;
      console.log($scope.points);
    });
  }

  $scope.addPoint = function(){
      var table = document.getElementById("dataset");
      var time = document.getElementById("newTime").value;
      var point = JSON.parse($scope.point);
      point["time"] = time;
      var marker = new mapboxgl.Marker().setLngLat([point["centerLongitude"],point["centerLatitude"]]).addTo(map);
      point["marker"] = marker;
      $scope.locations.push(point);
      $scope.drawLine()
  }

  $scope.drawLine = function(){
    try{
      map.removeLayer('route');
      map.removeSource('route');
    }catch(err){
      console.log(err);
    }
    if($scope.locations.length > 1){
      var coordinates = [];
      for(var i=0;i<$scope.locations.length;i++){
        var latlong = [$scope.locations[i]["centerLongitude"], $scope.locations[i]["centerLatitude"]];
        coordinates.push(latlong);
      }
      map.addSource('route', {
          'type': 'geojson',
          'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
          'type': 'LineString',
          'coordinates': coordinates
          }
        }
      });

      map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
          'line-join': 'round',
          'line-cap': 'round'
          },
          'paint': {
          'line-color': '#888',
          'line-width': 5
          }
      });
    }
  }

  $scope.saveRoute = function(){
    var route = $scope.route;
    route["points"] = [];
    for(var i=0;i<$scope.locations.length;i++){
      var point = {"id":$scope.locations[i].id,"time":$scope.locations[i].time,
                  "description": $scope.locations[i].description,
                  "centerLongitude": $scope.locations[i].centerLongitude,
                  "centerLatitude": $scope.locations[i].centerLatitude};
      if("lastComment" in $scope.locations[i]){
        point["lastComment"] = $scope.locations[i].lastComment;
      }else{
        point["lastComment"] = "[]";
      }
      route["points"].push(point);
    }
    if($scope.route.nid == null || $scope.route.nid == ""){
    $http.post('./api/routes', route).then(function(response){
      if(response.status == 200){
        window.location.href = './rutas';
      }else{
        window.location.href = './rutas';
      }
    });
    }else{
      $http.patch('./api/routes/'+$scope.route.nid, route).then(function(response){
      if(response.status == 200){
        window.location.href = './rutas';
      }else{
        window.location.href = './rutas';
      }
    });
    }
  }

  $scope.removePoint = function(point, index){
    point.marker.remove();
    $scope.locations.splice(index, 1);
    $scope.drawLine();
  }

  $scope.refreshPoints();
});
