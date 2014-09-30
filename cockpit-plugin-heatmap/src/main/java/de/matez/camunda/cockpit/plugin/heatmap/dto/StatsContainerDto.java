package de.matez.camunda.cockpit.plugin.heatmap.dto;

import java.io.Serializable;

public class StatsContainerDto implements Serializable,
		Comparable<StatsContainerDto> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6876213796557883909L;
	
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

	@Override
	public int compareTo(StatsContainerDto o) {
		return this.getId().compareTo(o.getId());
	}

}