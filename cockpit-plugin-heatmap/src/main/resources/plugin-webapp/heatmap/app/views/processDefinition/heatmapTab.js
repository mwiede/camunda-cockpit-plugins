ngDefine('cockpit.plugin.heatmap.views', function(module) {
  
  // create controller to load data for HTML
  function HeatmapController ($scope, HeatmapEngineSpecificResource) {
    // input: processInstance
    
    $scope.activityStats = null;
    
    HeatmapEngineSpecificResource.query({id: $scope.processDefinition.id}).$then(function(response) {
        $scope.activityStats = response.data;
    });     
    
    $scope.initHeatMap = function(){
    	// wir können erst die diagramm-größe abgreifen, wenn das Diagramm gerendert ist
    	
   	 if(!document.getElementById('heatmapArea')){
   	    	var diagramId = 'processDiagram_' + $scope.processDefinition.id.replace(/:/g, '_').replace(/\./g, '_');
   	    	$scope.heatmapElement = angular.element('<div id="heatmapArea"/>');
   			$('div#'+diagramId).parent().prepend($scope.heatmapElement);
   				var diagramHeight = document.getElementsByTagName('svg')[0].style.height.replace(/px/,'') | $('div#'+diagramId).height();
   				var diagramWidth = document.getElementsByTagName('svg')[0].style.width.replace(/px/,'') | $('div#'+diagramId).width();
   			 var config = {
   						"radius": 10, 
   						"visible": true,
   						"element":document.getElementById('heatmapArea'),
   						"height": diagramHeight,
   						"width": diagramWidth
   					};
   					
   			 // heatmap erzeugen...
   			 $scope.heatmap = h337.create(config);
   			 var canvas = $scope.heatmap.get('canvas');
   			 canvas.style.zIndex = 998;
   	    }
    }
    
    angular.element(document).ready(function () {
    	$scope.initHeatMap();
    });
    
    
	var processData = $scope.processData.newChild($scope);   
	
	processData.observe(['filter','activityInstanceHistoricStatistics', function(filter,activityInstanceHistoricStatistics) {
    	
    	// aufbau der Heatmapdaten:
    	
    	// an dieser Stelle kommen die historic-Daten an, mann könnte die
		// heatmapdaten erzeugen
    	if($scope.heatmap){
    		$scope.heatmap.clear();
	    	angular.forEach(activityInstanceHistoricStatistics, function(statsElement) {    				 
				
					// find coordinates
					angular.forEach($scope.$parent.processDiagram.bpmnElements, function(elem){
						
						if(elem.id === statsElement.id){
							 var coord = $scope.getCoordinates(elem);
							$scope.heatmap.store.addDataPoint(coord.x,coord.y);		
							$('#'+elem.id).css('z-index', 999);
						}
						
					});
					
					//console.log(xx.store);
			    	
				
		     });
	    	//xx.store.generateRandomDataSet(100);
    	}
    	
        $scope.filter = filter;
        
      }]);
       
    
    $scope.getCoordinates = function(elem){
    	return{
    		x:  (elem.bounds.x/1) + (elem.bounds.width/2),
    		y:  (elem.bounds.y/1) + (elem.bounds.height/2)
    	};
    };
    
    $scope.showActivityHeatMap = function(){
    	
    	$scope.initHeatMap();
    	
    	$scope.heatmap.clear();
    	var bpmnElements = $scope.$parent.processDiagram.bpmnElements;
    	
    	// assoc array für schnellen contains check:
    	var statsElemente = {};
    	angular.forEach($scope.activityStats, function(statsElement) {
    		statsElemente[statsElement.id]=1;
    	});
    	
    	// alle Sequencen durchgehen
    	angular.forEach(bpmnElements, function(elem){
    		if(elem.id.toLowerCase().indexOf('sequenceflow')==0){
    			// wenn targetRef in den stats vorkommt, dann datapoints erzeugen!
    			angular.forEach($scope.activityStats, function(statsElement) {
    				if(elem.targetRef==statsElement.id){
    					
    					// wenn startElement nicht in den Stats enthalten, dann kein Punkt zeichnen
    					if(!statsElemente[elem.sourceRef]){
    						return; 
    					}
    					
    					// startKoordinaten
    					var startElement=eval('bpmnElements.'+elem.sourceRef);
    					var coord = $scope.getCoordinates(startElement);
						$scope.addHeatMapDataPoint(coord,statsElement.count);
    					// endKoordinaten
						var endElement=eval('bpmnElements.'+elem.targetRef);
						var coord1 = $scope.getCoordinates(endElement);
						$scope.addHeatMapDataPoint(coord1,statsElement.count);
						// linienkoordinaten
						var steps = Math.sqrt(((coord.x-coord1.x)*(coord.x-coord1.x))+((coord.y-coord1.y)*(coord.y-coord1.y)))/20;
						var h_step = -(coord.x-coord1.x)/steps;
						var v_step = -(coord.y-coord1.y)/steps;
						var actualx = coord.x+h_step;
						var actualy = coord.y+v_step;
						for (var int = 0; int < steps-1; int++) {
							$scope.addHeatMapDataPoint({x:actualx,y:actualy},statsElement.count);
							actualx = actualx + h_step;
							actualy = actualy + v_step;
						} 
    				}
    			});
    		}
    	});
    	
    	// einen dot beim element selbst zeichnen:
    	/*
    	angular.forEach($scope.activityStats, function(statsElement) {
    		console.log(statsElement);
    		
    		
			angular.forEach(bpmnElements, function(elem){					
				if(elem.id === statsElement.id){
					for (var int = 0; int < statsElement.count; int++) {
						var coord = $scope.getCoordinates(elem);
						$scope.heatmap.store.addDataPoint(coord.x,coord.y);
					}
				}
			});
	    });    
	    */
    	
    };
    
    $scope.clearHeatMap = function(){
    	$scope.heatmap.clear();
    };
    
    $scope.addHeatMapDataPoint = function(coord, wertung){    	
    	for (var int = 0; int < wertung; int++) {
			$scope.heatmap.store.addDataPoint(coord.x,coord.y);
		}
    	
    };
    
  };
  module.controller('HeatmapController', [ '$scope', 'HeatmapEngineSpecificResource',HeatmapController ]);


  // register Plugin
  var Configuration = function PluginConfiguration(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
      id: 'heatmap-tab',
      label: 'Heatmap',
      url: 'plugin://heatmap/static/app/views/processDefinition/heatmap-tab.html',
      controller: 'HeatmapController',
      priority: 66
    });
  };

  Configuration.$inject = ['ViewsProvider'];

  module.config(Configuration);
});
