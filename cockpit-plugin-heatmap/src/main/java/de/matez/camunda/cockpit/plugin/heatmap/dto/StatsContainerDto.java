package de.matez.camunda.cockpit.plugin.heatmap.dto;

public class StatsContainerDto {

	private String id;
	private long count;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

}