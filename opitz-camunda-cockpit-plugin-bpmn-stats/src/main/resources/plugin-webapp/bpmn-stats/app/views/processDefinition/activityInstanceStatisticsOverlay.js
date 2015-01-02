ngDefine('cockpit.plugin.bpmn-stats.views', function(module) {

  var Controller = [ '$scope', '$filter', function ($scope, $filter) {

    var bpmnElement = $scope.bpmnElement,
        processData = $scope.processData.newChild($scope);

    // provide activity if historic stats are available
    processData.provide('activityHistoricInstance', ['activityInstanceHistoricStats', function (activityInstanceStatistics) {
      for (var i = 0; i < activityInstanceStatistics.length; i++) {
        var current = activityInstanceStatistics[i];
        if (current.id === bpmnElement.id) {
          return current;
        }
      }
      return null;
    }]);

    // make selectible when statistic data is available
    $scope.activityHistoricInstance = processData.observe('activityHistoricInstance', function(activityHistoricInstance) {
      if (activityHistoricInstance) {
        bpmnElement.isSelectable = true;
      }
      $scope.activityHistoricInstance = activityHistoricInstance;
    });

  }];

  var Configuration = function PluginConfiguration(ViewsProvider) {

    ViewsProvider.registerDefaultView('cockpit.processDefinition.diagram.overlay', {
      id: 'activity-historic-instance-statistics-overlay',
      url: 'plugin://bpmn-stats/static/app/views/processDefinition/activity-instance-statistics-overlay.html',
      controller: Controller,
      priority: 20
    }); 
  };

  Configuration.$inject = ['ViewsProvider'];

  module.config(Configuration);
});
