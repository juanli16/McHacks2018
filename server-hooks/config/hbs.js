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

Handlebars.registerHelper('nl2br', function(text) {
    var nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    return new Handlebars.SafeString(nl2br);
});
