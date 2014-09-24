package de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.dto.StatsContainerDto;

public class BpmnStatsEngineSpecificResource extends AbstractCockpitPluginResource {


	public BpmnStatsEngineSpecificResource(String engineName) {
		super(engineName);
	}

	@GET
	@Path("process-definition/{id}/taskstats")
	public List<StatsContainerDto> getTaskActitityStats(
			@PathParam("id") String processDefinitionId) {

		QueryParameters<StatsContainerDto> parameter = new QueryParameters<StatsContainerDto>();
		parameter.setParameter(processDefinitionId);
		return getQueryService().executeQuery(
				"cockpit.bpmn-stats.selectStatsForTaskActitvity",
				parameter);

	}

	@GET
	@Path("process-definition/{id}/stats")
	public StatsContainerDto getProcessInstanceStats(
			@PathParam("id") String processDefinitionId) {
		return getQueryService().executeQuery(
				"cockpit.bpmn-stats.selectStatsForProcessInstances",
				processDefinitionId, StatsContainerDto.class);
	}

}
