function getDate(ago, asEpoche) {
    var now = new Date();
    var diff = ago.substring(0, ago.length-1);
    if(ago.endsWith('m')) {
        now.setMinutes(now.getMinutes() - diff);
    } else if(ago.endsWith('h')) {
        now.setHours(now.getHours() - diff);
    }
    if(asEpoche) {
        return now.getTime();
    } else {
        return now.toISOString();
    }
}

module.exports = getDate;