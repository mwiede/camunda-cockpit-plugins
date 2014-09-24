package de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.dto;


public class StatsContainerDto {

	private String id;
	private long min;
	private long max;
	private long count;
	private long stddev;
	private long avg;	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public long getMin() {
		return min;
	}
	public void setMin(long min) {
		this.min = min;
	}
	public long getMax() {
		return max;
	}
	public void setMax(long max) {
		this.max = max;
	}
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public long getStddev() {
		return stddev;
	}
	public void setStddev(long stddev) {
		this.stddev = stddev;
	}
	public long getAvg() {
		return avg;
	}
	public void setAvg(long avg) {
		this.avg = avg;
	}
	

}