$(document).ready(function () {
	$(".resources .add").click(function () {
		var row = $(this).parents().find(".resources").find(".resource:first").clone(true);
		$(row).find("input").each(function () {
			$(this).val("");
		});
		var tbody = $(this).parents().find(".resources tbody");
		$(tbody).append(row);
	});
	
	$(".timetables .add").click(function () {
		var row = $(this).parents().find(".timetables").find(".timetable:first").clone(true);
		$(row).find("input").each(function () {
			$(this).val("");
		});
		var tbody = $(this).parents().find(".timetables tbody");
		$(tbody).append(row);
	});
});