ngDefine('cockpit.plugin.bpmn-stats.resources', function(module) {

//define Angular ressource for REST communication
  var Resource = function ($resource, Uri) {
    return $resource(Uri.appUri('plugin://bpmn-stats/:engine/process-definition/:id/stats'), {id: '@id'}, {
      query: { method: 'GET', isArray: false}// stats per process definition
    });
  };

  module.factory('BpmnStatsProcessDefinitionResource', Resource);

  var TaskResource = function ($resource, Uri) {
	    return $resource(Uri.appUri('plugin://bpmn-stats/:engine/process-definition/:id/taskstats'), {id: '@id'}, {
	      queryActivityStatistics:{method: 'GET', isArray: true}  // stats per activity in process definition 
	    });
	  };
  
  module.factory('BpmnStatsTaskProcessDefinitionResource', TaskResource);
  
});

