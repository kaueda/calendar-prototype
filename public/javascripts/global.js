// DOM Ready =============================================================
$(document).ready(function() {

    if ($('#scheduler_here').length) {
        scheduler.init('scheduler_here', new Date(2017,7,4), "month");
        scheduler.load("/calendar/data", "json");
        scheduler.templates.xml_date = function(value){ return new Date(value); };
        scheduler.config.xml_date = "%Y-%m-%d %H:%i";
        
        var dp = new dataProcessor("/calendar/data");
        dp.init(scheduler);
        dp.setTransactionMode("POST", false);
    }
});
