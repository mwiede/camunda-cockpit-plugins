ngDefine('cockpit.plugin.bpmn-stats.views', function(module) {
  
  // create controller to load data for HTML
  function BpmnStatsController ($scope, BpmnStatsProcessDefinitionResource,BpmnStatsTaskProcessDefinitionResource) {
    // input: processInstance

    $scope.processStats = null;
    $scope.taskStats = null;
    
    BpmnStatsProcessDefinitionResource.query({id: $scope.processDefinition.id}).$then(function(response) {
          $scope.processStats = response.data;
    });      
    
    
    var processData = $scope.processData.newChild($scope);    
    processData.observe(['filter','activityInstanceHistoricStatistics', function(filter,activityInstanceHistoricStatistics) {

    	$scope.taskStats = null;
    	
    	if(filter.activityIds && filter.activityIds.length==1){
    		
    		if(activityInstanceHistoricStatistics && activityInstanceHistoricStatistics.length>0){
    			 angular.forEach(activityInstanceHistoricStatistics, function(statsElement) {
    				if(filter.activityIds[0]==statsElement.id){
     					$scope.taskStats = statsElement;
     				}
    		     });    			
    		}
    	}
    	
    	
        $scope.filter = filter;
    	
      }]);
    
  };
  module.controller('BpmnStatsController', [ '$scope', 'BpmnStatsProcessDefinitionResource','BpmnStatsTaskProcessDefinitionResource', BpmnStatsController ]);

  module.filter('humanize',function(){
	  return function(input){
  		return moment.duration(input).humanize();
	  };
  });

  // register Plugin
  var Configuration = function PluginConfiguration(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
      id: 'statistics-tab',
      label: 'Statistics',
      url: 'plugin://bpmn-stats/static/app/views/processDefinition/stats-table.html',
      controller: 'BpmnStatsController',
      priority: 19
    });
  };

  Configuration.$inject = ['ViewsProvider'];

  module.config(Configuration);
});
