package de.matez.camunda.cockpit.plugin.heatmap.resources;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;

import de.matez.camunda.cockpit.plugin.heatmap.dto.StatsContainerDto;

public class HeatmapEngineSpecificResource extends AbstractCockpitPluginResource {

	public HeatmapEngineSpecificResource(String engineName) {
		super(engineName);
	}
	
	@GET
	@Path("process-definition/{id}/activitystats")
	public List<StatsContainerDto> getActivityStats(
			@PathParam("id") String processDefinitionId) {
		QueryParameters<StatsContainerDto> parameter = new QueryParameters<StatsContainerDto>();
		parameter.setParameter(processDefinitionId);
		return getQueryService().executeQuery(
				"cockpit.heatmap.selectStatsForActitvity", parameter);

	}

}
