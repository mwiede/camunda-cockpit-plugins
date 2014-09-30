package de.matez.camunda.cockpit.plugin.heatmap.resources;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.ManagementService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.test.Deployment;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;




import de.matez.camunda.cockpit.plugin.heatmap.dto.StatsContainerDto;


public class HeatmapEngineSpecificResourceTest extends
		AbstractCockpitPluginTest {

	private static final String PROCESS_1 = "Process_1";
	private HeatmapEngineSpecificResource heatmapEngineSpecificResource;
	private ProcessEngine processEngine;
	private RuntimeService runtimeService;
	private RepositoryService repositoryService;
	private ManagementService managementService;
	private TaskService taskService;
	private HistoryService historyService;

	@Before
	public void setup() {
		super.before();
		heatmapEngineSpecificResource = new HeatmapEngineSpecificResource(
				"engineName");
		processEngine = getProcessEngine();
		runtimeService = processEngine.getRuntimeService();
		repositoryService = processEngine.getRepositoryService();
		managementService = processEngine.getManagementService();
		taskService = processEngine.getTaskService();
		historyService = processEngine.getHistoryService();
		
	}

	private void startExamples() {
		runtimeService.startProcessInstanceByKey(PROCESS_1, withParameters("A"));
		runtimeService.startProcessInstanceByKey(PROCESS_1, withParameters("B"));
		runtimeService.startProcessInstanceByKey(PROCESS_1, withParameters("C"));
	}

	@Test
	public void testHeatmapDataFilter() {
		List<StatsContainerDto> activityStats = heatmapEngineSpecificResource.getActivityStats("abc");
		Assert.assertEquals(0, activityStats.size());
	}

	@Test
	@Deployment(resources = "processes/abc-process.bpmn")
	public void testExampleHeatmapData() {
		
		startExamples();
		
		List<StatsContainerDto> activityStats = heatmapEngineSpecificResource.getActivityStats(repositoryService.createProcessDefinitionQuery().singleResult().getId());
		
		Assert.assertEquals(7, activityStats.size());
		
		Collections.sort(activityStats);
		
		Assert.assertEquals(3, activityStats.get(0).getCount());//EndEvent_1
		Assert.assertEquals(3, activityStats.get(1).getCount());//ExclusiveGateway_1
		Assert.assertEquals(3, activityStats.get(2).getCount());//ExclusiveGateway_2
		Assert.assertEquals(1, activityStats.get(3).getCount());//ServiceTask_1
		Assert.assertEquals(1, activityStats.get(4).getCount());//ServiceTask_2
		Assert.assertEquals(1, activityStats.get(5).getCount());//ServiceTask_3
		Assert.assertEquals(3, activityStats.get(6).getCount());//StartEvent_1
		
		
	}

	private Map<String,Object> withParameters(final String string) {
		return new HashMap<String, Object>(){/**
			 * 
			 */
			private static final long serialVersionUID = -8004353812018269376L;
	
		{
			put("input", string);
		}};
	}

}
