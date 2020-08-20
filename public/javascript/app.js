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



var app = angular.module('tumsa', ['data-table']);


//General controller

app.controller('HomeCtl', function($scope, $http){

  $scope.current_user = {};

  $scope.findSession = function(){
    $http.get('./api/getsession').then(function(response){
      console.log(response);
      $scope.current_user = response.data;
      console.log($scope.current_user);
    });
  }

  $scope.findSession();
});

//Usuarios Controller

app.controller('UsuariosCtl', function ($scope, $http) {
    
  $scope.user = {};

	$scope.editUser = function(user){
		$scope.user = user;
		$('#modalvehicleForm').modal();
	}

  $scope.saveUsers = function(){
    var user = $scope.user;
    $http.patch('./api/vehicles', vehicle).then(function(response){
      $scope.refreshUsers();
      $scope.cancelUsers();
    });
  }

  $scope.refreshUsers = function(){
    $http.get('./api/users').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.cancelUser = function(){
    $scope.user = {}
   $('#modalvehicleForm').modal('hide'); 
  }

  $scope.refreshUsers();
});

app.controller('PointsCtl', function ($scope, $http) {

	$scope.point = {};
  $scope.pointForm = 0;

  $scope.refreshPoints = function(){
  	$http.get('./api/points').then(function(response){
  		$scope.points = response.data;
  	});
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


app.controller('RoutesCtl', function($scope, $http){
  
  $scope.optionz = {
            rowHeight: 50,
            headerHeight: 50,
            footerHeight: 50,
            scrollbarV: false,
            columns: [
              { name: "Name", prop: "name" },
              { name: "Gender", prop: "gender" },
              { name: "Company", prop: "company" }
            ],
            columnMode: 'force',
            paging: {
              externalPaging: true,
              size: 10
            },
            onSort: (sorts) => {
              console.log({ sorts });
            }
          };
  $scope.dataset = [];

  $scope.paging = function(offset, size){
    $http.get('./api/routes').then(function(response){
      console.log(response.data);
      $scope.dataset = response.data;
      $scope.optionz.paging.count = response.data.length;
    });
  }

});

app.controller('EmergencyCtl', function($scope,NgTableParams, $http){
  $scope.emergency = {};
  $scope.emergencias = [];
  $scope.vehicles = [];
  $scope.vehiclesList = [];

  $scope.refreshEmergency = function(){
    $http.get('./sql/centinela').then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    });
  }

  $scope.stopReporting = function(emergency){
    $scope.emergency = emergency;
    $('#modalemergencyForm').modal();
  }

  $scope.stopEmergency = function(){
    $scope.emergency.status = 5;
    $http.patch('./sql/centinela/'+$scope.emergency.id, $scope.emergency).then(function(response){
      $('#modalemergencyForm').modal('hide');
      $scope.refreshEmergency();
      $scope.emergency = null;
    });
  }
  
  $scope.refreshMzone = function(){
      $http.post('./api/mzonevehicle', $scope.emergency).then(function(response){
        console.log(response);
      });
  }

  $scope.newEmergency = function(){
    if($scope.emergency.vehicle_Id == "" || $scope.emergency.Unit_Id == "") {
      $('#modalemergencyAlert').modal();
    }else{
      $http.post('./sql/centinela', $scope.emergency).then(function(response){
        $scope.emergency = null;
        window.location = "./emergencia"
      });
    }
  }

  $scope.checkEmergency = function(emergencia){
    $http.get('./sql/centinela/'+emergencia).then(function(response){
      $scope.emergency = response.data[0];
      if($scope.emergency.status > 4){
        $scope.emergency.progress = 100;
      }else if($scope.emergency.historic > 0){
        var size = ($scope.emergency.historic / 1440) * 100
        $scope.emergency.progress = size;
      }else {
        $scope.emergency.progress = 0;
      }
    });
  };

  $scope.updateEmergency = function(emergencia){
    if($scope.emergency.Unit_Id == "") {
      $('#modalemergencyAlert').modal();
    }else{
      $http.put('./sql/centinela/'+$scope.emergency.id, $scope.emergency).then(function(response){
        $scope.emergency = null;
        window.location = "./emergencia"
      });
    }
  };

  $scope.removeReport = function(){
    emergencia = $scope.emergency;
    $http.delete('./sql/centinela/'+emergencia.id).then(function(response){
      $scope.emergency = null;
      $('#modalemergencyForm2').modal('hide');
            $scope.refreshEmergency();
    });
  };

  $scope.cancelModalEmergency2 = function(){
    $('#modalemergencyForm2').modal('hide');
  }

  $scope.deleteReport = function(emergencia) {
    $scope.emergency = emergencia;
    $('#modalemergencyForm2').modal();
  };

  $scope.refreshVehicles = function(){
    $http.get('./api/vehicles').then(function(response){
      $scope.vehicles =  response.data;
    });
  }

  $scope.complete = function(search){
    if(search  && search.length > 4){
      $http.get('./api/vehicles/unitid/'+search).then(function(response){
          vehicles =  response.data;
          var output=[];
          angular.forEach(vehicles,function(vehicle){
            if(vehicle.Unit_Id.toLowerCase().indexOf(search.toLowerCase())>=0){
              output.push(vehicle);
            }
          });
          $scope.vehiclesList=output;
      });   
    }else{
      $scope.vehiclesList=[];
    }
  }

  $scope.fillTextbox=function(vehicle){
      $scope.emergency.placa=vehicle.Registration;
      $scope.emergency.marca=vehicle.Make;
      $scope.emergency.unidadyear=vehicle.ModelYear;
      $scope.emergency.Unit_Id = vehicle.Unit_Id;
      $scope.emergency.vehicle_Id = vehicle.Id;
      $scope.vehiclesList=null;
      console.log($scope.emergency)
    }
    $scope.refreshEmergency()

});



app.controller('SQLCtl', function($scope, NgTableParams, $http) {

  $scope.searchOS = function(){
    var filter = $scope.filter;
    $http.post('./sql/ordenes', filter).then(function(response){
      $scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
    })
  }
});