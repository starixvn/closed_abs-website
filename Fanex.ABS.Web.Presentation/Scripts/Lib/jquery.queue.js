//********
/// Queue handler
//********
var Queue = function() {
    this.QueueItems = [];
    if (typeof this.timerId != "undefined") {
        window.clearInterval(this.timerId);
    }
    this.finish = false;
}
Queue.prototype = {
    receive: function(data) {
        if (typeof data != "undefined") {
            this.QueueItems.push(data);
        }
    },
    process: function(callBack, interval, finishCallback) {
        this.timerId = window.setInterval($.proxy(function() {
            if (this.QueueItems.length > 0) {
                var data = this.QueueItems.pop();
                if (callBack && data) {
                    callBack(data);
                }
            }
            else {
                this.finish = true;
                clearInterval(this.timerId);
                if (finishCallback) finishCallback();
            }
        }, this), interval);
    }
};