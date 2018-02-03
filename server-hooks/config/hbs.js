var Handlebars = require('hbs');
var moment = require('moment');

Handlebars.registerHelper('formatDateTime', function (date, format) {
    return moment(date).format(format);
});

Handlebars.registerHelper('eventStatus', function (startDate, endDate) {
    var start = moment(startDate);
    var end = moment(endDate);
    var now = moment();
    if(now.diff(start) >= 0 && now.diff(end) <= 0) {
        return 'happening now'
    } else if(now.diff(end) >= 0) {
        return 'completed'
    }
    return 'scheduled';
});

Handlebars.registerHelper('equals', function (a, b, options) {
    if(a === b) {
        return options.fn(this);
    }
    return '';
});

Handlebars.registerHelper('inc', function (a) {
    return a+1;
});
